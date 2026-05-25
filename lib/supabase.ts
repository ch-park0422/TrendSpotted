/**
 * lib/supabase.ts
 * Lazy-initialised Supabase admin client (service role).
 * Returns null when credentials are not configured so the rest of the
 * pipeline can fall back to the local JSON mock store gracefully.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
let _initialised = false;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (_initialised) return _client;

  _initialised = true;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(
      "[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — " +
        "running in mock/local mode"
    );
    return null;
  }

  _client = createClient(url, key, {
    auth: {
      // Service-role client should not persist sessions
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _client;
}
