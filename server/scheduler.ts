/**
 * Publication Scheduler
 * Automates blog post publication 2x per week (Monday & Thursday at 9:00 GMT+1)
 */

import { CronJob } from 'cron';
import { createOdooClient, OdooClient } from './odoo-client';
import { generateTopicsFromOdoo, selectBestTopic, generateTrendingTopics } from './seo-generator';
import { generateArticlesParallel } from './ai-writers';
import { selectBestArticle } from './seo-optimizer';
import { 
  createBlogPost, 
  createTopic, 
  createPublicationLog, 
  markTopicAsUsed,
  getConfig,
  updateBlogPost 
} from './db';
import { notifyOwner } from './_core/notification';

export interface SchedulerConfig {
  odooUrl: string;
  odooApiKey: string;
  odooDatabase: string;
  odooBlogId: number;
  geminiApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  timezone: string;
}

let schedulerJob: CronJob | null = null;

/**
 * Initialize and start the scheduler
 */
export async function startScheduler(config: SchedulerConfig): Promise<void> {
  console.log('[Scheduler] Starting publication scheduler...');

  // Schedule for Monday and Thursday at 9:00 GMT+1
  // Cron format: seconds minutes hours day-of-month month day-of-week
  // Day of week: 1 = Monday, 4 = Thursday
  const cronExpression = '0 0 9 * * 1,4'; // Every Monday and Thursday at 9:00

  schedulerJob = new CronJob(
    cronExpression,
    async () => {
      console.log('[Scheduler] Running scheduled publication...');
      await runPublicationCycle(config);
    },
    null,
    true,
    config.timezone || 'Europe/Warsaw' // GMT+1
  );

  console.log('[Scheduler] Scheduler started successfully');
  console.log('[Scheduler] Next publication:', schedulerJob.nextDate().toString());
}

/**
 * Stop the scheduler
 */
export function stopScheduler(): void {
  if (schedulerJob) {
    schedulerJob.stop();
    schedulerJob = null;
    console.log('[Scheduler] Scheduler stopped');
  }
}

/**
 * Run a complete publication cycle
 */
export async function runPublicationCycle(config: SchedulerConfig): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log('[Scheduler] ========== Starting Publication Cycle ==========');

    // Step 1: Connect to Odoo
    console.log('[Scheduler] Step 1: Connecting to Odoo...');
    const odooClient = await createOdooClient(
      config.odooUrl,
      config.odooApiKey,
      config.odooDatabase
    );

    // Step 2: Fetch data from Odoo
    console.log('[Scheduler] Step 2: Fetching products and categories...');
    const products = await odooClient.getProducts();
    const categories = await odooClient.getCategories();
    console.log(`[Scheduler] Fetched ${products.length} products and ${categories.length} categories`);

    // Step 3: Generate topics
    console.log('[Scheduler] Step 3: Generating SEO topics...');
    const odooTopics = await generateTopicsFromOdoo(products, categories);
    const trendingTopics = generateTrendingTopics();
    const allTopics = [...odooTopics, ...trendingTopics];
    
    // Save topics to database
    for (const topic of allTopics) {
      await createTopic({
        topicName: topic.topicName,
        category: topic.category || 'kompensacja', // Default to kompensacja if not specified
        keywords: JSON.stringify(topic.keywords),
        seoDifficulty: topic.seoDifficulty,
        relatedProducts: JSON.stringify(topic.relatedProducts),
        outline: JSON.stringify(topic.outline),
        status: 'pending',
      });
    }

    // Select best topic
    const selectedTopic = selectBestTopic(allTopics);
    if (!selectedTopic) {
      throw new Error('No suitable topic found');
    }
    console.log(`[Scheduler] Selected topic: "${selectedTopic.topicName}"`);

    // Step 4: Generate articles with AI writers (parallel)
    console.log('[Scheduler] Step 4: Generating articles with AI writers...');
    const articles = await generateArticlesParallel(selectedTopic.outline, {
      gemini: config.geminiApiKey,
      openai: config.openaiApiKey,
      anthropic: config.anthropicApiKey,
    });
    console.log(`[Scheduler] Generated ${articles.length} article versions`);

    // Step 5: Evaluate and select best article
    console.log('[Scheduler] Step 5: Evaluating and selecting best article...');
    const bestArticle = selectBestArticle(articles, selectedTopic.keywords);
    console.log(`[Scheduler] Best article: ${bestArticle.writer} (score: ${bestArticle.score.totalScore})`);

    // Step 6: Save to database
    console.log('[Scheduler] Step 6: Saving to database...');
    const dbResult = await createBlogPost({
      title: bestArticle.title,
      content: bestArticle.optimizedContent,
      metaDescription: bestArticle.metaDescription,
      keywords: JSON.stringify(selectedTopic.keywords),
      aiWriter: bestArticle.writer,
      seoScore: bestArticle.score.seoScore,
      readabilityScore: bestArticle.score.readabilityScore,
      engagementScore: bestArticle.score.engagementScore,
      totalScore: bestArticle.score.totalScore,
      status: 'draft',
    });

    const postId = Number(dbResult[0].insertId);

    // Step 7: Publish to Odoo
    console.log('[Scheduler] Step 7: Publishing to Odoo CMS...');
    const odooPostId = await odooClient.createBlogPost({
      name: bestArticle.title,
      content: bestArticle.optimizedContent,
      blog_id: config.odooBlogId,
      meta_description: bestArticle.metaDescription,
      is_published: false, // Create as draft first
    });

    if (!odooPostId) {
      throw new Error('Failed to create blog post in Odoo');
    }

    // Publish the post
    const published = await odooClient.publishBlogPost(odooPostId);
    if (!published) {
      throw new Error('Failed to publish blog post in Odoo');
    }

    // Update database with Odoo post ID and status
    await updateBlogPost(postId, {
      odooPostId,
      status: 'published',
      publishedDate: new Date(),
    });

    // Mark topic as used
    const topicId = allTopics.findIndex(t => t.topicName === selectedTopic.topicName);
    if (topicId !== -1) {
      await markTopicAsUsed(topicId + 1);
    }

    // Log success
    await createPublicationLog({
      postId,
      status: 'success',
      errorMessage: null,
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Scheduler] ========== Publication Cycle Completed in ${duration}s ==========`);

    // Send notification to owner
    await notifyOwner({
      title: '✅ Nowy wpis opublikowany',
      content: `Wpis "${bestArticle.title}" został pomyślnie opublikowany na blogu.\n\nWynik: ${bestArticle.writer} (${bestArticle.score.totalScore}/100)\nSłowa: ${bestArticle.wordCount}\nCzas: ${duration}s`,
    });

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error('[Scheduler] Publication cycle failed:', error);

    // Log error
    await createPublicationLog({
      postId: 0,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    // Send error notification
    await notifyOwner({
      title: '❌ Błąd publikacji wpisu',
      content: `Publikacja wpisu nie powiodła się.\n\nBłąd: ${error instanceof Error ? error.message : 'Unknown error'}\nCzas: ${duration}s`,
    });
  }
}

/**
 * Manually trigger publication cycle
 */
export async function triggerManualPublication(config: SchedulerConfig): Promise<void> {
  console.log('[Scheduler] Manual publication triggered');
  await runPublicationCycle(config);
}

/**
 * Get next scheduled publication time
 */
export function getNextPublicationTime(): Date | null {
  if (schedulerJob) {
    return schedulerJob.nextDate().toJSDate();
  }
  return null;
}
