import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateArticlesParallel, selectBestArticle, type ArticleOutline, type AIConfig } from '../lib/ai-writers';

function getConfig(): AIConfig {
  return {
    geminiApiKey: process.env.GEMINI_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  };
}

function validateOutline(body: unknown): ArticleOutline {
  if (!body || typeof body !== 'object') throw new Error('Request body is required');
  const outline = body as Record<string, unknown>;
  if (!outline.topic || typeof outline.topic !== 'string') throw new Error('topic is required');
  if (!Array.isArray(outline.keywords) || outline.keywords.length === 0) throw new Error('keywords required');
  return {
    topic: outline.topic,
    keywords: outline.keywords as string[],
    targetLength: typeof outline.targetLength === 'number' ? outline.targetLength : 1500,
    sections: Array.isArray(outline.sections) ? outline.sections as string[] : [],
    category: outline.category === 'kompensatory_svg' ? 'kompensatory_svg' : 'kompensacja_mocy_biernej',
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (process.env.API_SECRET && authHeader !== `Bearer ${process.env.API_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const outline = validateOutline(req.body);
    const config = getConfig();

    if (!config.geminiApiKey && !config.openaiApiKey && !config.anthropicApiKey) {
      return res.status(500).json({ error: 'No AI API keys configured' });
    }

    console.log('[API] Generating article for:', outline.topic);
    const startTime = Date.now();
    const articles = await generateArticlesParallel(outline, config);
    const bestArticle = selectBestArticle(articles);
    const responseTime = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      article: bestArticle,
      alternatives: articles.filter(a => a.writer !== bestArticle.writer),
      metadata: { totalArticles: articles.length, selectedWriter: bestArticle.writer, responseTime }
    });
  } catch (error) {
    console.error('[API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(errorMessage.includes('required') ? 400 : 500).json({ success: false, error: errorMessage });
  }
}

export const config = { maxDuration: 60 };