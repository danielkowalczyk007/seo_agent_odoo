import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  blogPosts, 
  InsertBlogPost, 
  topics, 
  InsertTopic, 
  publicationLog, 
  InsertPublicationLog,
  configuration,
  InsertConfiguration 
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Blog Posts queries
export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(post);
  return result;
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

// Topics queries
export async function createTopic(topic: InsertTopic) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(topics).values(topic);
  return result;
}

export async function getPendingTopics() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(topics).where(eq(topics.status, "pending")).orderBy(desc(topics.createdAt));
}

export async function markTopicAsUsed(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(topics).set({ status: "used", usedAt: new Date() }).where(eq(topics.id, id));
}

// Publication Log queries
export async function createPublicationLog(log: InsertPublicationLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(publicationLog).values(log);
}

export async function getPublicationLogs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(publicationLog).orderBy(desc(publicationLog.publishedAt));
}

// Configuration queries
export async function getConfig(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(configuration).where(eq(configuration.key, key)).limit(1);
  return result[0];
}

export async function getAllConfigs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(configuration);
}

export async function setConfig(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getConfig(key);
  if (existing) {
    return db.update(configuration).set({ value, updatedAt: new Date() }).where(eq(configuration.key, key));
  } else {
    return db.insert(configuration).values({ key, value });
  }
}
