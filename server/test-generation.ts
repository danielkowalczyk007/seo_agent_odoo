/**
 * Simple test for AI generation
 */

import { generateArticlesParallel } from './ai-writers';
import { getConfig } from './db';

async function testGeneration() {
  try {
    console.log('[Test] Starting generation test...');

    // Use system environment variables
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENROUTER_API_KEY; // OpenAI via OpenRouter
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!geminiKey || !openaiKey || !anthropicKey) {
      throw new Error(`API keys not found in environment:\n  GEMINI_API_KEY: ${geminiKey ? 'OK' : 'MISSING'}\n  OPENROUTER_API_KEY: ${openaiKey ? 'OK' : 'MISSING'}\n  ANTHROPIC_API_KEY: ${anthropicKey ? 'OK' : 'MISSING'}`);
    }

    console.log('[Test] API keys loaded successfully');

    // Simple test outline
    const outline = {
      topic: 'Test Article - Kompensacja mocy biernej',
      keywords: ['kompensacja', 'moc bierna', 'test'],
      targetLength: 1000,
      sections: [
        'Wprowadzenie do kompensacji mocy biernej',
        'Zalety kompensacji',
        'Podsumowanie',
      ],
    };

    console.log('[Test] Starting parallel generation...');
    const articles = await generateArticlesParallel(outline, {
      gemini: geminiKey,
      openai: openaiKey,
      anthropic: anthropicKey,
    });

    console.log(`[Test] Success! Generated ${articles.length} articles`);
    articles.forEach((article) => {
      console.log(`- ${article.writer}: ${article.wordCount} words`);
    });
  } catch (error) {
    console.error('[Test] Failed:', error);
    process.exit(1);
  }
}

testGeneration();
