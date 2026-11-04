import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware navigation helpers.
 *
 * Always import `Link` from here rather than from `next/link` — these variants
 * carry the active locale, so `/products` stays `/gu/products` for a Gujarati
 * visitor instead of silently dropping them back to English.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
