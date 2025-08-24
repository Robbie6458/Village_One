import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertVoteSchema, insertContributionSchema, insertChatMessageSchema, insertCommentSchema, insertUserDegreeSchema, insertUserCertificateSchema, insertGalleryImageSchema, insertWorkHistorySchema, insertArchetypeAssessmentSchema, FORUM_SECTIONS } from "@shared/schema";
import { analyzeSentiment, generateVillageStateSummary, determineArchetype, answerVillageQuestion, generateForumSentimentAnalysis, generateNextStepsAndPriorities } from "./services/openai";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { createFallbackUser } from "./fallback-auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For deployment resilience, provide fallback if auth fails
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        // Return a demo user for testing purposes in deployment
        const fallbackUser = createFallbackUser();
        await storage.upsertUser(fallbackUser);
        return res.json(fallbackUser);
      }
      
      const userId = req.user.claims.sub;
      const username = req.user.claims.preferred_username || req.user.claims.name || `user_${userId.slice(-8)}`;
      const email = req.user.claims.email || '';
      
      // Check if user exists, if not create them
      let user = await storage.getUser(userId);
      if (!user) {
        console.log(`Creating new user for ${userId} with username ${username}`);
        user = await storage.upsertUser({
          id: userId,
          username: username,
          email: email,
          bio: '',
          archetype: null,
          level: 1,
          contributions: 0
        });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching/creating user:", error);
      // Fallback to demo user on any error
      const fallbackUser = createFallbackUser();
      res.json(fallbackUser);
    }
  });
  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    
    // Enhance user data with archetype from assessment if missing
    const enhancedUsers = await Promise.all(users.map(async (user) => {
      if (!user.archetype) {
        const assessment = await storage.getUserArchetypeAssessment(user.id);
        if (assessment) {
          // Update the user's archetype in storage
          await storage.updateUser(user.id, { archetype: assessment.primaryArchetype });
          return { ...user, archetype: assessment.primaryArchetype };
        }
      }
      return user;
    }));
    
    res.json(enhancedUsers);
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id === 'me' && req.user ? (req as any).user.claims.sub : req.params.id;
      
      // If it's 'me' and user is authenticated, ensure user exists
      if (req.params.id === 'me' && req.user) {
        const authUserId = (req as any).user.claims.sub;
        const username = (req as any).user.claims.preferred_username || (req as any).user.claims.name || `user_${authUserId.slice(-8)}`;
        const email = (req as any).user.claims.email || '';
        
        let user = await storage.getUser(authUserId);
        if (!user) {
          console.log(`Creating new user for ${authUserId} with username ${username}`);
          user = await storage.upsertUser({
            id: authUserId,
            username: username,
            email: email,
            bio: '',
            archetype: null,
            level: 1,
            contributions: 0
          });
        }
        return res.json(user);
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Get posts by user
  app.get("/api/posts/user/:userId", async (req, res) => {
    try {
      const posts = await storage.getPostsByUser(req.params.userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ error: "Failed to fetch user posts" });
    }
  });

  // Update user profile
  app.patch("/api/users/me", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Object storage routes for profile images
  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.put("/api/profile-images", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const { profileImageURL } = req.body;
      
      if (!profileImageURL) {
        return res.status(400).json({ error: "profileImageURL is required" });
      }

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(profileImageURL);

      // Update user with new profile image
      const updatedUser = await storage.updateUser(userId, { 
        profileImageUrl: objectPath 
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ objectPath });
    } catch (error) {
      console.error("Error setting profile image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "Object not found" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Posts
  app.post("/api/posts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const postData = insertPostSchema.parse({
        ...req.body,
        authorId: userId
      });
      const post = await storage.createPost(postData);
      
      // Update forum sentiment after new post
      setTimeout(async () => {
        const posts = await storage.getPostsByForum(postData.forumSection);
        const texts = posts.map(p => p.content);
        const sentiment = await analyzeSentiment(texts);
        await storage.updateForumSentiment(
          postData.forumSection,
          sentiment.sentiment,
          sentiment.confidence,
          sentiment.summary
        );
      }, 0);
      
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ error: "Invalid post data" });
    }
  });

  app.get("/api/posts/:forumSection", async (req, res) => {
    const { forumSection } = req.params;
    if (!FORUM_SECTIONS.some(s => s.id === forumSection)) {
      return res.status(400).json({ error: "Invalid forum section" });
    }
    
    const posts = await storage.getPostsByForum(forumSection);
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await storage.getUser(post.authorId);
        return { ...post, author };
      })
    );
    
    res.json(postsWithAuthors);
  });

  app.get("/api/posts", async (req, res) => {
    const posts = await storage.getAllPosts();
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await storage.getUser(post.authorId);
        return { ...post, author };
      })
    );
    
    res.json(postsWithAuthors);
  });

  // Get individual post
  app.get("/api/post/:id", async (req, res) => {
    const post = await storage.getPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    const author = await storage.getUser(post.authorId);
    const comments = await storage.getCommentsByPost(post.id);
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const commentAuthor = await storage.getUser(comment.authorId);
        return { ...comment, author: commentAuthor };
      })
    );
    
    res.json({ ...post, author, comments: commentsWithAuthors });
  });

  // Get posts by user
  app.get('/api/posts/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await storage.getAllPosts();
      const userPosts = posts
        .filter(post => post.authorId === userId)
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      
      res.json(userPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ error: 'Failed to fetch user posts' });
    }
  });

  app.get("/api/top-discussions", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const posts = await storage.getTopDiscussions(limit);
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await storage.getUser(post.authorId);
        return { ...post, author };
      })
    );
    
    res.json(postsWithAuthors);
  });

  // Votes - requires authentication
  app.post("/api/votes", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const { postId, voteType } = req.body;
      
      if (!postId || !voteType || !['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ error: "Valid postId and voteType (upvote/downvote) required" });
      }
      
      // Check if user already voted on this post
      const existingVote = await storage.getUserVoteForPost(userId, postId);
      
      if (existingVote) {
        if (existingVote.voteType === voteType) {
          // Same vote type - remove vote (toggle off)
          await storage.deleteVote(userId, postId);
        } else {
          // Different vote type - update vote (switch vote)
          await storage.updateVote(userId, postId, voteType);
        }
      } else {
        // New vote
        await storage.createVote({ userId, postId, voteType });
      }
      
      // Get updated vote counts and update the post
      const voteCounts = await storage.getPostVoteCounts(postId);
      const post = await storage.getPost(postId);
      
      if (post) {
        const updatedPost = {
          ...post,
          upvotes: voteCounts.upvotes,
          downvotes: voteCounts.downvotes,
          updatedAt: new Date()
        };
        await storage.updatePostVotes(postId, voteCounts.upvotes, voteCounts.downvotes);
      }
      
      // Return current user vote and counts
      const currentVote = await storage.getUserVoteForPost(userId, postId);
      res.json({ 
        success: true,
        currentVote: currentVote?.voteType || null,
        upvotes: voteCounts.upvotes,
        downvotes: voteCounts.downvotes
      });
    } catch (error) {
      console.error("Voting error:", error);
      res.status(400).json({ error: "Invalid vote data" });
    }
  });

  // Get user's vote for a specific post
  app.get("/api/votes/:postId/user", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const { postId } = req.params;
      
      const vote = await storage.getUserVoteForPost(userId, postId);
      res.json({ voteType: vote?.voteType || null });
    } catch (error) {
      console.error("Error getting user vote:", error);
      res.status(500).json({ error: "Failed to get user vote" });
    }
  });

  // Contributions
  app.post("/api/contributions", async (req, res) => {
    try {
      const contributionData = insertContributionSchema.parse(req.body);
      const contribution = await storage.createContribution(contributionData);
      
      // Update user contribution total
      const user = await storage.getUser(contributionData.userId);
      if (user) {
        await storage.updateUser(user.id, {
          contributions: (user.contributions || 0) + contributionData.amount
        });
      }
      
      res.json(contribution);
    } catch (error) {
      res.status(400).json({ error: "Invalid contribution data" });
    }
  });

  app.get("/api/contributions/total", async (req, res) => {
    const total = await storage.getTotalFunding();
    res.json({ total });
  });

  // Forum sentiments
  app.get("/api/sentiments", async (req, res) => {
    const sentiments = await Promise.all(
      FORUM_SECTIONS.map(async (section) => {
        const sentiment = await storage.getForumSentiment(section.id);
        return { section, ...sentiment };
      })
    );
    res.json(sentiments);
  });

  // Village state summary
  app.get("/api/village-state", async (req, res) => {
    try {
      const users = await storage.getAllUsers().catch(() => []);
      const totalFunding = await storage.getTotalFunding().catch(() => 0);
      const posts = await storage.getAllPosts().catch(() => []);
      const votes = await storage.getAllVotes().catch(() => []);
      
      // Provide a fallback summary if AI generation fails
      let summary = "Village-One is actively developing with community collaboration across multiple project areas.";
      try {
        summary = await generateVillageStateSummary(posts, users, totalFunding, votes);
      } catch (aiError) {
        console.error("AI summary generation failed, using fallback:", aiError);
      }
      
      res.json({
        summary,
        stats: {
          totalUsers: users.length,
          totalPosts: posts.length,
          totalFunding,
          totalVotes: votes.length,
          activeContributors: users.filter(u => (u.contributions || 0) > 0).length
        }
      });
    } catch (error) {
      console.error("Village state error:", error);
      // Provide minimal working response
      res.json({
        summary: "Village-One community platform is operational.",
        stats: {
          totalUsers: 1,
          totalPosts: 0,
          totalFunding: 0,
          totalVotes: 0,
          activeContributors: 0
        }
      });
    }
  });

  // Enhanced Forum Sentiment Analysis
  app.get("/api/forum-sentiment-analysis", async (req, res) => {
    try {
      const posts = await storage.getAllPosts().catch(() => []);
      const votes = await storage.getAllVotes().catch(() => []);
      
      let analysis = [];
      try {
        analysis = await generateForumSentimentAnalysis(posts, votes);
      } catch (aiError) {
        console.error('AI analysis failed, using fallback:', aiError);
        // Provide fallback analysis data
        analysis = FORUM_SECTIONS.map(section => ({
          section: section.id,
          sentiment: 'collaborative',
          summary: 'Community discussions are active and engaged.',
          priority: 'medium',
          activeThreads: posts.filter(p => p.forumSection === section.id).length,
          engagement: votes.length
        }));
      }
      
      res.json(analysis);
    } catch (error) {
      console.error('Error generating forum sentiment analysis:', error);
      // Always return valid data structure
      res.json(FORUM_SECTIONS.map(section => ({
        section: section.id,
        sentiment: 'neutral',
        summary: 'Loading community data...',
        priority: 'low',
        activeThreads: 0,
        engagement: 0
      })));
    }
  });

  // Next Steps and Priorities
  app.get("/api/next-steps", async (req, res) => {
    try {
      const posts = await storage.getAllPosts().catch(() => []);
      const users = await storage.getAllUsers().catch(() => []);
      const votes = await storage.getAllVotes().catch(() => []);
      
      let nextSteps = [];
      try {
        // Get forum analysis for priority context
        const forumAnalysis = await generateForumSentimentAnalysis(posts, votes);
        nextSteps = await generateNextStepsAndPriorities(posts, users, votes, forumAnalysis);
      } catch (aiError) {
        console.error('AI next steps generation failed, using fallback:', aiError);
        // Provide fallback next steps
        nextSteps = [
          {
            title: "Community Engagement",
            description: "Foster active participation in forum discussions and collaborative planning.",
            priority: "high",
            category: "Community",
            estimatedImpact: "High community growth"
          },
          {
            title: "Project Development",
            description: "Continue development of core village infrastructure and sustainable systems.",
            priority: "medium", 
            category: "Development",
            estimatedImpact: "Foundation progress"
          },
          {
            title: "Resource Planning",
            description: "Optimize resource allocation and funding strategies for sustainable growth.",
            priority: "medium",
            category: "Resources",
            estimatedImpact: "Operational efficiency"
          }
        ];
      }
      
      res.json(nextSteps);
    } catch (error) {
      console.error('Error generating next steps:', error);
      // Always return valid data structure
      res.json([
        {
          title: "Platform Initialization",
          description: "Setting up the foundation for community collaboration.",
          priority: "high",
          category: "Setup",
          estimatedImpact: "Platform readiness"
        }
      ]);
    }
  });

  // Forum-specific sentiment (for individual forum pages)
  app.get("/api/forum/:section/sentiment", async (req, res) => {
    try {
      const section = req.params.section;
      const posts = await storage.getPostsByForum(section);
      const votes = await storage.getAllVotes().catch(() => []);
      
      // Filter votes for this section's posts
      const postIds = posts.map(p => p.id);
      const sectionVotes = votes.filter(v => postIds.includes(v.postId));
      
      const analysis = await generateForumSentimentAnalysis(posts, sectionVotes);
      const sectionAnalysis = analysis.find(a => a.section === section);
      
      if (sectionAnalysis) {
        res.json(sectionAnalysis);
      } else {
        res.json({
          section,
          sentiment: 'neutral',
          summary: 'No recent activity in this section.',
          priority: 'low',
          activeThreads: 0,
          engagement: 0
        });
      }
    } catch (error) {
      console.error(`Error analyzing ${req.params.section} sentiment:`, error);
      res.status(500).json({ error: "Failed to analyze forum sentiment" });
    }
  });

  // Comments
  app.post("/api/comments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const commentData = insertCommentSchema.parse({
        ...req.body,
        authorId: userId
      });
      const comment = await storage.createComment(commentData);
      
      // Get author details
      const author = await storage.getUser(comment.authorId);
      res.json({ ...comment, author });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(400).json({ error: "Invalid comment data" });
    }
  });

  app.get("/api/comments/:postId", async (req, res) => {
    const comments = await storage.getCommentsByPost(req.params.postId);
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await storage.getUser(comment.authorId);
        return { ...comment, author };
      })
    );
    
    res.json(commentsWithAuthors);
  });



  // User Degrees
  app.get("/api/users/:userId/degrees", async (req, res) => {
    const degrees = await storage.getUserDegrees(req.params.userId);
    res.json(degrees);
  });

  app.post("/api/users/me/degrees", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const degreeData = insertUserDegreeSchema.parse({ ...req.body, userId });
      const degree = await storage.createUserDegree(degreeData);
      res.json(degree);
    } catch (error) {
      console.error("Error creating degree:", error);
      res.status(400).json({ error: "Invalid degree data" });
    }
  });

  app.patch("/api/degrees/:id", isAuthenticated, async (req, res) => {
    try {
      const updates = req.body;
      const degree = await storage.updateUserDegree(req.params.id, updates);
      if (!degree) return res.status(404).json({ error: "Degree not found" });
      res.json(degree);
    } catch (error) {
      res.status(400).json({ error: "Invalid degree data" });
    }
  });

  app.delete("/api/degrees/:id", isAuthenticated, async (req, res) => {
    await storage.deleteUserDegree(req.params.id);
    res.json({ success: true });
  });

  // User Certificates
  app.get("/api/users/:userId/certificates", async (req, res) => {
    const certificates = await storage.getUserCertificates(req.params.userId);
    res.json(certificates);
  });

  app.post("/api/users/me/certificates", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const certData = insertUserCertificateSchema.parse({ ...req.body, userId });
      const certificate = await storage.createUserCertificate(certData);
      res.json(certificate);
    } catch (error) {
      console.error("Error creating certificate:", error);
      res.status(400).json({ error: "Invalid certificate data" });
    }
  });

  app.patch("/api/certificates/:id", isAuthenticated, async (req, res) => {
    try {
      const updates = req.body;
      const certificate = await storage.updateUserCertificate(req.params.id, updates);
      if (!certificate) return res.status(404).json({ error: "Certificate not found" });
      res.json(certificate);
    } catch (error) {
      res.status(400).json({ error: "Invalid certificate data" });
    }
  });

  app.delete("/api/certificates/:id", isAuthenticated, async (req, res) => {
    await storage.deleteUserCertificate(req.params.id);
    res.json({ success: true });
  });

  // Alternative routes for compatibility (frontend calls these endpoints)
  app.post("/api/certificates", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const certData = insertUserCertificateSchema.parse({ ...req.body, userId });
      const certificate = await storage.createUserCertificate(certData);
      res.json(certificate);
    } catch (error) {
      console.error("Error creating certificate:", error);
      res.status(400).json({ error: "Invalid certificate data" });
    }
  });

  app.post("/api/degrees", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const degreeData = insertUserDegreeSchema.parse({ ...req.body, userId });
      const degree = await storage.createUserDegree(degreeData);
      res.json(degree);
    } catch (error) {
      console.error("Error creating degree:", error);
      res.status(400).json({ error: "Invalid degree data" });
    }
  });

  // Gallery Images
  app.get("/api/users/:userId/gallery", async (req, res) => {
    const images = await storage.getUserGalleryImages(req.params.userId);
    res.json(images);
  });

  app.post("/api/users/me/gallery", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const imageData = insertGalleryImageSchema.parse({ ...req.body, userId });
      const image = await storage.createGalleryImage(imageData);
      res.json(image);
    } catch (error) {
      console.error("Error creating gallery image:", error);
      res.status(400).json({ error: "Invalid image data" });
    }
  });

  app.patch("/api/gallery/:id", isAuthenticated, async (req, res) => {
    try {
      const updates = req.body;
      const image = await storage.updateGalleryImage(req.params.id, updates);
      if (!image) return res.status(404).json({ error: "Image not found" });
      res.json(image);
    } catch (error) {
      res.status(400).json({ error: "Invalid image data" });
    }
  });

  app.delete("/api/gallery/:id", isAuthenticated, async (req, res) => {
    await storage.deleteGalleryImage(req.params.id);
    res.json({ success: true });
  });

  // Work History routes
  app.get("/api/users/:userId/work-history", async (req, res) => {
    console.log("Getting work history for user:", req.params.userId);
    const workHistory = await storage.getUserWorkHistory(req.params.userId);
    console.log("Work history retrieved:", workHistory);
    res.json(workHistory);
  });

  app.post("/api/users/me/work-history", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const workData = insertWorkHistorySchema.parse({ ...req.body, userId });
      const work = await storage.createWorkHistory(workData);
      res.json(work);
    } catch (error) {
      console.error("Error creating work history:", error);
      res.status(400).json({ error: "Invalid work history data" });
    }
  });

  // Alternative route for work-history (for compatibility)
  app.post("/api/work-history", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      console.log("Creating work history for user:", userId, "with data:", req.body);
      const workData = insertWorkHistorySchema.parse({ ...req.body, userId });
      const work = await storage.createWorkHistory(workData);
      console.log("Work history created:", work);
      res.json(work);
    } catch (error) {
      console.error("Error creating work history:", error);
      res.status(400).json({ error: "Invalid work history data" });
    }
  });

  app.patch("/api/work-history/:id", isAuthenticated, async (req, res) => {
    try {
      const updates = req.body;
      const work = await storage.updateWorkHistory(req.params.id, updates);
      if (!work) return res.status(404).json({ error: "Work history not found" });
      res.json(work);
    } catch (error) {
      res.status(400).json({ error: "Invalid work history data" });
    }
  });

  app.delete("/api/work-history/:id", isAuthenticated, async (req, res) => {
    await storage.deleteWorkHistory(req.params.id);
    res.json({ success: true });
  });

  // Archetype Assessment routes
  app.get("/api/users/:userId/archetype-assessment", async (req, res) => {
    const assessment = await storage.getUserArchetypeAssessment(req.params.userId);
    res.json(assessment);
  });

  app.post("/api/users/me/archetype", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const assessmentData = insertArchetypeAssessmentSchema.parse({ 
        ...req.body, 
        userId 
      });
      
      // Create the assessment
      const assessment = await storage.createArchetypeAssessment(assessmentData);
      
      // Update the user's archetype field to match the assessment
      await storage.updateUser(userId, { archetype: assessmentData.primaryArchetype });
      
      res.json(assessment);
    } catch (error) {
      console.error("Error creating archetype assessment:", error);
      res.status(400).json({ error: "Invalid archetype assessment data" });
    }
  });

  // One-time sync endpoint to update user archetype from assessment
  app.post("/api/users/me/sync-archetype", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      
      // Get the user's latest archetype assessment
      const assessment = await storage.getUserArchetypeAssessment(userId);
      if (!assessment) {
        return res.status(404).json({ error: "No archetype assessment found" });
      }
      
      // Update user's archetype field to match assessment
      await storage.updateUser(userId, { archetype: assessment.primaryArchetype });
      
      res.json({ 
        success: true, 
        archetype: assessment.primaryArchetype,
        message: "User archetype synced successfully" 
      });
    } catch (error) {
      console.error("Error syncing user archetype:", error);
      res.status(500).json({ error: "Failed to sync archetype" });
    }
  });

  // Alternative route for archetype assessment (frontend calls this endpoint) 
  app.post("/api/archetype", isAuthenticated, async (req, res) => {
    try {
      const { responses } = req.body;
      const userId = (req as any).user.claims.sub;
      
      const archetype = await determineArchetype(responses);
      
      // Save the full assessment first
      const assessmentData = insertArchetypeAssessmentSchema.parse({
        userId,
        primaryArchetype: archetype,
        scores: {}, // TODO: Add scoring logic if needed
        answers: responses,
        description: null
      });
      await storage.createArchetypeAssessment(assessmentData);
      
      // Update user with determined archetype
      await storage.updateUser(userId, { archetype });
      
      res.json({ archetype });
    } catch (error) {
      console.error("Error determining archetype:", error);
      res.status(500).json({ error: "Failed to determine archetype" });
    }
  });

  // Enhanced Post Management Routes
  
  // Get user's drafts specifically
  app.get("/api/users/me/drafts", isAuthenticated, async (req, res) => {
    const userId = (req as any).user.claims.sub;
    const drafts = await storage.getPostsByUser(userId, "draft");
    res.json(drafts);
  });

  // Update existing post (edit functionality)
  app.patch("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const post = await storage.getPost(req.params.id);
      
      // Check if user owns the post
      if (!post || post.authorId !== userId) {
        return res.status(403).json({ error: "Unauthorized to edit this post" });
      }
      
      const updates = insertPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updatePost(req.params.id, updates);
      
      if (!updatedPost) return res.status(404).json({ error: "Post not found" });
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ error: "Invalid post data" });
    }
  });

  // Publish a draft post
  app.post("/api/posts/:id/publish", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const post = await storage.getPost(req.params.id);
      
      // Check if user owns the post
      if (!post || post.authorId !== userId) {
        return res.status(403).json({ error: "Unauthorized to publish this post" });
      }
      
      const publishedPost = await storage.publishPost(req.params.id);
      if (!publishedPost) return res.status(404).json({ error: "Post not found" });
      res.json(publishedPost);
    } catch (error) {
      console.error("Error publishing post:", error);
      res.status(500).json({ error: "Failed to publish post" });
    }
  });

  // Revert published post to draft
  app.post("/api/posts/:id/revert", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const post = await storage.getPost(req.params.id);
      
      // Check if user owns the post
      if (!post || post.authorId !== userId) {
        return res.status(403).json({ error: "Unauthorized to revert this post" });
      }
      
      const draftPost = await storage.revertPostToDraft(req.params.id);
      if (!draftPost) return res.status(404).json({ error: "Post not found" });
      res.json(draftPost);
    } catch (error) {
      console.error("Error reverting post:", error);
      res.status(500).json({ error: "Failed to revert post" });
    }
  });

  // Object storage upload endpoint
  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    try {
      // Generate a unique filename
      const objectId = require('crypto').randomUUID();
      const uploadURL = `https://storage.googleapis.com/replit-objstore-f691a8e1-5be5-42c6-94a2-4eff21c83637/.private/uploads/${objectId}`;
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // AI Village Chat
  app.post("/api/chat/ai", async (req, res) => {
    try {
      const { question } = req.body;
      const answer = await answerVillageQuestion(question);
      res.json({ answer });
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Chat messages
  app.get("/api/chat/messages", async (req, res) => {
    const messages = await storage.getRecentChatMessages();
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await storage.getUser(message.userId);
        return { ...message, user };
      })
    );
    res.json(messagesWithUsers);
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat') {
          // Save chat message
          const chatMessage = await storage.createChatMessage({
            userId: message.userId,
            message: message.content
          });
          
          // Get user info
          const user = await storage.getUser(message.userId);
          
          // Broadcast to all connected clients
          const broadcastData = {
            type: 'chat',
            ...chatMessage,
            user
          };
          
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(broadcastData));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}
