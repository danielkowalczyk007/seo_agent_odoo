import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog posts table - stores all generated and published blog posts
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  odooPostId: int("odoo_post_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  aiWriter: mysqlEnum("ai_writer", ["gemini", "chatgpt", "claude"]).notNull(),
  seoScore: int("seo_score"),
  readabilityScore: int("readability_score"),
  engagementScore: int("engagement_score"),
  totalScore: int("total_score"),
  status: mysqlEnum("status", ["draft", "published", "scheduled", "failed"]).default("draft").notNull(),
  publishedDate: timestamp("published_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  views: int("views").default(0),
  engagement: int("engagement").default(0),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Topics table - stores SEO topics and keywords for blog posts
 */
export const topics = mysqlTable("topics", {
  id: int("id").autoincrement().primaryKey(),
  topicName: text("topic_name").notNull(),
  keywords: text("keywords").notNull(),
  seoDifficulty: int("seo_difficulty"),
  relatedProducts: text("related_products"),
  outline: text("outline"),
  status: mysqlEnum("status", ["pending", "used", "archived"]).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  usedAt: timestamp("used_at"),
});

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = typeof topics.$inferInsert;

/**
 * Publication log table - tracks all publication attempts and results
 */
export const publicationLog = mysqlTable("publication_log", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("post_id").notNull(),
  status: mysqlEnum("status", ["success", "failed", "retrying"]).notNull(),
  errorMessage: text("error_message"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

export type PublicationLog = typeof publicationLog.$inferSelect;
export type InsertPublicationLog = typeof publicationLog.$inferInsert;

/**
 * Configuration table - stores Odoo API settings and scheduler config
 */
export const configuration = mysqlTable("configuration", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Configuration = typeof configuration.$inferSelect;
export type InsertConfiguration = typeof configuration.$inferInsert;