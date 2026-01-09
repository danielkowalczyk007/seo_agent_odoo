/**
 * Update categories for existing topics
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

async function updateCategories() {
  console.log('[Update] Starting to update categories...');
  
  // Create database connection
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  
  try {
    // Update topics 1-4 as "kompensacja"
    await db.execute(sql`UPDATE topics SET category = 'kompensacja' WHERE id IN (1, 2, 3, 4)`);
    console.log('[Update] ✓ Updated topics 1-4 to category: kompensacja');
    
    // Update topics 5-8 as "svg"
    await db.execute(sql`UPDATE topics SET category = 'svg' WHERE id IN (5, 6, 7, 8)`);
    console.log('[Update] ✓ Updated topics 5-8 to category: svg');
    
  } catch (error) {
    console.error('[Update] ✗ Failed to update categories:', error.message);
  }
  
  await connection.end();
  console.log('[Update] Finished updating categories!');
  process.exit(0);
}

updateCategories().catch((error) => {
  console.error('[Update] Fatal error:', error);
  process.exit(1);
});
