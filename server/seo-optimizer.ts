/**
 * SEO Optimizer and Article Evaluator
 * Scores articles based on SEO (30%), Readability (30%), and Engagement (40%)
 */

import { GeneratedArticle } from './ai-writers';

export interface ArticleScore {
  seoScore: number; // 0-100
  readabilityScore: number; // 0-100
  engagementScore: number; // 0-100
  totalScore: number; // weighted average
  details: {
    keywordDensity: number;
    headingStructure: boolean;
    contentLength: number;
    avgSentenceLength: number;
    paragraphCount: number;
    hasCallToAction: boolean;
  };
}

export interface OptimizedArticle extends GeneratedArticle {
  metaDescription: string;
  optimizedContent: string;
  internalLinks: string[];
  score: ArticleScore;
}

/**
 * Evaluate article and calculate scores
 */
export function evaluateArticle(
  article: GeneratedArticle,
  keywords: string[]
): ArticleScore {
  const seoScore = calculateSEOScore(article, keywords);
  const readabilityScore = calculateReadabilityScore(article);
  const engagementScore = calculateEngagementScore(article);

  // Weighted average: SEO 30%, Readability 30%, Engagement 40%
  const totalScore = Math.round(
    seoScore * 0.3 + readabilityScore * 0.3 + engagementScore * 0.4
  );

  return {
    seoScore,
    readabilityScore,
    engagementScore,
    totalScore,
    details: {
      keywordDensity: calculateKeywordDensity(article.content, keywords),
      headingStructure: hasProperHeadingStructure(article.content),
      contentLength: article.wordCount,
      avgSentenceLength: calculateAvgSentenceLength(article.content),
      paragraphCount: countParagraphs(article.content),
      hasCallToAction: hasCallToAction(article.content),
    },
  };
}

/**
 * Calculate SEO score (0-100)
 */
function calculateSEOScore(article: GeneratedArticle, keywords: string[]): number {
  let score = 0;

  // Keyword density (target: 1-2%)
  const density = calculateKeywordDensity(article.content, keywords);
  if (density >= 1 && density <= 2) {
    score += 40;
  } else if (density > 0.5 && density < 3) {
    score += 25;
  } else {
    score += 10;
  }

  // Heading structure
  if (hasProperHeadingStructure(article.content)) {
    score += 30;
  }

  // Content length (target: 1500-3000 words)
  if (article.wordCount >= 1500 && article.wordCount <= 3000) {
    score += 30;
  } else if (article.wordCount >= 1000) {
    score += 20;
  }

  return Math.min(score, 100);
}

/**
 * Calculate readability score (0-100)
 */
function calculateReadabilityScore(article: GeneratedArticle): number {
  let score = 0;

  // Average sentence length (target: 15-20 words)
  const avgSentenceLength = calculateAvgSentenceLength(article.content);
  if (avgSentenceLength >= 15 && avgSentenceLength <= 20) {
    score += 40;
  } else if (avgSentenceLength >= 10 && avgSentenceLength <= 25) {
    score += 25;
  } else {
    score += 10;
  }

  // Paragraph count (should have multiple paragraphs)
  const paragraphCount = countParagraphs(article.content);
  if (paragraphCount >= 8) {
    score += 30;
  } else if (paragraphCount >= 5) {
    score += 20;
  }

  // Has lists or bullet points
  if (article.content.includes('<ul>') || article.content.includes('<ol>')) {
    score += 30;
  }

  return Math.min(score, 100);
}

/**
 * Calculate engagement score (0-100)
 */
function calculateEngagementScore(article: GeneratedArticle): number {
  let score = 0;

  // Has call to action
  if (hasCallToAction(article.content)) {
    score += 40;
  }

  // Has questions (engaging readers)
  const questionCount = (article.content.match(/\?/g) || []).length;
  if (questionCount >= 3) {
    score += 30;
  } else if (questionCount >= 1) {
    score += 15;
  }

  // Has strong/emphasis tags
  if (article.content.includes('<strong>') || article.content.includes('<em>')) {
    score += 30;
  }

  return Math.min(score, 100);
}

/**
 * Calculate keyword density
 */
function calculateKeywordDensity(content: string, keywords: string[]): number {
  const text = stripHtml(content).toLowerCase();
  const words = text.split(/\s+/);
  const totalWords = words.length;

  let keywordCount = 0;
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword.toLowerCase(), 'g');
    const matches = text.match(regex);
    keywordCount += matches ? matches.length : 0;
  });

  return (keywordCount / totalWords) * 100;
}

/**
 * Check if content has proper heading structure
 */
function hasProperHeadingStructure(content: string): boolean {
  const hasH2 = content.includes('<h2>');
  const hasH3 = content.includes('<h3>');
  return hasH2 || hasH3;
}

/**
 * Calculate average sentence length
 */
function calculateAvgSentenceLength(content: string): number {
  const text = stripHtml(content);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  return sentences.length > 0 ? words.length / sentences.length : 0;
}

/**
 * Count paragraphs
 */
function countParagraphs(content: string): number {
  const matches = content.match(/<p>/g);
  return matches ? matches.length : 0;
}

/**
 * Check if content has call to action
 */
function hasCallToAction(content: string): boolean {
  const ctaKeywords = [
    'skontaktuj się',
    'dowiedz się więcej',
    'sprawdź',
    'kup teraz',
    'zamów',
    'zadzwoń',
    'napisz do nas',
  ];

  const text = stripHtml(content).toLowerCase();
  return ctaKeywords.some(keyword => text.includes(keyword));
}

/**
 * Strip HTML tags
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Generate meta description
 */
export function generateMetaDescription(
  content: string,
  keywords: string[],
  maxLength: number = 160
): string {
  const text = stripHtml(content);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Try to include first keyword in meta description
  const firstSentence = sentences[0] || '';
  const secondSentence = sentences[1] || '';

  let description = `${firstSentence}. ${secondSentence}`.trim();

  // Truncate to max length
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }

  return description;
}

/**
 * Add internal links to content
 */
export function addInternalLinks(
  content: string,
  relatedProducts: string[]
): string {
  let optimizedContent = content;

  // Add links to related products (simplified)
  relatedProducts.forEach(product => {
    const regex = new RegExp(`\\b${product}\\b`, 'i');
    const productSlug = product.toLowerCase().replace(/\s+/g, '-');
    optimizedContent = optimizedContent.replace(
      regex,
      `<a href="/products/${productSlug}">${product}</a>`
    );
  });

  return optimizedContent;
}

/**
 * Optimize article for SEO
 */
export function optimizeArticle(
  article: GeneratedArticle,
  keywords: string[],
  relatedProducts: string[] = []
): OptimizedArticle {
  const score = evaluateArticle(article, keywords);
  const metaDescription = generateMetaDescription(article.content, keywords);
  const optimizedContent = addInternalLinks(article.content, relatedProducts);

  return {
    ...article,
    metaDescription,
    optimizedContent,
    internalLinks: relatedProducts,
    score,
  };
}

/**
 * Select best article from multiple versions
 */
export function selectBestArticle(
  articles: GeneratedArticle[],
  keywords: string[]
): OptimizedArticle {
  const optimizedArticles = articles.map(article => 
    optimizeArticle(article, keywords)
  );

  // Sort by total score (descending)
  optimizedArticles.sort((a, b) => b.score.totalScore - a.score.totalScore);

  console.log('[SEO Optimizer] Article scores:');
  optimizedArticles.forEach(article => {
    console.log(`  ${article.writer}: ${article.score.totalScore} (SEO: ${article.score.seoScore}, Readability: ${article.score.readabilityScore}, Engagement: ${article.score.engagementScore})`);
  });

  return optimizedArticles[0]!;
}
