import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Cookie-less Supabase client for PUBLIC reads.
 *
 * It never sees a session, so it always queries as `anon` and RLS returns
 * published rows only (supabase/migrations). Because it reads no cookies it is
 * safe inside `"use cache"` functions, which is what lets the catalogue stay
 * prerendered while still coming from the database.
 *
 * Never use this for admin work: use `@/lib/supabase/server` there, which
 * carries the signed-in admin's session.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
