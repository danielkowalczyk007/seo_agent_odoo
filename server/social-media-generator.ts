/**
 * Social Media Content Generator
 * Generates platform-specific promotional posts for blog articles
 */

import { invokeLLM } from "./_core/llm";

export interface SocialMediaPost {
  platform: 'linkedin' | 'facebook' | 'twitter' | 'instagram';
  content: string;
  hashtags: string[];
}

export interface BlogArticle {
  title: string;
  metaDescription: string;
  keywords: string[];
  url: string;
}

/**
 * Generate social media posts for all platforms
 */
export async function generateSocialMediaPosts(
  article: BlogArticle
): Promise<SocialMediaPost[]> {
  const posts = await Promise.all([
    generateLinkedInPost(article),
    generateFacebookPost(article),
    generateTwitterPost(article),
    generateInstagramPost(article),
  ]);

  return posts;
}

/**
 * Generate LinkedIn post (professional, B2B tone)
 */
async function generateLinkedInPost(article: BlogArticle): Promise<SocialMediaPost> {
  const prompt = `Napisz profesjonalny post na LinkedIn promujący artykuł blogowy.

Tytuł artykułu: ${article.title}
Opis: ${article.metaDescription}
Słowa kluczowe: ${article.keywords.join(', ')}
URL: ${article.url}

Wymagania:
- Ton profesjonalny, B2B
- Długość: 150-200 słów
- Rozpocznij od pytania lub statystyki
- Podkreśl wartość biznesową
- Zakończ call-to-action
- Dodaj 3-5 relevantnych hashtagów
- Format: paragraf + link + hashtagi

Odpowiedź w formacie JSON:
{
  "content": "treść postu",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Jesteś ekspertem od content marketingu B2B." },
      { role: "user", content: prompt }
    ],
  });

  const content = response.choices[0].message.content;
  if (typeof content !== 'string') {
    throw new Error('Invalid response format from LLM');
  }
  const result = JSON.parse(content);

  return {
    platform: 'linkedin',
    content: result.content,
    hashtags: result.hashtags,
  };
}

/**
 * Generate Facebook post (engaging, accessible tone)
 */
async function generateFacebookPost(article: BlogArticle): Promise<SocialMediaPost> {
  const prompt = `Napisz angażujący post na Facebook promujący artykuł blogowy.

Tytuł artykułu: ${article.title}
Opis: ${article.metaDescription}
Słowa kluczowe: ${article.keywords.join(', ')}
URL: ${article.url}

Wymagania:
- Ton przystępny, przyjazny
- Długość: 100-150 słów
- Rozpocznij od hooka (pytanie, ciekawostka)
- Użyj emoji (2-3)
- Zachęć do komentowania
- Zakończ call-to-action
- Dodaj 3-5 hashtagów
- Format: paragraf + emoji + link + hashtagi

Odpowiedź w formacie JSON:
{
  "content": "treść postu",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Jesteś ekspertem od social media marketingu." },
      { role: "user", content: prompt }
    ],
  });

  const content = response.choices[0].message.content;
  if (typeof content !== 'string') {
    throw new Error('Invalid response format from LLM');
  }
  const result = JSON.parse(content);

  return {
    platform: 'facebook',
    content: result.content,
    hashtags: result.hashtags,
  };
}

/**
 * Generate Twitter/X post (concise, hashtag-rich)
 */
async function generateTwitterPost(article: BlogArticle): Promise<SocialMediaPost> {
  const prompt = `Napisz zwięzły post na Twitter/X promujący artykuł blogowy.

Tytuł artykułu: ${article.title}
Opis: ${article.metaDescription}
Słowa kluczowe: ${article.keywords.join(', ')}
URL: ${article.url}

Wymagania:
- Długość: maksymalnie 280 znaków (włącznie z hashtagami)
- Ton dynamiczny, bezpośredni
- Rozpocznij od mocnego hooka
- Użyj 1-2 emoji
- Dodaj 3-4 hashtagi
- Format: hook + wartość + link + hashtagi

Odpowiedź w formacie JSON:
{
  "content": "treść postu",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Jesteś ekspertem od Twitter marketingu." },
      { role: "user", content: prompt }
    ],
  });

  const content = response.choices[0].message.content;
  if (typeof content !== 'string') {
    throw new Error('Invalid response format from LLM');
  }
  const result = JSON.parse(content);

  return {
    platform: 'twitter',
    content: result.content,
    hashtags: result.hashtags,
  };
}

/**
 * Generate Instagram post (visual focus, storytelling)
 */
async function generateInstagramPost(article: BlogArticle): Promise<SocialMediaPost> {
  const prompt = `Napisz post na Instagram promujący artykuł blogowy.

Tytuł artykułu: ${article.title}
Opis: ${article.metaDescription}
Słowa kluczowe: ${article.keywords.join(', ')}
URL: ${article.url}

Wymagania:
- Ton storytelling, emocjonalny
- Długość: 150-200 słów
- Rozpocznij od mini-historii lub scenariusza
- Użyj emoji (3-5)
- Podziel na krótkie akapity (łatwiejsze do czytania)
- Zakończ call-to-action
- Dodaj 5-10 hashtagów (Instagram lubi więcej)
- Format: storytelling + emoji + link w bio + hashtagi

Odpowiedź w formacie JSON:
{
  "content": "treść postu",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Jesteś ekspertem od Instagram content marketingu." },
      { role: "user", content: prompt }
    ],
  });

  const content = response.choices[0].message.content;
  if (typeof content !== 'string') {
    throw new Error('Invalid response format from LLM');
  }
  const result = JSON.parse(content);

  return {
    platform: 'instagram',
    content: result.content,
    hashtags: result.hashtags,
  };
}
