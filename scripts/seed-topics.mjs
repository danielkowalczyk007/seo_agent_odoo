/**
 * Seed script to add blog topics to the database
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { topics as topicsTable } from '../drizzle/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read topics from JSON file
const topicsFile = join(__dirname, '..', 'blog_topics.json');
const topicsData = JSON.parse(readFileSync(topicsFile, 'utf-8'));

async function seedTopics() {
  console.log('[Seed] Starting to seed topics...');
  
  // Create database connection
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  
  for (const topic of topicsData) {
    try {
      // Insert topic using Drizzle ORM
      await db.insert(topicsTable).values({
        topicName: topic.title,
        keywords: JSON.stringify(topic.keywords),
        seoDifficulty: topic.seoDifficulty,
        outline: JSON.stringify(topic.outline),
        relatedProducts: JSON.stringify(topic.relatedProducts),
        status: 'pending',
        createdAt: new Date(),
      });
      
      console.log(`[Seed] ✓ Added topic: ${topic.title}`);
    } catch (error) {
      console.error(`[Seed] ✗ Failed to add topic: ${topic.title}`, error.message);
    }
  }
  
  await connection.end();
  console.log('[Seed] Finished seeding topics!');
  process.exit(0);
}

seedTopics().catch((error) => {
  console.error('[Seed] Fatal error:', error);
  process.exit(1);
});
