// ─── Shared domain types ─────────────────────────────────────────────────────

export type Category = "재테크" | "창업/부업" | "사이드 프로젝트";

export interface MonetizationIdea {
  type: "앱/웹" | "오프라인 창업" | "콘텐츠" | "투자" | "커뮤니티";
  title: string;
  description: string;
  difficulty: "쉬움" | "보통" | "어려움";
  estimatedRevenue: string;
}

export interface TrendInsight {
  id: string;
  keyword: string;
  category: Category;
  riseRate: number;
  summary: string;
  trendContext: {
    headline: string;
    details: string[];
    relatedKeywords: string[];
    dataSource: string;
  };
  monetizationIdeas: MonetizationIdea[];
  targetAudience: {
    primarySegment: string;
    demographics: string[];
    psychographics: string[];
    painPoints: string[];
  };
  updatedAt: string;
  viewCount: number;
  bookmarkCount: number;
}

// ─── Scraper types ────────────────────────────────────────────────────────────

export interface RawTrend {
  /** Trending keyword (e.g. "부동산 경매") */
  keyword: string;
  /** Approximate search traffic string from RSS (e.g. "200,000+") */
  traffic: string;
  /** ISO date string from the RSS <pubDate> */
  pubDate: string;
  /** News article titles associated with the trend */
  newsItems: string[];
}

// ─── AI refiner output (matches tool schema) ──────────────────────────────────

export interface RefinedTrend {
  keyword: string;
  category: Category;
  riseRate: number;
  summary: string;
  trendContext: {
    headline: string;
    details: string[];
    relatedKeywords: string[];
    dataSource: string;
  };
  monetizationIdeas: MonetizationIdea[];
  targetAudience: {
    primarySegment: string;
    demographics: string[];
    psychographics: string[];
    painPoints: string[];
  };
}
