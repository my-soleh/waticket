import { Category } from '../types';

export interface MatchResult {
  suggestedCategory: Category | null;
  matchedKeywords: string[];
  confidence: number;
}

export function matchCategoryFromText(text: string, categories: Category[]): MatchResult {
  if (!text || text.trim() === '') {
    return { suggestedCategory: null, matchedKeywords: [], confidence: 0 };
  }

  const cleanText = text.toLowerCase();
  let bestCategory: Category | null = null;
  let maxMatchedCount = 0;
  let bestMatchedKeywords: string[] = [];

  for (const category of categories) {
    const matchedInThisCategory: string[] = [];

    for (const kw of category.keywords) {
      const cleanKw = kw.toLowerCase().trim();
      if (cleanKw && cleanText.includes(cleanKw)) {
        if (!matchedInThisCategory.includes(cleanKw)) {
          matchedInThisCategory.push(cleanKw);
        }
      }
    }

    if (matchedInThisCategory.length > maxMatchedCount) {
      maxMatchedCount = matchedInThisCategory.length;
      bestCategory = category;
      bestMatchedKeywords = matchedInThisCategory;
    }
  }

  // Fallback if no keyword matches but categories exist
  if (!bestCategory && categories.length > 0) {
    bestCategory = categories[categories.length - 1]; // "Lainnya / General" or last
  }

  return {
    suggestedCategory: bestCategory,
    matchedKeywords: bestMatchedKeywords,
    confidence: maxMatchedCount > 0 ? Math.min(100, maxMatchedCount * 30 + 40) : 10,
  };
}
