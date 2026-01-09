/**
 * Manual Publication
 * Simplified publication function for manual trigger that uses existing topics
 */

import { generateArticlesParallel } from './ai-writers';
import { selectBestArticle } from './seo-optimizer';
import { createBlogPost, getPendingTopics, markTopicAsUsed } from './db';
import { notifyOwner } from './_core/notification';

/**
 * Run manual publication using existing topics from database
 * Uses system environment API keys (GEMINI_API_KEY, ANTHROPIC_API_KEY)
 */
export async function runManualPublication(): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log('[Manual Publication] ========== Starting Manual Publication ==========');

    // Step 1: Get pending topics from database
    console.log('[Manual Publication] Step 1: Fetching pending topics...');
    const pendingTopics = await getPendingTopics();
    
    if (pendingTopics.length === 0) {
      throw new Error('No pending topics found in database. Please add topics first.');
    }
    
    // Select first pending topic
    const selectedTopic = pendingTopics[0];
    console.log(`[Manual Publication] Selected topic: "${selectedTopic.topicName}" (category: ${selectedTopic.category})`);

    // Parse JSON fields
    const keywords = JSON.parse(selectedTopic.keywords || '[]');
    const outline = JSON.parse(selectedTopic.outline || '[]');

    // Step 2: Generate articles with AI writers (parallel)
    console.log('[Manual Publication] Step 2: Generating articles with AI writers...');
    console.log('[Manual Publication] This will take 2-5 minutes...');
    
    // Use system environment API keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    if (!geminiKey || !anthropicKey) {
      throw new Error('System API keys (GEMINI_API_KEY, ANTHROPIC_API_KEY) not configured');
    }
    
    const articles = await generateArticlesParallel(outline, {
      gemini: geminiKey,
      openai: anthropicKey, // Use Anthropic as fallback since OpenRouter requires credits
      anthropic: anthropicKey,
    });
    console.log(`[Manual Publication] Generated ${articles.length} article versions`);

    // Step 3: Evaluate and select best article
    console.log('[Manual Publication] Step 3: Evaluating and selecting best article...');
    const bestArticle = selectBestArticle(articles, keywords);
    console.log(`[Manual Publication] Best article: ${bestArticle.writer} (score: ${bestArticle.score.totalScore})`);

    // Step 4: Save to database as draft with pending approval
    console.log('[Manual Publication] Step 4: Saving to database...');
    const dbResult = await createBlogPost({
      title: bestArticle.title,
      content: bestArticle.optimizedContent,
      metaDescription: bestArticle.metaDescription,
      keywords: JSON.stringify(keywords),
      aiWriter: bestArticle.writer,
      seoScore: bestArticle.score.seoScore,
      readabilityScore: bestArticle.score.readabilityScore,
      engagementScore: bestArticle.score.engagementScore,
      totalScore: bestArticle.score.totalScore,
      status: 'draft',
      approvalStatus: 'pending',
    });

    const postId = Number(dbResult[0].insertId);
    console.log(`[Manual Publication] Article saved with ID: ${postId}`);

    // Step 5: Mark topic as used
    await markTopicAsUsed(selectedTopic.id);
    console.log(`[Manual Publication] Topic marked as used`);

    // Calculate duration
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`[Manual Publication] ========== Publication Completed in ${duration}s ==========`);

    // Notify owner
    await notifyOwner({
      title: 'Nowy artykuł wygenerowany',
      content: `Artykuł "${bestArticle.title}" został wygenerowany i czeka na zatwierdzenie. Najlepsza wersja: ${bestArticle.writer} (wynik: ${bestArticle.score.totalScore}).`,
    });

  } catch (error) {
    console.error('[Manual Publication] Publication failed:', error);
    
    // Notify owner about failure
    await notifyOwner({
      title: 'Błąd generowania artykułu',
      content: `Generowanie artykułu nie powiodło się: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
    
    throw error;
  }
}
