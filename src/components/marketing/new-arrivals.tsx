import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { listProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/products/product-card";

/**
 * New Arrivals — reference 01's product row, reused on the homepage.
 *
 * Renders the same `ProductCard` as `/products`, so the card's honesty rules
 * (placeholder badge, unverified-price label, price-on-request fallback) apply
 * here for free. A separate "homepage version" of the card would be exactly how
 * those rules drift apart.
 *
 * No carousel — deferred under D-004.
 */
export async function NewArrivals({ locale }: { locale: Locale }) {
  const [t, products] = await Promise.all([
    getTranslations("products"),
    listProducts(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-accent text-sm font-medium">{t("justArrived")}</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            {t("newArrivals")}
          </h2>
          <p className="text-muted mt-2">{t("newArrivalsSubtitle")}</p>
        </div>

        <Link
          href="/products"
          className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {t("viewAll")}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>

      <p className="border-warm/40 bg-warm/10 text-warm mt-6 rounded-2xl border px-4 py-3 text-sm">
        {t("placeholderNotice")}
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.slug} className="flex">
            <ProductCard product={product} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
