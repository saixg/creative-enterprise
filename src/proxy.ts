import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/**
 * Locale negotiation and prefixing.
 *
 * Next.js 16 renamed Middleware to Proxy; the file must be `proxy.ts` beside
 * `app/`. The handler itself is next-intl's standard middleware.
 *
 * Note for the admin milestone: this runs before every matched request, but it
 * is NOT where authorisation belongs. Admin access is checked server-side on
 * each protected route and enforced again by database policies
 * (docs/project-brief/03-CLAUDE-WORKING-RULES.md §11).
 */
export default createMiddleware(routing);

export const config = {
  // Skip Next internals, the API surface and anything with a file extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
