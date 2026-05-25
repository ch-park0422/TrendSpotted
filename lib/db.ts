/**
 * lib/db.ts
 * Database operations for TrendInsight persistence.
 *
 * Strategy:
 *   1. When Supabase is configured  → upsert into `trends` table
 *   2. When Supabase is NOT configured → write to a local JSON file
 *      (data/trends.json) so the Next.js app can read it at runtime.
 */

import { createHash } from "crypto";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { getSupabaseAdmin } from "./supabase";
import type { RefinedTrend, TrendInsight } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generates a stable, deterministic ID from the keyword. */
function makeId(keyword: string): string {
  return `trend-${createHash("md5").update(keyword).digest("hex").slice(0, 8)}`;
}

/** Converts a RefinedTrend into the full TrendInsight shape. */
function toTrendInsight(refined: RefinedTrend): TrendInsight {
  return {
    ...refined,
    id: makeId(refined.keyword),
    updatedAt: new Date().toISOString(),
    // Preserve existing counts if available (Supabase merge handles this);
    // for the mock file we just reset to 0 on each run.
    viewCount: 0,
    bookmarkCount: 0,
  };
}

// ─── Supabase upsert ──────────────────────────────────────────────────────────

async function upsertToSupabase(insights: TrendInsight[]): Promise<number> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase client not available");

  // Map to snake_case columns expected by the schema
  const rows = insights.map((ins) => ({
    id: ins.id,
    keyword: ins.keyword,
    category: ins.category,
    rise_rate: ins.riseRate,
    summary: ins.summary,
    trend_context: ins.trendContext,
    monetization_ideas: ins.monetizationIdeas,
    target_audience: ins.targetAudience,
    updated_at: ins.updatedAt,
  }));

  const { error, count } = await supabase
    .from("trends")
    .upsert(rows, {
      onConflict: "id",
      // Don't overwrite view_count / bookmark_count set by users
      ignoreDuplicates: false,
    })
    .select("id");

  if (error) {
    throw new Error(`[db] Supabase upsert failed: ${error.message}`);
  }

  return count ?? rows.length;
}

// ─── Local JSON fallback ──────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const TRENDS_FILE = path.join(DATA_DIR, "trends.json");

async function upsertToLocalFile(insights: TrendInsight[]): Promise<number> {
  // Ensure data/ directory exists
  await mkdir(DATA_DIR, { recursive: true });

  // Read existing data (if any) and merge by id
  let existing: TrendInsight[] = [];
  try {
    const raw = await readFile(TRENDS_FILE, "utf-8");
    existing = JSON.parse(raw) as TrendInsight[];
  } catch {
    // File doesn't exist yet — start fresh
  }

  const map = new Map<string, TrendInsight>(existing.map((t) => [t.id, t]));

  for (const insight of insights) {
    const prev = map.get(insight.id);
    map.set(insight.id, {
      ...insight,
      // Preserve engagement counts from previous run
      viewCount: prev?.viewCount ?? 0,
      bookmarkCount: prev?.bookmarkCount ?? 0,
    });
  }

  const merged = Array.from(map.values()).sort(
    (a, b) => b.riseRate - a.riseRate
  );

  await writeFile(TRENDS_FILE, JSON.stringify(merged, null, 2), "utf-8");
  console.log(`[db] Wrote ${merged.length} trends to ${TRENDS_FILE}`);

  return insights.length;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface UpsertResult {
  upserted: number;
  storage: "supabase" | "local";
}

export async function upsertTrends(refined: RefinedTrend[]): Promise<UpsertResult> {
  if (refined.length === 0) return { upserted: 0, storage: "local" };

  const insights = refined.map(toTrendInsight);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const upserted = await upsertToSupabase(insights);
    return { upserted, storage: "supabase" };
  } else {
    const upserted = await upsertToLocalFile(insights);
    return { upserted, storage: "local" };
  }
}
