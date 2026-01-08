/**
 * AI Writers Module
 * Parallel content generation using Gemini, ChatGPT, and Claude
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export interface ArticleOutline {
  topic: string;
  keywords: string[];
  targetLength: number; // words
  sections: string[];
}

export interface GeneratedArticle {
  title: string;
  content: string;
  writer: 'gemini' | 'chatgpt' | 'claude';
  wordCount: number;
  generatedAt: Date;
}

/**
 * Generate article using Gemini
 */
export async function writeWithGemini(
  outline: ArticleOutline,
  apiKey: string
): Promise<GeneratedArticle> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = createPrompt(outline);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    const wordCount = content.split(/\s+/).length;

    return {
      title: outline.topic,
      content,
      writer: 'gemini',
      wordCount,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error('[Gemini] Failed to generate article:', error);
    throw new Error('Gemini generation failed');
  }
}

/**
 * Generate article using ChatGPT (OpenAI)
 */
export async function writeWithChatGPT(
  outline: ArticleOutline,
  apiKey: string
): Promise<GeneratedArticle> {
  try {
    const client = new OpenAI({ apiKey });
    
    const prompt = createPrompt(outline);
    
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO content writer specializing in creating engaging, optimized blog posts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content || '';
    const wordCount = content.split(/\s+/).length;

    return {
      title: outline.topic,
      content,
      writer: 'chatgpt',
      wordCount,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error('[ChatGPT] Failed to generate article:', error);
    throw new Error('ChatGPT generation failed');
  }
}

/**
 * Generate article using Claude (Anthropic)
 */
export async function writeWithClaude(
  outline: ArticleOutline,
  apiKey: string
): Promise<GeneratedArticle> {
  try {
    const client = new Anthropic({ apiKey });
    
    const prompt = createPrompt(outline);
    
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : '';
    const wordCount = content.split(/\s+/).length;

    return {
      title: outline.topic,
      content,
      writer: 'claude',
      wordCount,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error('[Claude] Failed to generate article:', error);
    throw new Error('Claude generation failed');
  }
}

/**
 * Generate articles in parallel using all three AI models
 */
export async function generateArticlesParallel(
  outline: ArticleOutline,
  apiKeys: {
    gemini: string;
    openai: string;
    anthropic: string;
  }
): Promise<GeneratedArticle[]> {
  console.log('[AI Writers] Starting parallel generation for:', outline.topic);

  const results = await Promise.allSettled([
    writeWithGemini(outline, apiKeys.gemini),
    writeWithChatGPT(outline, apiKeys.openai),
    writeWithClaude(outline, apiKeys.anthropic),
  ]);

  const articles: GeneratedArticle[] = [];

  results.forEach((result, index) => {
    const writerName = ['Gemini', 'ChatGPT', 'Claude'][index];
    if (result.status === 'fulfilled') {
      articles.push(result.value);
      console.log(`[AI Writers] ${writerName} completed: ${result.value.wordCount} words`);
    } else {
      console.error(`[AI Writers] ${writerName} failed:`, result.reason);
    }
  });

  if (articles.length === 0) {
    throw new Error('All AI writers failed to generate content');
  }

  return articles;
}

/**
 * Create prompt for AI writers
 */
function createPrompt(outline: ArticleOutline): string {
  return `Write a comprehensive, SEO-optimized blog post about: "${outline.topic}"

Target Keywords: ${outline.keywords.join(', ')}
Target Length: ${outline.targetLength} words
Required Sections: ${outline.sections.join(', ')}

Requirements:
1. Write in Polish language
2. Use engaging, conversational tone
3. Include the target keywords naturally (1-2% density)
4. Structure with clear H2 and H3 headings
5. Add practical examples and actionable tips
6. Include a compelling introduction and conclusion
7. Optimize for readability (short paragraphs, bullet points where appropriate)
8. Write in HTML format with proper semantic tags (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>)

Write the complete article now:`;
}
