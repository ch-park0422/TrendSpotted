/**
 * app/api/cron/update-trends/route.ts
 *
 * Vercel Cron endpoint — runs on a schedule defined in vercel.json.
 * Also callable manually for testing:
 *
 *   curl -X POST http://localhost:3000/api/cron/update-trends \
 *     -H "Authorization: Bearer <CRON_SECRET>"
 *
 * Flow: Authenticate → Scrape Google Trends → Refine with Claude → Upsert to DB
 */

import { NextRequest, NextResponse } from "next/server";
import { scrapeGoogleTrends } from "@/lib/scraper";
import { refineTrendsWithAI } from "@/lib/aiRefine";
import { upsertTrends } from "@/lib/db";

// Run on Node.js runtime for fs/crypto access in db.ts
export const runtime = "nodejs";
// Never cache this route
export const dynamic = "force-dynamic";

// ─── Auth helper ──────────────────────────────────────────────────────────────

function isAuthorised(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // If no secret is configured, only allow in development
    if (process.env.NODE_ENV === "development") return true;
    console.error("[cron] CRON_SECRET is not set — rejecting request");
    return false;
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  return token === cronSecret;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

async function handler(request: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();

  // ── 1. Authenticate ──────────────────────────────────────────────────────
  if (!isAuthorised(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("[cron/update-trends] Starting trend update pipeline…");

  try {
    // ── 2. Scrape Google Trends RSS ────────────────────────────────────────
    console.log("[cron/update-trends] Step 1/3 — Scraping Google Trends…");
    const rawTrends = await scrapeGoogleTrends();

    if (rawTrends.length === 0) {
      return NextResponse.json(
        { ok: true, message: "No trends scraped", scraped: 0 },
        { status: 200 }
      );
    }

    console.log(`[cron/update-trends] Scraped ${rawTrends.length} raw trends`);

    // ── 3. Refine with Claude ──────────────────────────────────────────────
    console.log("[cron/update-trends] Step 2/3 — Refining with Claude AI…");
    const refinedTrends = await refineTrendsWithAI(rawTrends);

    if (refinedTrends.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "AI refinement returned no valid trends",
          scraped: rawTrends.length,
          refined: 0,
        },
        { status: 500 }
      );
    }

    // ── 4. Upsert to DB ────────────────────────────────────────────────────
    console.log("[cron/update-trends] Step 3/3 — Upserting to database…");
    const { upserted, storage } = await upsertTrends(refinedTrends);

    const durationMs = Date.now() - startedAt;

    console.log(
      `[cron/update-trends] Done in ${durationMs}ms — ` +
        `scraped: ${rawTrends.length}, refined: ${refinedTrends.length}, ` +
        `upserted: ${upserted} (${storage})`
    );

    return NextResponse.json(
      {
        ok: true,
        scraped: rawTrends.length,
        refined: refinedTrends.length,
        upserted,
        storage,
        durationMs,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[cron/update-trends] Pipeline failed:", message);

    return NextResponse.json(
      {
        ok: false,
        error: message,
        durationMs: Date.now() - startedAt,
      },
      { status: 500 }
    );
  }
}
