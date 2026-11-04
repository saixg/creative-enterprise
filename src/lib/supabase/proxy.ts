import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/database";

/**
 * Refreshes the Supabase session cookie on an existing response.
 *
 * Server Components cannot write cookies, so an expiring token is refreshed
 * here, before rendering. The refreshed cookie is written to the request (so
 * Server Components see it) and to the response (so the browser keeps it).
 *
 * It modifies the response it is given rather than creating a new one: the
 * locale proxy runs first and may have rewritten or redirected the request,
 * and that must not be lost.
 *
 * This is session upkeep, not authorisation. Pages decide access themselves,
 * server-side, with getClaims() and the profiles table.
 */
export async function refreshSession(
  request: NextRequest,
  response: NextResponse,
) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          }
          // Cache-control headers from Supabase, so a response carrying a
          // fresh session cookie is never cached and served to someone else.
          for (const [key, value] of Object.entries(headers)) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  // Do not add code between client creation and getClaims(): it is what
  // triggers the refresh. Removing it makes users get signed out at random.
  await supabase.auth.getClaims();

  return response;
}
