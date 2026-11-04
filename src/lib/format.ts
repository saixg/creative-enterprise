import type { Locale } from "@/i18n/routing";

const intlLocale: Record<Locale, string> = {
  en: "en-IN",
  gu: "gu-IN",
};

/**
 * Format an integer paise amount as Indian rupees.
 *
 * Returns `null` when there is no price, so callers must handle the
 * "price on request" case explicitly rather than rendering a silent zero.
 */
export function formatPrice(
  paise: number | null,
  locale: Locale,
): string | null {
  if (paise === null) return null;

  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}
