import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/catalog";
import { formatPrice } from "@/lib/format";
import { Tilt, TiltLayer } from "@/components/motion/tilt";
import { ProductMedia } from "@/components/products/product-media";

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
    <Tilt className="flex w-full rounded-3xl" max={5}>
      <article className="surface-card group focus-within:shadow-raised hover:shadow-raised relative flex h-full w-full flex-col rounded-3xl transition-[box-shadow,transform] duration-300 ease-[var(--ease-out)] [transform-style:preserve-3d] hover:-translate-y-1">
        <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-t-3xl bg-[radial-gradient(80%_70%_at_50%_35%,#ffffff,color-mix(in_oklab,var(--primary)_7%,var(--surface-muted)))] [transform-style:preserve-3d]">
          {/* Soft floor light under the product, brighter on hover. */}
          <div
            aria-hidden
            className="absolute inset-x-[18%] bottom-[12%] h-[14%] rounded-[50%] bg-[color-mix(in_oklab,var(--primary)_22%,transparent)] opacity-60 blur-xl transition-opacity duration-300 group-hover:opacity-100"
          />
          {/* Photo lifted off the card plane by the tilt (D-014). */}
          <TiltLayer
            depth={34}
            className="absolute inset-0 p-7 transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-[1.04]"
          >
            <ProductMedia
              image={product.image}
              pendingLabel={t("imagePending")}
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
              className="flex items-center justify-center"
            />
          </TiltLayer>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap gap-2">
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

          <p className="text-muted text-sm">
            {product.summarySpecs.join(" · ")}
          </p>

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
    </Tilt>
  );
}
