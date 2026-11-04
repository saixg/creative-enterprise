import { ArrowRight, Monitor } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/catalog";
import { formatPrice } from "@/lib/format";

/**
 * Product card.
 *
 * Two rules from doc 03 §3 are enforced here rather than left to the caller:
 *   - a placeholder record always shows a visible Placeholder badge
 *   - an unverified price is never rendered as a plain figure; it is labelled,
 *     and a missing price reads "price on request"
 *
 * The action is an inquiry, not a purchase — this is an inquiry-first site with
 * no cart or checkout (doc 01 §2.1).
 */
export async function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const t = await getTranslations("products");
  const price = formatPrice(product.priceInPaise, locale);

  return (
    <article className="surface-card group focus-within:shadow-raised hover:shadow-raised relative flex flex-col overflow-hidden rounded-3xl transition-shadow">
      <div className="bg-surface-muted relative flex aspect-4/3 items-center justify-center">
        <div className="absolute start-4 top-4 flex flex-wrap gap-2">
          {product.isNew && (
            <span className="bg-accent text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold">
              {t("badgeNew")}
            </span>
          )}
          {product.isPlaceholder && (
            <span className="bg-warm/15 text-warm rounded-full px-3 py-1 text-xs font-semibold">
              {t("badgePlaceholder")}
            </span>
          )}
        </div>

        {/* No product imagery supplied yet (D-008). A labelled neutral frame
            rather than a stock photo of someone else's product. */}
        <Monitor aria-hidden className="text-border-strong size-12" />
        <span className="sr-only">{t("imagePending")}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-muted text-xs font-medium tracking-wide uppercase">
            {product.brand}
          </p>
          <h3 className="mt-1 text-base font-semibold text-balance">
            <Link
              href={`/products/${product.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <p className="text-muted text-sm">{product.summarySpecs.join(" · ")}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            {price ? (
              <>
                <p className="text-lg font-semibold">{price}</p>
                {!product.priceIsVerified && (
                  <p className="text-warm text-xs">{t("priceUnverified")}</p>
                )}
              </>
            ) : (
              <p className="text-muted text-sm">{t("priceOnRequest")}</p>
            )}
          </div>

          <span className="text-primary inline-flex items-center gap-1 text-sm font-medium transition-transform group-hover:translate-x-0.5">
            {t("getQuote")}
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
