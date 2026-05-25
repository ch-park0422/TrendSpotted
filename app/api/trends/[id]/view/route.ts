/**
 * app/api/trends/[id]/view/route.ts
 * POST endpoint — increments view_count in Supabase via RPC.
 * Called from the client after 24h localStorage dedup check.
 */

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.rpc("increment_view_count", {
      trend_id: id,
    });
    if (error) {
      console.warn("[view] increment_view_count error:", error.message);
    }
  }

  return NextResponse.json({ ok: true });
}
