import { defineRouting } from "next-intl/routing";

/**
 * Locale routing for Creative Enterprise.
 *
 * English is the default; Gujarati is the alternative (doc 01 §8).
 * `as-needed` keeps the default locale unprefixed (`/products`) while Gujarati
 * is served from `/gu/products`.
 */
export const routing = defineRouting({
  locales: ["en", "gu"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
