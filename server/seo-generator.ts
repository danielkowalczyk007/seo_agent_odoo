/**
 * SEO Topic Generator
 * Analyzes Odoo data and generates blog post topics with keywords
 */

import { OdooProduct, OdooCategory } from './odoo-client';
import { ArticleOutline } from './ai-writers';

export interface SEOTopic {
  topicName: string;
  category: 'kompensacja' | 'svg';
  keywords: string[];
  seoDifficulty: number; // 0-100
  relatedProducts: string[];
  outline: ArticleOutline;
}

/**
 * Generate SEO topics based on Odoo products and categories
 */
export async function generateTopicsFromOdoo(
  products: OdooProduct[],
  categories: OdooCategory[]
): Promise<SEOTopic[]> {
  const topics: SEOTopic[] = [];

  // Generate topics from product categories
  for (const category of categories.slice(0, 5)) {
    const relatedProducts = products
      .filter(p => p.category === category.name)
      .slice(0, 3);

    if (relatedProducts.length > 0) {
      const topic = generateTopicFromCategory(category, relatedProducts);
      topics.push(topic);
    }
  }

  // Generate topics from popular products
  const popularProducts = products.slice(0, 5);
  for (const product of popularProducts) {
    const topic = generateTopicFromProduct(product);
    topics.push(topic);
  }

  return topics;
}

/**
 * Generate topic from category
 */
function generateTopicFromCategory(
  category: OdooCategory,
  products: OdooProduct[]
): SEOTopic {
  const categoryName = category.name;
  const productNames = products.map(p => p.name);

  // Determine category based on product/category name
  const topicCategory = categoryName.toLowerCase().includes('svg') || 
                        categoryName.toLowerCase().includes('kompensator') 
                        ? 'svg' as const : 'kompensacja' as const;

  return {
    topicName: `Przewodnik po ${categoryName}: Wszystko co musisz wiedzieć`,
    category: topicCategory,
    keywords: [
      categoryName.toLowerCase(),
      `${categoryName.toLowerCase()} przewodnik`,
      `najlepsze ${categoryName.toLowerCase()}`,
      ...productNames.map(p => p.toLowerCase()),
    ],
    seoDifficulty: estimateSEODifficulty(categoryName),
    relatedProducts: productNames,
    outline: {
      topic: `Przewodnik po ${categoryName}: Wszystko co musisz wiedzieć`,
      keywords: [
        categoryName.toLowerCase(),
        `${categoryName.toLowerCase()} przewodnik`,
        `najlepsze ${categoryName.toLowerCase()}`,
      ],
      targetLength: 2000,
      sections: [
        'Wprowadzenie',
        `Czym jest ${categoryName}?`,
        'Najważniejsze cechy i korzyści',
        'Jak wybrać odpowiedni produkt',
        'Najlepsze produkty w kategorii',
        'Podsumowanie i rekomendacje',
      ],
    },
  };
}

/**
 * Generate topic from product
 */
function generateTopicFromProduct(product: OdooProduct): SEOTopic {
  const productName = product.name;
  
  // Determine category based on product name
  const topicCategory = productName.toLowerCase().includes('svg') || 
                        productName.toLowerCase().includes('kompensator') 
                        ? 'svg' as const : 'kompensacja' as const;

  return {
    topicName: `${productName}: Kompletny przegląd i recenzja`,
    category: topicCategory,
    keywords: [
      productName.toLowerCase(),
      `${productName.toLowerCase()} recenzja`,
      `${productName.toLowerCase()} opinie`,
      `${productName.toLowerCase()} cena`,
    ],
    seoDifficulty: estimateSEODifficulty(productName),
    relatedProducts: [productName],
    outline: {
      topic: `${productName}: Kompletny przegląd i recenzja`,
      keywords: [
        productName.toLowerCase(),
        `${productName.toLowerCase()} recenzja`,
        `${productName.toLowerCase()} opinie`,
      ],
      targetLength: 1800,
      sections: [
        'Wprowadzenie',
        `Czym jest ${productName}?`,
        'Główne funkcje i specyfikacja',
        'Zalety i wady',
        'Dla kogo jest ten produkt?',
        'Podsumowanie i werdykt',
      ],
    },
  };
}

/**
 * Estimate SEO difficulty (simplified)
 */
function estimateSEODifficulty(keyword: string): number {
  // Simplified estimation based on keyword length
  // In production, this should use real SEO tools API
  const wordCount = keyword.split(' ').length;
  
  if (wordCount === 1) return 75; // Single word = high competition
  if (wordCount === 2) return 50; // Two words = medium competition
  return 30; // Long-tail = low competition
}

/**
 * Generate trending topics (manual curation)
 */
export function generateTrendingTopics(): SEOTopic[] {
  return [
    {
      topicName: 'Jak zwiększyć efektywność energetyczną w domu',
      category: 'kompensacja' as const,
      keywords: [
        'efektywność energetyczna',
        'oszczędzanie energii',
        'energia w domu',
        'ekologiczny dom',
      ],
      seoDifficulty: 45,
      relatedProducts: [],
      outline: {
        topic: 'Jak zwiększyć efektywność energetyczną w domu',
        keywords: ['efektywność energetyczna', 'oszczędzanie energii'],
        targetLength: 2200,
        sections: [
          'Wprowadzenie',
          'Dlaczego efektywność energetyczna jest ważna?',
          'Najlepsze sposoby na oszczędzanie energii',
          'Nowoczesne technologie energooszczędne',
          'Koszty i zwrot z inwestycji',
          'Podsumowanie',
        ],
      },
    },
    {
      topicName: 'Odnawialne źródła energii dla domu - kompletny przewodnik',
      category: 'kompensacja' as const,
      keywords: [
        'odnawialne źródła energii',
        'panele słoneczne',
        'energia słoneczna',
        'fotowoltaika',
      ],
      seoDifficulty: 55,
      relatedProducts: [],
      outline: {
        topic: 'Odnawialne źródła energii dla domu - kompletny przewodnik',
        keywords: ['odnawialne źródła energii', 'panele słoneczne'],
        targetLength: 2500,
        sections: [
          'Wprowadzenie',
          'Rodzaje odnawialnych źródeł energii',
          'Panele słoneczne - jak działają?',
          'Koszty instalacji i dotacje',
          'Zwrot z inwestycji',
          'Podsumowanie i rekomendacje',
        ],
      },
    },
  ];
}

/**
 * Select best topic for publication
 */
export function selectBestTopic(topics: SEOTopic[]): SEOTopic | null {
  if (topics.length === 0) return null;

  // Prefer topics with lower SEO difficulty and more related products
  const scored = topics.map(topic => ({
    topic,
    score: (100 - topic.seoDifficulty) + (topic.relatedProducts.length * 10),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored[0]?.topic || null;
}
