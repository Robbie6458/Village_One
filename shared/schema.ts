import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: text("username").unique(),
  archetype: text("archetype"),
  level: integer("level").default(1),
  contributions: integer("contributions").default(0),
  bio: text("bio"),
  socialLinks: jsonb("social_links").$type<{
    instagram?: string;
    facebook?: string;
    x?: string;
  }>(),
  skills: text("skills").array(),
  website: text("website"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  forumSection: text("forum_section").notNull(), // land, resources, people, facilities, operations, ownership
  status: text("status").notNull().default("draft"), // draft, published
  images: text("images").array().default(sql`'{}'::text[]`), // Array of image URLs
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
});

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  postId: varchar("post_id").references(() => posts.id).notNull(),
  voteType: text("vote_type").notNull(), // upvote, downvote
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("unique_user_post_vote").on(table.userId, table.postId),
]);

export const contributions = pgTable("contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  tier: text("tier").notNull(), // settler, builder, founder
  perks: jsonb("perks"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumSentiments = pgTable("forum_sentiments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  forumSection: text("forum_section").notNull(),
  sentiment: text("sentiment").notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  summary: text("summary"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => posts.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userDegrees = pgTable("user_degrees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  year: integer("year"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userCertificates = pgTable("user_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  credentialId: text("credential_id"),
  url: text("url"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  imageUrl: text("image_url").notNull(),
  title: text("title"),
  description: text("description"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workHistory = pgTable("work_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isCurrentJob: boolean("is_current_job").default(false).notNull(),
  description: text("description"),
  achievements: text("achievements"),
  skills: text("skills"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const archetypeAssessments = pgTable("archetype_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  primaryArchetype: text("primary_archetype").notNull(),
  scores: jsonb("scores").notNull(),
  description: text("description"),
  answers: jsonb("answers").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});



export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  upvotes: true,
  downvotes: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export const insertContributionSchema = createInsertSchema(contributions).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertUserDegreeSchema = createInsertSchema(userDegrees).omit({
  id: true,
  createdAt: true,
});

export const insertUserCertificateSchema = createInsertSchema(userCertificates).omit({
  id: true,
  createdAt: true,
}).extend({
  issueDate: z.string().optional().nullable().transform(str => str ? new Date(str) : null),
  expiryDate: z.string().optional().nullable().transform(str => str ? new Date(str) : null),
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
});

export const insertWorkHistorySchema = createInsertSchema(workHistory).omit({
  id: true,
  createdAt: true,
}).extend({
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().optional().nullable().transform(str => str ? new Date(str) : null),
});

export const insertArchetypeAssessmentSchema = createInsertSchema(archetypeAssessments).omit({
  id: true,
  completedAt: true,
});



// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ForumSentiment = typeof forumSentiments.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type UserDegree = typeof userDegrees.$inferSelect;
export type InsertUserDegree = z.infer<typeof insertUserDegreeSchema>;
export type UserCertificate = typeof userCertificates.$inferSelect;
export type InsertUserCertificate = z.infer<typeof insertUserCertificateSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type WorkHistory = typeof workHistory.$inferSelect;
export type InsertWorkHistory = z.infer<typeof insertWorkHistorySchema>;
export type ArchetypeAssessment = typeof archetypeAssessments.$inferSelect;
export type InsertArchetypeAssessment = z.infer<typeof insertArchetypeAssessmentSchema>;


export const ARCHETYPE_OPTIONS = [
  "Builder",
  "Horticulturist", 
  "Village Engineer",
  "Designer",
  "Funder",
  "Storyteller",
  "Artist",
  "Craftsperson",
  "Permaculture Specialist",
  "Community Facilitator"
] as const;

export const FORUM_SECTIONS = [
  { id: "land", name: "Land & Location" },
  { id: "resources", name: "Resources & Materials" },
  { id: "people", name: "People & Community" },
  { id: "facilities", name: "Buildings & Infrastructure" },
  { id: "operations", name: "Operations & Management" },
  { id: "ownership", name: "Ownership & Governance" }
] as const;

export const CONTRIBUTION_TIERS = [
  "settler",
  "builder", 
  "founder"
] as const;
