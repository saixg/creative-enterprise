import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

/**
 * Browser Supabase client. Used ONLY by the admin media uploader, which
 * sends files straight to Storage so large photos never pass through a
 * server action (1 MB body limit). It carries the admin's session cookie, and
 * the `media` bucket policies allow uploads for admins only.
 */
export function createBrowserSupabase() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
