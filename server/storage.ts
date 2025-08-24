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
  updateVote(userId: string, postId: string, voteType: string): Promise<Vote>;
  getPostVoteCounts(postId: string): Promise<{ upvotes: number; downvotes: number }>;
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

    // Initialize forum sentiments
    FORUM_SECTIONS.forEach(section => {
      const sentiment: ForumSentiment = {
        id: randomUUID(),
        forumSection: section.id,
        sentiment: "neutral",
        confidence: 75,
        summary: "Community discussions are active and engaged.",
        lastUpdated: new Date()
      };
      this.forumSentiments.set(section.id, sentiment);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = this.users.get(user.id);
    const newUser: User = {
      id: user.id,
      email: user.email || existingUser?.email || null,
      firstName: user.firstName || existingUser?.firstName || null,
      lastName: user.lastName || existingUser?.lastName || null,
      profileImageUrl: user.profileImageUrl || existingUser?.profileImageUrl || null,
      username: user.username || existingUser?.username || null,
      archetype: user.archetype || existingUser?.archetype || null,
      level: user.level ?? existingUser?.level ?? 1,
      contributions: user.contributions ?? existingUser?.contributions ?? 0,
      bio: user.bio || existingUser?.bio || null,
      socialLinks: user.socialLinks || existingUser?.socialLinks || null,
      skills: user.skills || existingUser?.skills || null,
      website: user.website || existingUser?.website || null,
      location: user.location || existingUser?.location || null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, newUser);
    return newUser;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = {
      id,
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Post methods
  async createPost(post: InsertPost): Promise<Post> {
    const id = randomUUID();
    const newPost: Post = {
      id,
      ...post,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: post.status === 'published' ? new Date() : null
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  async getPostsByForum(forumSection: string, status?: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.forumSection === forumSection && (!status || post.status === status))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTopDiscussions(limit: number = 10): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.status === 'published')
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      .slice(0, limit);
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByUser(userId: string, status?: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.authorId === userId && (!status || post.status === status))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    const updatedPost = { ...post, ...updates, updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async updatePostVotes(id: string, upvotes: number, downvotes: number): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    const updatedPost = { ...post, upvotes, downvotes, updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async publishPost(id: string): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    const updatedPost = { ...post, status: 'published', publishedAt: new Date(), updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async revertPostToDraft(id: string): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    const updatedPost = { ...post, status: 'draft', publishedAt: null, updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  // Vote methods
  async createVote(vote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const newVote: Vote = {
      id,
      ...vote,
      createdAt: new Date()
    };
    this.votes.set(id, newVote);
    return newVote;
  }

  async getUserVoteForPost(userId: string, postId: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values())
      .find(vote => vote.userId === userId && vote.postId === postId);
  }

  async deleteVote(userId: string, postId: string): Promise<void> {
    const vote = Array.from(this.votes.values())
      .find(vote => vote.userId === userId && vote.postId === postId);
    if (vote) {
      this.votes.delete(vote.id);
    }
  }

  async updateVote(userId: string, postId: string, voteType: string): Promise<Vote> {
    const vote = Array.from(this.votes.values())
      .find(vote => vote.userId === userId && vote.postId === postId);
    if (vote) {
      const updatedVote = { ...vote, voteType };
      this.votes.set(vote.id, updatedVote);
      return updatedVote;
    }
    // Create new vote if doesn't exist
    return this.createVote({ userId, postId, voteType });
  }

  async getPostVoteCounts(postId: string): Promise<{ upvotes: number; downvotes: number }> {
    const votes = Array.from(this.votes.values()).filter(vote => vote.postId === postId);
    const upvotes = votes.filter(vote => vote.voteType === 'upvote').length;
    const downvotes = votes.filter(vote => vote.voteType === 'downvote').length;
    return { upvotes, downvotes };
  }

  async getAllVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values());
  }

  // Contribution methods
  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const id = randomUUID();
    const newContribution: Contribution = {
      id,
      ...contribution,
      createdAt: new Date()
    };
    this.contributions.set(id, newContribution);
    return newContribution;
  }

  async getContributionsByUser(userId: string): Promise<Contribution[]> {
    return Array.from(this.contributions.values())
      .filter(contribution => contribution.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTotalFunding(): Promise<number> {
    return Array.from(this.contributions.values())
      .reduce((total, contribution) => total + contribution.amount, 0);
  }

  // Chat message methods
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const newMessage: ChatMessage = {
      id,
      ...message,
      createdAt: new Date()
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }

  async getRecentChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Forum sentiment methods
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
      lastUpdated: new Date()
    };
    this.forumSentiments.set(forumSection, updated);
    return updated;
  }

  // Comment methods
  async createComment(comment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const newComment: Comment = {
      id,
      ...comment,
      createdAt: new Date()
    };
    this.comments.set(id, newComment);
    return newComment;
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // User degree methods
  async createUserDegree(degree: InsertUserDegree): Promise<UserDegree> {
    const id = randomUUID();
    const newDegree: UserDegree = {
      id,
      ...degree,
      createdAt: new Date()
    };
    this.userDegrees.set(id, newDegree);
    return newDegree;
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

  // User certificate methods
  async createUserCertificate(certificate: InsertUserCertificate): Promise<UserCertificate> {
    const id = randomUUID();
    const newCertificate: UserCertificate = {
      id,
      ...certificate,
      createdAt: new Date()
    };
    this.userCertificates.set(id, newCertificate);
    return newCertificate;
  }

  async getUserCertificates(userId: string): Promise<UserCertificate[]> {
    return Array.from(this.userCertificates.values())
      .filter(cert => cert.userId === userId)
      .sort((a, b) => {
        const aDate = a.issueDate ? new Date(a.issueDate) : new Date(0);
        const bDate = b.issueDate ? new Date(b.issueDate) : new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
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

  // Gallery image methods
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const newImage: GalleryImage = {
      id,
      ...image,
      createdAt: new Date()
    };
    this.galleryImages.set(id, newImage);
    return newImage;
  }

  async getUserGalleryImages(userId: string): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values())
      .filter(image => image.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  // Work history methods
  async createWorkHistory(workHistory: InsertWorkHistory): Promise<WorkHistory> {
    const id = randomUUID();
    const newWorkHistory: WorkHistory = {
      id,
      ...workHistory,
      createdAt: new Date()
    };
    this.workHistory.set(id, newWorkHistory);
    return newWorkHistory;
  }

  async getUserWorkHistory(userId: string): Promise<WorkHistory[]> {
    return Array.from(this.workHistory.values())
      .filter(work => work.userId === userId)
      .sort((a, b) => {
        // Sort by start date, most recent first
        const aDate = new Date(a.startDate);
        const bDate = new Date(b.startDate);
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

  // Archetype assessment methods
  async createArchetypeAssessment(assessment: InsertArchetypeAssessment): Promise<ArchetypeAssessment> {
    const id = randomUUID();
    const newAssessment: ArchetypeAssessment = {
      id,
      ...assessment,
      completedAt: new Date()
    };
    this.archetypeAssessments.set(id, newAssessment);
    return newAssessment;
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

// Simple implementation that delegates to MemStorage for now
export class DatabaseStorage extends MemStorage {
}

export const storage = new DatabaseStorage();