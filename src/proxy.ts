import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { refreshSession } from "@/lib/supabase/proxy";

const handleLocale = createMiddleware(routing);

/** Admin routes, with or without a locale prefix. */
const ADMIN_PATH = /^\/(?:(?:en|gu)\/)?admin(?:\/|$)/;

/**
 * Next.js 16 Proxy (formerly Middleware).
 *
 * 1. Locale negotiation and prefixing, on every page request.
 * 2. Supabase session refresh, on admin routes only: public pages never touch
 *    auth, so they stay free of cookies and fully cacheable.
 *
 * Neither step is authorisation. Admin access is checked server-side on each
 * protected route and enforced again by Row Level Security
 * (docs/project-brief/03-CLAUDE-WORKING-RULES.md §11).
 */
export default async function proxy(request: NextRequest) {
  const response = handleLocale(request);
  if (!ADMIN_PATH.test(request.nextUrl.pathname)) return response;
  return refreshSession(request, response);
}

export const config = {
  // Skip Next internals, the API surface and anything with a file extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
