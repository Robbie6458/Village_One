import { 
  type User, 
  type InsertUser, 
  type UpsertUser,
  type Post, 
  type InsertPost,
  type Vote,
  type InsertVote,
  type Contribution,
  type InsertContribution,
  type ChatMessage,
  type InsertChatMessage,
  type ForumSentiment,
  type Comment,
  type InsertComment,
  type UserDegree,
  type InsertUserDegree,
  type UserCertificate,
  type InsertUserCertificate,
  type GalleryImage,
  type InsertGalleryImage,
  type WorkHistory,
  type InsertWorkHistory,
  type ArchetypeAssessment,
  type InsertArchetypeAssessment,
  FORUM_SECTIONS
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Posts
  createPost(post: InsertPost): Promise<Post>;
  getPostsByForum(forumSection: string, status?: string): Promise<Post[]>;
  getAllPosts(): Promise<Post[]>;
  getTopDiscussions(limit?: number): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  getPostsByUser(userId: string, status?: string): Promise<Post[]>;
  updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined>;
  updatePostVotes(id: string, upvotes: number, downvotes: number): Promise<Post | undefined>;
  publishPost(id: string): Promise<Post | undefined>;
  revertPostToDraft(id: string): Promise<Post | undefined>;

  // Votes  
  createVote(vote: InsertVote): Promise<Vote>;
  getUserVoteForPost(userId: string, postId: string): Promise<Vote | undefined>;
  deleteVote(userId: string, postId: string): Promise<void>;
  getAllVotes(): Promise<Vote[]>;

  // Contributions
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  getContributionsByUser(userId: string): Promise<Contribution[]>;
  getTotalFunding(): Promise<number>;

  // Chat Messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getRecentChatMessages(limit?: number): Promise<ChatMessage[]>;

  // Forum Sentiments
  getForumSentiment(forumSection: string): Promise<ForumSentiment | undefined>;
  updateForumSentiment(forumSection: string, sentiment: string, confidence: number, summary: string): Promise<ForumSentiment>;

  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByPost(postId: string): Promise<Comment[]>;

  // User Degrees
  createUserDegree(degree: InsertUserDegree): Promise<UserDegree>;
  getUserDegrees(userId: string): Promise<UserDegree[]>;
  updateUserDegree(id: string, updates: Partial<InsertUserDegree>): Promise<UserDegree | undefined>;
  deleteUserDegree(id: string): Promise<void>;

  // User Certificates
  createUserCertificate(certificate: InsertUserCertificate): Promise<UserCertificate>;
  getUserCertificates(userId: string): Promise<UserCertificate[]>;
  updateUserCertificate(id: string, updates: Partial<InsertUserCertificate>): Promise<UserCertificate | undefined>;
  deleteUserCertificate(id: string): Promise<void>;

  // Gallery Images
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  getUserGalleryImages(userId: string): Promise<GalleryImage[]>;
  updateGalleryImage(id: string, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: string): Promise<void>;

  // Work History
  createWorkHistory(workHistory: InsertWorkHistory): Promise<WorkHistory>;
  getUserWorkHistory(userId: string): Promise<WorkHistory[]>;
  updateWorkHistory(id: string, updates: Partial<InsertWorkHistory>): Promise<WorkHistory | undefined>;
  deleteWorkHistory(id: string): Promise<void>;

  // Archetype Assessments
  createArchetypeAssessment(assessment: InsertArchetypeAssessment): Promise<ArchetypeAssessment>;
  getUserArchetypeAssessment(userId: string): Promise<ArchetypeAssessment | null>;
  updateUserArchetype(userId: string, archetype: string): Promise<void>;


}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private votes: Map<string, Vote>;
  private contributions: Map<string, Contribution>;
  private chatMessages: Map<string, ChatMessage>;
  private forumSentiments: Map<string, ForumSentiment>;
  private comments: Map<string, Comment>;
  private userDegrees: Map<string, UserDegree>;
  private userCertificates: Map<string, UserCertificate>;
  private galleryImages: Map<string, GalleryImage>;
  private workHistory: Map<string, WorkHistory>;
  private archetypeAssessments: Map<string, ArchetypeAssessment>;


  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.votes = new Map();
    this.contributions = new Map();
    this.chatMessages = new Map();
    this.forumSentiments = new Map();
    this.comments = new Map();
    this.userDegrees = new Map();
    this.userCertificates = new Map();
    this.galleryImages = new Map();
    this.workHistory = new Map();
    this.archetypeAssessments = new Map();

    
    // Clean start - no sample data for production
    
    // Initialize forum sentiments
    FORUM_SECTIONS.forEach(section => {
      const sentiment: ForumSentiment = {
        id: randomUUID(),
        forumSection: section.id,
        sentiment: "neutral",
        confidence: 75,
        summary: "Community discussions are active and engaged.",
        lastUpdated: new Date(),
      };
      this.forumSentiments.set(section.id, sentiment);
    });
  }





  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Ensure we have an ID for the user
    if (!userData.id) {
      throw new Error("User ID is required for upsert operation");
    }
    
    // Check if user exists by ID
    let existingUser = this.users.get(userData.id);
    
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        socialLinks: userData.socialLinks as { instagram?: string; facebook?: string; x?: string; } | null,
        website: userData.website || existingUser.website,
        location: userData.location || existingUser.location,
        updatedAt: new Date(),
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user  
      const newUser: User = {
        id: userData.id,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        username: userData.username || userData.email?.split('@')[0] || `user_${userData.id.slice(0, 8)}`,
        archetype: userData.archetype || null,
        level: userData.level || 1,
        contributions: userData.contributions || 0,
        bio: userData.bio || null,
        socialLinks: userData.socialLinks as { instagram?: string; facebook?: string; x?: string; } | null,
        skills: userData.skills || null,
        website: userData.website || null,
        location: userData.location || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(userData.id, newUser);
      return newUser;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      username: insertUser.username || null,
      archetype: insertUser.archetype || null,
      level: insertUser.level || 1,
      contributions: insertUser.contributions || 0,
      bio: insertUser.bio || null,
      socialLinks: insertUser.socialLinks as { instagram?: string; facebook?: string; x?: string; } | null,
      skills: insertUser.skills || null,
      website: insertUser.website || null,
      location: insertUser.location || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      ...updates,
      socialLinks: updates.socialLinks as { instagram?: string; facebook?: string; x?: string; } | null || user.socialLinks,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const now = new Date();
    const post: Post = {
      ...insertPost,
      id,
      upvotes: 0,
      downvotes: 0,
      images: insertPost.images || [],
      createdAt: now,
      updatedAt: now,
      publishedAt: (insertPost.status || "published") === "published" ? now : null,
      status: insertPost.status || "published",
    };
    this.posts.set(id, post);
    return post;
  }

  async getPostsByForum(forumSection: string, status?: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => {
        const matchesForum = post.forumSection === forumSection;
        const matchesStatus = status ? post.status === status : post.status === "published";
        return matchesForum && matchesStatus;
      })
      .sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)));
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.status === "published")
      .sort((a, b) => (b.createdAt || new Date()).getTime() - (a.createdAt || new Date()).getTime());
  }

  async getTopDiscussions(limit = 5): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)))
      .slice(0, limit);
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByUser(userId: string, status?: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => {
        const matchesUser = post.authorId === userId;
        const matchesStatus = status ? post.status === status : true; // Show all if no status specified
        return matchesUser && matchesStatus;
      })
      .sort((a, b) => (new Date(b.createdAt || 0)).getTime() - (new Date(a.createdAt || 0)).getTime());
  }

  async updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { 
      ...post, 
      ...updates,
      updatedAt: new Date(),
      publishedAt: updates.status === "published" && post.status === "draft" ? new Date() : post.publishedAt
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async updatePostVotes(id: string, upvotes: number, downvotes: number): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, upvotes, downvotes };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async publishPost(id: string): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { 
      ...post, 
      status: "published" as const,
      publishedAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async revertPostToDraft(id: string): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { 
      ...post, 
      status: "draft" as const,
      updatedAt: new Date()
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const vote: Vote = { 
      ...insertVote, 
      id,
      createdAt: new Date()
    };
    this.votes.set(id, vote);
    return vote;
  }

  async getUserVoteForPost(userId: string, postId: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.userId === userId && vote.postId === postId
    );
  }

  async deleteVote(userId: string, postId: string): Promise<void> {
    const vote = Array.from(this.votes.entries()).find(
      ([, vote]) => vote.userId === userId && vote.postId === postId
    );
    if (vote) {
      this.votes.delete(vote[0]);
    }
  }

  async getAllVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values());
  }

  async updateVote(userId: string, postId: string, voteType: string): Promise<Vote> {
    // Delete existing vote
    await this.deleteVote(userId, postId);
    // Create new vote
    return this.createVote({ userId, postId, voteType });
  }

  async getPostVoteCounts(postId: string): Promise<{ upvotes: number; downvotes: number }> {
    const votes = Array.from(this.votes.values()).filter(vote => vote.postId === postId);
    const upvotes = votes.filter(vote => vote.voteType === 'upvote').length;
    const downvotes = votes.filter(vote => vote.voteType === 'downvote').length;
    return { upvotes, downvotes };
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const id = randomUUID();
    const contribution: Contribution = {
      ...insertContribution,
      id,
      perks: insertContribution.perks || null,
      createdAt: new Date(),
    };
    this.contributions.set(id, contribution);
    return contribution;
  }

  async getContributionsByUser(userId: string): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(
      contribution => contribution.userId === userId
    );
  }

  async getTotalFunding(): Promise<number> {
    return Array.from(this.contributions.values())
      .reduce((total, contribution) => total + contribution.amount, 0);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getRecentChatMessages(limit = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => (b.createdAt || new Date()).getTime() - (a.createdAt || new Date()).getTime())
      .slice(0, limit);
  }

  async getForumSentiment(forumSection: string): Promise<ForumSentiment | undefined> {
    return this.forumSentiments.get(forumSection);
  }

  async updateForumSentiment(forumSection: string, sentiment: string, confidence: number, summary: string): Promise<ForumSentiment> {
    const existing = this.forumSentiments.get(forumSection);
    const updated: ForumSentiment = {
      id: existing?.id || randomUUID(),
      forumSection,
      sentiment,
      confidence,
      summary,
      lastUpdated: new Date(),
    };
    this.forumSentiments.set(forumSection, updated);
    return updated;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => (a.createdAt || new Date()).getTime() - (b.createdAt || new Date()).getTime());
  }

  // User Degrees
  async createUserDegree(insertDegree: InsertUserDegree): Promise<UserDegree> {
    const id = randomUUID();
    const degree: UserDegree = {
      ...insertDegree,
      id,
      year: insertDegree.year || null,
      verified: insertDegree.verified || null,
      createdAt: new Date(),
    };
    this.userDegrees.set(id, degree);
    return degree;
  }

  async getUserDegrees(userId: string): Promise<UserDegree[]> {
    return Array.from(this.userDegrees.values())
      .filter(degree => degree.userId === userId)
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  async updateUserDegree(id: string, updates: Partial<InsertUserDegree>): Promise<UserDegree | undefined> {
    const degree = this.userDegrees.get(id);
    if (!degree) return undefined;
    
    const updatedDegree = { ...degree, ...updates };
    this.userDegrees.set(id, updatedDegree);
    return updatedDegree;
  }

  async deleteUserDegree(id: string): Promise<void> {
    this.userDegrees.delete(id);
  }

  // User Certificates
  async createUserCertificate(insertCertificate: InsertUserCertificate): Promise<UserCertificate> {
    const id = randomUUID();
    const certificate: UserCertificate = {
      ...insertCertificate,
      id,
      issueDate: insertCertificate.issueDate || null,
      expiryDate: insertCertificate.expiryDate || null,
      credentialId: insertCertificate.credentialId || null,
      url: insertCertificate.url || null,
      verified: insertCertificate.verified || null,
      createdAt: new Date(),
    };
    this.userCertificates.set(id, certificate);
    return certificate;
  }

  async getUserCertificates(userId: string): Promise<UserCertificate[]> {
    return Array.from(this.userCertificates.values())
      .filter(cert => cert.userId === userId)
      .sort((a, b) => (b.issueDate || new Date()).getTime() - (a.issueDate || new Date()).getTime());
  }

  async updateUserCertificate(id: string, updates: Partial<InsertUserCertificate>): Promise<UserCertificate | undefined> {
    const certificate = this.userCertificates.get(id);
    if (!certificate) return undefined;
    
    const updatedCertificate = { ...certificate, ...updates };
    this.userCertificates.set(id, updatedCertificate);
    return updatedCertificate;
  }

  async deleteUserCertificate(id: string): Promise<void> {
    this.userCertificates.delete(id);
  }

  // Gallery Images
  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const image: GalleryImage = {
      ...insertImage,
      id,
      title: insertImage.title || null,
      description: insertImage.description || null,
      tags: insertImage.tags || null,
      createdAt: new Date(),
    };
    this.galleryImages.set(id, image);
    return image;
  }

  async getUserGalleryImages(userId: string): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values())
      .filter(image => image.userId === userId)
      .sort((a, b) => (b.createdAt || new Date()).getTime() - (a.createdAt || new Date()).getTime());
  }

  async updateGalleryImage(id: string, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const image = this.galleryImages.get(id);
    if (!image) return undefined;
    
    const updatedImage = { ...image, ...updates };
    this.galleryImages.set(id, updatedImage);
    return updatedImage;
  }

  async deleteGalleryImage(id: string): Promise<void> {
    this.galleryImages.delete(id);
  }



  // Work History methods
  async createWorkHistory(insertWorkHistory: InsertWorkHistory): Promise<WorkHistory> {
    const id = randomUUID();
    const workHistory: WorkHistory = {
      id,
      userId: insertWorkHistory.userId,
      jobTitle: insertWorkHistory.jobTitle,
      company: insertWorkHistory.company,
      location: insertWorkHistory.location || null,
      startDate: insertWorkHistory.startDate,
      endDate: insertWorkHistory.endDate || null,
      isCurrentJob: insertWorkHistory.isCurrentJob || false,
      description: insertWorkHistory.description || null,
      achievements: insertWorkHistory.achievements || null,
      skills: insertWorkHistory.skills || null,
      createdAt: new Date(),
    };
    this.workHistory.set(id, workHistory);
    return workHistory;
  }

  async getUserWorkHistory(userId: string): Promise<WorkHistory[]> {
    return Array.from(this.workHistory.values())
      .filter(work => work.userId === userId)
      .sort((a, b) => {
        // Sort by start date, most recent first
        const aDate = a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
        const bDate = b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
        return bDate.getTime() - aDate.getTime();
      });
  }

  async updateWorkHistory(id: string, updates: Partial<InsertWorkHistory>): Promise<WorkHistory | undefined> {
    const work = this.workHistory.get(id);
    if (!work) return undefined;
    
    const updatedWork = { ...work, ...updates };
    this.workHistory.set(id, updatedWork);
    return updatedWork;
  }

  async deleteWorkHistory(id: string): Promise<void> {
    this.workHistory.delete(id);
  }

  // Archetype Assessment methods
  async createArchetypeAssessment(insertAssessment: InsertArchetypeAssessment): Promise<ArchetypeAssessment> {
    const id = randomUUID();
    const assessment: ArchetypeAssessment = {
      id,
      userId: insertAssessment.userId,
      primaryArchetype: insertAssessment.primaryArchetype,
      scores: insertAssessment.scores,
      description: insertAssessment.description || null,
      answers: insertAssessment.answers,
      completedAt: new Date(),
    };
    
    // Update user's archetype as well
    await this.updateUserArchetype(insertAssessment.userId, insertAssessment.primaryArchetype);
    
    this.archetypeAssessments.set(id, assessment);
    return assessment;
  }

  async getUserArchetypeAssessment(userId: string): Promise<ArchetypeAssessment | null> {
    const assessments = Array.from(this.archetypeAssessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => {
        const aDate = a.completedAt instanceof Date ? a.completedAt : new Date(a.completedAt);
        const bDate = b.completedAt instanceof Date ? b.completedAt : new Date(b.completedAt);
        return bDate.getTime() - aDate.getTime();
      });
    
    return assessments[0] || null;
  }

  async updateUserArchetype(userId: string, archetype: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, archetype };
      this.users.set(userId, updatedUser);
    }
  }
}

// Import database connection
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users, userDegrees, userCertificates, workHistory, galleryImages, archetypeAssessments } from "@shared/schema";

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  // Use MemStorage methods for most operations, but override credential methods
  private memStorage = new MemStorage();

  // Add missing interface method
  async updateUserArchetype(userId: string, archetype: string): Promise<void> {
    return this.memStorage.updateUserArchetype(userId, archetype);
  }

  // Delegate to memStorage for most methods
  async getAllVotes(): Promise<Vote[]> {
    return this.memStorage.getAllVotes();
  }

  async createVote(vote: InsertVote): Promise<Vote> {
    return this.memStorage.createVote(vote);
  }

  async getUserVoteForPost(userId: string, postId: string): Promise<Vote | undefined> {
    return this.memStorage.getUserVoteForPost(userId, postId);
  }

  async deleteVote(userId: string, postId: string): Promise<void> {
    return this.memStorage.deleteVote(userId, postId);
  }

  async updateVote(userId: string, postId: string, voteType: string): Promise<Vote> {
    return this.memStorage.updateVote(userId, postId, voteType);
  }

  async getPostVoteCounts(postId: string): Promise<{ upvotes: number; downvotes: number }> {
    return this.memStorage.getPostVoteCounts(postId);
  }

  async createPost(post: InsertPost): Promise<Post> {
    return this.memStorage.createPost(post);
  }

  async getPostsByForum(forumSection: string, status?: string): Promise<Post[]> {
    return this.memStorage.getPostsByForum(forumSection, status);
  }

  async getAllPosts(): Promise<Post[]> {
    return this.memStorage.getAllPosts();
  }

  async getTopDiscussions(limit?: number): Promise<Post[]> {
    return this.memStorage.getTopDiscussions(limit);
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.memStorage.getPost(id);
  }

  async getPostsByUser(userId: string, status?: string): Promise<Post[]> {
    return this.memStorage.getPostsByUser(userId, status);
  }

  async updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined> {
    return this.memStorage.updatePost(id, updates);
  }

  async updatePostVotes(id: string, upvotes: number, downvotes: number): Promise<Post | undefined> {
    return this.memStorage.updatePostVotes(id, upvotes, downvotes);
  }

  async publishPost(id: string): Promise<Post | undefined> {
    return this.memStorage.publishPost(id);
  }

  async revertPostToDraft(id: string): Promise<Post | undefined> {
    return this.memStorage.revertPostToDraft(id);
  }

  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    return this.memStorage.createContribution(contribution);
  }

  async getContributionsByUser(userId: string): Promise<Contribution[]> {
    return this.memStorage.getContributionsByUser(userId);
  }

  async getTotalFunding(): Promise<number> {
    return this.memStorage.getTotalFunding();
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    return this.memStorage.createChatMessage(message);
  }

  async getRecentChatMessages(limit?: number): Promise<ChatMessage[]> {
    return this.memStorage.getRecentChatMessages(limit);
  }

  async getForumSentiment(forumSection: string): Promise<ForumSentiment | undefined> {
    return this.memStorage.getForumSentiment(forumSection);
  }

  async updateForumSentiment(forumSection: string, sentiment: string, confidence: number, summary: string): Promise<ForumSentiment> {
    return this.memStorage.updateForumSentiment(forumSection, sentiment, confidence, summary);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    return this.memStorage.createComment(comment);
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return this.memStorage.getCommentsByPost(postId);
  }

  // Database-backed user operations
  async getUser(id: string): Promise<User | undefined> {
    // Try database first, fallback to memory
    try {
      const [dbUser] = await db.select().from(users).where(eq(users.id, id));
      if (dbUser) return dbUser;
    } catch (error) {
      console.error("Error getting user from database:", error);
    }
    return this.memStorage.getUser(id);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    // Ensure user exists in database
    try {
      const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
      if (dbUser) {
        // Update existing user
        const [updatedUser] = await db.update(users).set({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          username: user.username,
          archetype: user.archetype,
          level: user.level,
          contributions: user.contributions,
          bio: user.bio,
          socialLinks: user.socialLinks,
          skills: user.skills,
          website: user.website,
          location: user.location,
          updatedAt: new Date()
        }).where(eq(users.id, user.id)).returning();
        // Also update in memory
        await this.memStorage.upsertUser(user);
        return updatedUser;
      } else {
        // Create new user
        const [newUser] = await db.insert(users).values([{
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          username: user.username,
          archetype: user.archetype,
          level: user.level,
          contributions: user.contributions,
          bio: user.bio,
          socialLinks: user.socialLinks,
          skills: user.skills,
          website: user.website,
          location: user.location,
          createdAt: new Date(),
          updatedAt: new Date()
        }]).returning();
        // Also create in memory
        await this.memStorage.upsertUser(user);
        return newUser;
      }
    } catch (error) {
      console.error("Error upserting user in database:", error);
      // Fallback to memory storage
      return this.memStorage.upsertUser(user);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Try database first, fallback to memory
    try {
      const [dbUser] = await db.select().from(users).where(eq(users.username, username));
      if (dbUser) return dbUser;
    } catch (error) {
      console.error("Error getting user by username from database:", error);
    }
    return this.memStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      // Create in database
      const [newUser] = await db.insert(users).values([{
        id: user.id || randomUUID(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        username: user.username,
        archetype: user.archetype,
        level: user.level,
        contributions: user.contributions,
        bio: user.bio,
        socialLinks: user.socialLinks,
        skills: user.skills,
        website: user.website,
        location: user.location,
        createdAt: new Date(),
        updatedAt: new Date()
      }]).returning();
      // Also create in memory
      await this.memStorage.createUser(user);
      return newUser;
    } catch (error) {
      console.error("Error creating user in database:", error);
      // Fallback to memory storage
      return this.memStorage.createUser(user);
    }
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      // Update in database
      const [updatedUser] = await db.update(users).set({
        email: updates.email,
        firstName: updates.firstName,
        lastName: updates.lastName,
        profileImageUrl: updates.profileImageUrl,
        username: updates.username,
        archetype: updates.archetype,
        level: updates.level,
        contributions: updates.contributions,
        bio: updates.bio,
        socialLinks: updates.socialLinks,
        skills: updates.skills,
        website: updates.website,
        location: updates.location,
        updatedAt: new Date()
      }).where(eq(users.id, id)).returning();
      if (updatedUser) {
        // Also update in memory
        await this.memStorage.updateUser(id, updates);
        return updatedUser;
      }
    } catch (error) {
      console.error("Error updating user in database:", error);
    }
    // Fallback to memory storage
    return this.memStorage.updateUser(id, updates);
  }

  async getAllUsers(): Promise<User[]> {
    // Try database first, fallback to memory
    try {
      const dbUsers = await db.select().from(users);
      if (dbUsers.length > 0) return dbUsers;
    } catch (error) {
      console.error("Error getting all users from database:", error);
    }
    return this.memStorage.getAllUsers();
  }

  async createPost(post: InsertPost): Promise<Post> {
    return this.memStorage.createPost(post);
  }

  async getPostsByForum(forumSection: string, status?: string): Promise<Post[]> {
    return this.memStorage.getPostsByForum(forumSection, status);
  }

  async getAllPosts(): Promise<Post[]> {
    return this.memStorage.getAllPosts();
  }

  async getTopDiscussions(limit?: number): Promise<Post[]> {
    return this.memStorage.getTopDiscussions(limit);
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.memStorage.getPost(id);
  }

  async getPostsByUser(userId: string, status?: string): Promise<Post[]> {
    return this.memStorage.getPostsByUser(userId, status);
  }

  async updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined> {
    return this.memStorage.updatePost(id, updates);
  }

  async updatePostVotes(id: string, upvotes: number, downvotes: number): Promise<Post | undefined> {
    return this.memStorage.updatePostVotes(id, upvotes, downvotes);
  }

  async publishPost(id: string): Promise<Post | undefined> {
    return this.memStorage.publishPost(id);
  }

  async revertPostToDraft(id: string): Promise<Post | undefined> {
    return this.memStorage.revertPostToDraft(id);
  }

  async createVote(vote: InsertVote): Promise<Vote> {
    return this.memStorage.createVote(vote);
  }

  async getUserVoteForPost(userId: string, postId: string): Promise<Vote | undefined> {
    return this.memStorage.getUserVoteForPost(userId, postId);
  }

  async deleteVote(userId: string, postId: string): Promise<void> {
    return this.memStorage.deleteVote(userId, postId);
  }

  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    return this.memStorage.createContribution(contribution);
  }

  async getContributionsByUser(userId: string): Promise<Contribution[]> {
    return this.memStorage.getContributionsByUser(userId);
  }

  async getTotalFunding(): Promise<number> {
    return this.memStorage.getTotalFunding();
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    return this.memStorage.createChatMessage(message);
  }

  async getRecentChatMessages(limit?: number): Promise<ChatMessage[]> {
    return this.memStorage.getRecentChatMessages(limit);
  }

  async getForumSentiment(forumSection: string): Promise<ForumSentiment | undefined> {
    return this.memStorage.getForumSentiment(forumSection);
  }

  async updateForumSentiment(forumSection: string, sentiment: string, confidence: number, summary: string): Promise<ForumSentiment> {
    return this.memStorage.updateForumSentiment(forumSection, sentiment, confidence, summary);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    return this.memStorage.createComment(comment);
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return this.memStorage.getCommentsByPost(postId);
  }

  // Helper method to ensure user exists in database
  private async ensureUserExistsInDatabase(userId: string): Promise<void> {
    try {
      const [existingUser] = await db.select().from(users).where(eq(users.id, userId));
      if (!existingUser) {
        // Get user from memory storage
        const memUser = await this.memStorage.getUser(userId);
        if (memUser) {
          // Insert user into database
          await db.insert(users).values(memUser);
          console.log("User", userId, "created in database");
        } else {
          throw new Error(`User ${userId} not found in memory storage`);
        }
      }
    } catch (error) {
      console.error("Error ensuring user exists in database:", error);
      throw error;
    }
  }

  // Database-backed credential methods
  async createUserDegree(degree: InsertUserDegree): Promise<UserDegree> {
    await this.ensureUserExistsInDatabase(degree.userId);
    const [result] = await db.insert(userDegrees).values(degree).returning();
    return result;
  }

  async getUserDegrees(userId: string): Promise<UserDegree[]> {
    const results = await db.select().from(userDegrees).where(eq(userDegrees.userId, userId));
    return results.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  async updateUserDegree(id: string, updates: Partial<InsertUserDegree>): Promise<UserDegree | undefined> {
    const [result] = await db.update(userDegrees).set(updates).where(eq(userDegrees.id, id)).returning();
    return result;
  }

  async deleteUserDegree(id: string): Promise<void> {
    await db.delete(userDegrees).where(eq(userDegrees.id, id));
  }

  async createUserCertificate(certificate: InsertUserCertificate): Promise<UserCertificate> {
    await this.ensureUserExistsInDatabase(certificate.userId);
    const [result] = await db.insert(userCertificates).values(certificate).returning();
    return result;
  }

  async getUserCertificates(userId: string): Promise<UserCertificate[]> {
    const results = await db.select().from(userCertificates).where(eq(userCertificates.userId, userId));
    return results.sort((a, b) => (b.issueDate || new Date()).getTime() - (a.issueDate || new Date()).getTime());
  }

  async updateUserCertificate(id: string, updates: Partial<InsertUserCertificate>): Promise<UserCertificate | undefined> {
    const [result] = await db.update(userCertificates).set(updates).where(eq(userCertificates.id, id)).returning();
    return result;
  }

  async deleteUserCertificate(id: string): Promise<void> {
    await db.delete(userCertificates).where(eq(userCertificates.id, id));
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [result] = await db.insert(galleryImages).values(image).returning();
    return result;
  }

  async getUserGalleryImages(userId: string): Promise<GalleryImage[]> {
    const results = await db.select().from(galleryImages).where(eq(galleryImages.userId, userId));
    return results.sort((a, b) => (b.createdAt || new Date()).getTime() - (a.createdAt || new Date()).getTime());
  }

  async updateGalleryImage(id: string, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const [result] = await db.update(galleryImages).set(updates).where(eq(galleryImages.id, id)).returning();
    return result;
  }

  async deleteGalleryImage(id: string): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  async createWorkHistory(work: InsertWorkHistory): Promise<WorkHistory> {
    await this.ensureUserExistsInDatabase(work.userId);
    const [result] = await db.insert(workHistory).values(work).returning();
    return result;
  }

  async getUserWorkHistory(userId: string): Promise<WorkHistory[]> {
    const results = await db.select().from(workHistory).where(eq(workHistory.userId, userId));
    return results.sort((a, b) => {
      const aDate = a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
      const bDate = b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
      return bDate.getTime() - aDate.getTime();
    });
  }

  async updateWorkHistory(id: string, updates: Partial<InsertWorkHistory>): Promise<WorkHistory | undefined> {
    const [result] = await db.update(workHistory).set(updates).where(eq(workHistory.id, id)).returning();
    return result;
  }

  async deleteWorkHistory(id: string): Promise<void> {
    await db.delete(workHistory).where(eq(workHistory.id, id));
  }

  async createArchetypeAssessment(assessment: InsertArchetypeAssessment): Promise<ArchetypeAssessment> {
    await this.ensureUserExistsInDatabase(assessment.userId);
    const [result] = await db.insert(archetypeAssessments).values(assessment).returning();
    return result;
  }

  async getUserArchetypeAssessment(userId: string): Promise<ArchetypeAssessment | null> {
    try {
      const [result] = await db.select().from(archetypeAssessments).where(eq(archetypeAssessments.userId, userId));
      return result || null;
    } catch (error) {
      console.error("Error getting user archetype assessment:", error);
      return null;
    }
  }

  async updateArchetypeAssessment(id: string, updates: Partial<InsertArchetypeAssessment>): Promise<ArchetypeAssessment | undefined> {
    const [result] = await db.update(archetypeAssessments).set(updates).where(eq(archetypeAssessments.id, id)).returning();
    return result;
  }

  async deleteArchetypeAssessment(id: string): Promise<void> {
    await db.delete(archetypeAssessments).where(eq(archetypeAssessments.id, id));
  }
}

export const storage = new DatabaseStorage();
