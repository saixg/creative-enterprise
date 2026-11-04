import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { categorySlugs, listProducts } from "@/lib/catalog";
import { CatalogueBrowser } from "@/components/products/catalogue-browser";
import { toCatalogueItems } from "@/components/products/catalogue-items";
import { BrandStrip } from "@/components/marketing/offers-and-brands";
import {
  CategoryRail,
  FeaturedBand,
  StorefrontPromos,
} from "@/components/storefront/storefront-sections";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("title"), description: t("metaDescription") };
}

/**
 * Products: the storefront from reference 01 (D-016).
 * Dark featured band and category rail, then the light catalogue, brands and
 * the promo row.
 */
export default async function ProductsPage({
  params,
}: PageProps<"/[locale]/products">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, products] = await Promise.all([
    getTranslations("products"),
    listProducts(),
  ]);

  return (
    <>
      <FeaturedBand />
      <CategoryRail />

      <section
        id="catalogue"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pt-16 pb-8 sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-accent-soft text-sm font-semibold">
              {t("justArrived")}
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">
              {t("newArrivals")}
            </h2>
            <p className="text-muted mt-1.5">{t("newArrivalsSubtitle")}</p>
          </div>
          <Link
            href="/products/category/laptops"
            className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            {t("viewAll")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <p className="border-warm/40 bg-warm/10 text-warm mt-6 rounded-2xl border px-4 py-3 text-sm">
          {t("placeholderNotice")}
        </p>

        <div className="mt-8">
          <CatalogueBrowser
            items={toCatalogueItems(products, locale as Locale)}
            categories={categorySlugs}
          />
        </div>
      </section>

      <div id="brands" className="scroll-mt-24">
        <BrandStrip />
      </div>

      <StorefrontPromos />
    </>
  );
}
