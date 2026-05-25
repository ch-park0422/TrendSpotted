/**
 * lib/getTrends.ts
 * 서버 사이드 데이터 읽기 함수.
 * Supabase가 설정되어 있으면 DB에서 읽고, 없으면 mockData로 폴백.
 */

import { getSupabaseAdmin } from "./supabase";
import {
  getTrendsByCategory as getMockByCategory,
  getTrendById as getMockById,
  mockTrends,
  CATEGORIES,
} from "./mockData";
import type { TrendInsight, Category } from "./types";

// ─── Supabase row → TrendInsight 변환 ────────────────────────────────────────

type SupabaseRow = {
  id: string;
  keyword: string;
  category: string;
  rise_rate: number;
  summary: string;
  trend_context: TrendInsight["trendContext"];
  monetization_ideas: TrendInsight["monetizationIdeas"];
  target_audience: TrendInsight["targetAudience"];
  updated_at: string;
  view_count: number;
  bookmark_count: number;
};

function rowToInsight(row: SupabaseRow): TrendInsight {
  return {
    id: row.id,
    keyword: row.keyword,
    category: row.category as Category,
    riseRate: row.rise_rate,
    summary: row.summary,
    trendContext: row.trend_context,
    monetizationIdeas: row.monetization_ideas,
    targetAudience: row.target_audience,
    updatedAt: row.updated_at,
    viewCount: row.view_count ?? 0,
    bookmarkCount: row.bookmark_count ?? 0,
  };
}

// ─── 전체 트렌드 조회 ─────────────────────────────────────────────────────────

export async function getAllTrends(): Promise<TrendInsight[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return mockTrends;

  const { data, error } = await supabase
    .from("trends")
    .select("*")
    .order("rise_rate", { ascending: false });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[getTrends] getAllTrends fallback:", error.message);
    return mockTrends;
  }

  return (data as SupabaseRow[]).map(rowToInsight);
}

// ─── 카테고리별 트렌드 조회 ───────────────────────────────────────────────────

export async function getTrendsByCategory(
  category: Category
): Promise<TrendInsight[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return getMockByCategory(category);

  const { data, error } = await supabase
    .from("trends")
    .select("*")
    .eq("category", category)
    .order("rise_rate", { ascending: false });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[getTrends] getTrendsByCategory fallback:", error.message);
    return getMockByCategory(category);
  }

  return (data as SupabaseRow[]).map(rowToInsight);
}

// ─── ID로 트렌드 단건 조회 ────────────────────────────────────────────────────

export async function getTrendById(
  id: string
): Promise<TrendInsight | undefined> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return getMockById(id);

  const { data, error } = await supabase
    .from("trends")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    if (error && error.code !== "PGRST116") {
      // PGRST116 = row not found (정상)
      console.warn("[getTrends] getTrendById fallback:", error.message);
    }
    return getMockById(id);
  }

  return rowToInsight(data as SupabaseRow);
}

// ─── 전체 카테고리별 트렌드 일괄 조회 ────────────────────────────────────────

export async function getAllTrendsByCategory(): Promise<
  Record<Category, TrendInsight[]>
> {
  const results = await Promise.all(
    CATEGORIES.map((cat) => getTrendsByCategory(cat))
  );

  return Object.fromEntries(
    CATEGORIES.map((cat, i) => [cat, results[i]])
  ) as Record<Category, TrendInsight[]>;
}
