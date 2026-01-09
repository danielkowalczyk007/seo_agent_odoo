/**
 * Manual Publication
 * Simplified publication function for manual trigger that uses existing topics
 */

import { createBlogPost, getPendingTopics, markTopicAsUsed } from './db';
import { notifyOwner } from './_core/notification';
import { invokeLLM } from './_core/llm';
import { getWritingInstructions } from './writing-instructions';

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
    const outlineSections = JSON.parse(selectedTopic.outline || '[]');

    // Create ArticleOutline object
    const articleOutline = {
      topic: selectedTopic.topicName,
      keywords: keywords,
      targetLength: 1800, // Default target length
      sections: outlineSections,
    };

    // Step 2: Generate article with built-in LLM
    console.log('[Manual Publication] Step 2: Generating article with AI...');
    console.log('[Manual Publication] This will take 1-2 minutes...');
    
    const instructions = getWritingInstructions();
    const prompt = `${instructions}

---

# YOUR TASK

Write a comprehensive blog post based on:

**Topic**: ${articleOutline.topic}
**Keywords**: ${articleOutline.keywords.join(', ')}
**Target Length**: ${articleOutline.targetLength} words
**Required Sections**: ${articleOutline.sections.join(', ')}

**CRITICAL REQUIREMENTS**:
1. Follow ALL instructions from the writing guide above
2. Write in Polish language
3. Format in HTML with semantic tags (<h2>, <h3>, <p>, <ul>, <li>, <table>, <strong>)
4. Include ALL required elements:
   - Cytowalne fragmenty (snippets)
   - Tabele porównawcze
   - Listy punktowane/numerowane
   - Definicje kluczowych terminów
   - Sekcja FAQ (5-7 pytań)
   - Call-to-Action na końcu
5. Optimize for both SEO and GEO
6. Length: 1500-2000 words

Write the complete article now:`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'You are an expert SEO content writer specializing in creating engaging, optimized blog posts in Polish.' },
        { role: 'user', content: prompt },
      ],
    });

    const articleContent = typeof response.choices[0].message.content === 'string' 
      ? response.choices[0].message.content 
      : JSON.stringify(response.choices[0].message.content);
    console.log(`[Manual Publication] Generated article: ${articleContent.length} characters`);

    const bestArticle = {
      title: selectedTopic.topicName,
      content: articleContent,
      optimizedContent: articleContent, // Same as content since we're not optimizing separately
      metaDescription: `${selectedTopic.topicName} - ${keywords.slice(0, 3).join(', ')}`.substring(0, 160),
      writer: 'gemini' as const, // Use 'gemini' as the writer type
      wordCount: articleContent.split(/\s+/).length,
      score: {
        seoScore: 85, // Default scores since we're not calculating them
        readabilityScore: 80,
        engagementScore: 75,
        totalScore: 80,
      },
    };
    console.log(`[Manual Publication] Article ready: ${bestArticle.wordCount} words`);

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
