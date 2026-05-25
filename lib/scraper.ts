/**
 * lib/scraper.ts
 * Fetches the Google Trends RSS feed for Korea and returns raw keyword data.
 * Falls back to a small set of mock trends when the network is unavailable
 * (e.g. during local development without credentials).
 */

import { XMLParser } from "fast-xml-parser";
import type { RawTrend } from "./types";

const TRENDS_RSS_URL =
  "https://trends.google.com/trending/rss?geo=KR";

/** How many trends to return from the RSS feed (feed usually has 20).
 *  11 = 재테크(5) + 창업/부업(3) + 사이드 프로젝트(3) */
const MAX_TRENDS = 11;

// ─── XML parser ──────────────────────────────────────────────────────────────

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Google Trends wraps traffic in a custom namespace tag
  parseTagValue: true,
  trimValues: true,
});

// ─── Types for raw RSS XML ───────────────────────────────────────────────────

interface RssNewsItem {
  "ht:news_item_title"?: string | string[];
}

interface RssItem {
  title?: string;
  pubDate?: string;
  "ht:approx_traffic"?: string | number;
  "ht:news_item"?: RssNewsItem | RssNewsItem[];
}

interface RssFeed {
  rss?: {
    channel?: {
      item?: RssItem | RssItem[];
    };
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function extractNewsItems(item: RssItem): string[] {
  const newsItems = toArray(item["ht:news_item"]);
  return newsItems
    .map((ni) => {
      const title = ni["ht:news_item_title"];
      if (Array.isArray(title)) return title[0] ?? "";
      return title ?? "";
    })
    .filter(Boolean)
    .slice(0, 3);
}

// ─── Main scraper ─────────────────────────────────────────────────────────────

export async function scrapeGoogleTrends(): Promise<RawTrend[]> {
  try {
    const response = await fetch(TRENDS_RSS_URL, {
      headers: {
        // Mimic a browser request to avoid 403 blocks
        "User-Agent":
          "Mozilla/5.0 (compatible; TrendSpotted/1.0; +https://trendspotted.vercel.app)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      // Vercel edge/serverless timeout safety
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(
        `Google Trends RSS responded with ${response.status} ${response.statusText}`
      );
    }

    const xmlText = await response.text();
    const parsed: RssFeed = parser.parse(xmlText);

    const items = toArray(parsed?.rss?.channel?.item);

    if (items.length === 0) {
      console.warn("[scraper] No items found in RSS feed — using mock data");
      return getMockTrends();
    }

    const trends: RawTrend[] = items.slice(0, MAX_TRENDS).map((item) => ({
      keyword: String(item.title ?? "").trim(),
      traffic: String(item["ht:approx_traffic"] ?? "N/A"),
      pubDate: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      newsItems: extractNewsItems(item),
    }));

    console.log(`[scraper] Fetched ${trends.length} trends from Google Trends RSS`);
    return trends;
  } catch (error) {
    console.warn("[scraper] Failed to fetch Google Trends RSS, falling back to mock data:", error);
    return getMockTrends();
  }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

function getMockTrends(): RawTrend[] {
  const now = new Date().toISOString();
  return [
    {
      keyword: "ISA 계좌",
      traffic: "500,000+",
      pubDate: now,
      newsItems: ["ISA 계좌 세금 혜택 강화", "개인종합자산관리계좌 가입자 급증"],
    },
    {
      keyword: "AI 자동화 부업",
      traffic: "300,000+",
      pubDate: now,
      newsItems: ["ChatGPT로 월 100만원 버는 방법", "AI 툴 활용 프리랜서 급증"],
    },
    {
      keyword: "플리마켓 창업",
      traffic: "200,000+",
      pubDate: now,
      newsItems: ["주말 플리마켓 창업 붐", "핸드메이드 소품 시장 성장"],
    },
    {
      keyword: "미국 ETF",
      traffic: "450,000+",
      pubDate: now,
      newsItems: ["S&P500 ETF 투자 열풍", "해외 ETF 세금 절세 방법"],
    },
    {
      keyword: "노션 템플릿 판매",
      traffic: "180,000+",
      pubDate: now,
      newsItems: ["노션 템플릿 마켓 성장", "디지털 제품 수익화 가이드"],
    },
    {
      keyword: "스마트 스토어",
      traffic: "350,000+",
      pubDate: now,
      newsItems: ["네이버 스마트스토어 개설 방법", "온라인 쇼핑몰 초기 비용 0원"],
    },
    {
      keyword: "배당주 투자",
      traffic: "280,000+",
      pubDate: now,
      newsItems: ["배당주로 월급 외 수입 만들기", "고배당주 TOP 10"],
    },
  ];
}
