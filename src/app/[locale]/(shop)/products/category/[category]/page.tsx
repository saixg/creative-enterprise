import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import {
  categorySlugs,
  isCategorySlug,
  listProductsByCategory,
} from "@/lib/catalog";
import { CatalogueBrowser } from "@/components/products/catalogue-browser";
import {
  EmptyCategory,
  toCatalogueItems,
} from "@/components/products/catalogue-items";
import {
  CategoryRail,
  CompactBand,
} from "@/components/storefront/storefront-sections";

/**
 * One page per category, prerendered for every locale.
 *
 * Every category in the data model gets a page even when it has no products
 * (D-014) — the empty state says so and routes the visitor to an enquiry,
 * which is the right answer for a shop that may stock far more than it lists.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categorySlugs.map((category) => ({ locale, category })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/products/category/[category]">): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isCategorySlug(category)) return {};
  const t = await getTranslations({ locale, namespace: "products" });
  const name = t(`categories.${category}`);
  return {
    title: name,
    description: t("categoryMeta", { category: name }),
  };
}

/** Whole page depends on the URL's category; see the product detail page. */
export const instant = false;

export default async function CategoryPage({
  params,
}: PageProps<"/[locale]/products/category/[category]">) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  if (!isCategorySlug(category)) notFound();

  const [t, products] = await Promise.all([
    getTranslations("products"),
    listProductsByCategory(category),
  ]);
  const name = t(`categories.${category}`);

  return (
    <>
      <CompactBand
        label={t("breadcrumb")}
        crumbs={[{ href: "/products", label: t("title") }, { label: name }]}
        title={name}
        intro={t("categoryIntro", { category: name.toLowerCase() })}
      />
      <CategoryRail current={category} />

      <div className="mx-auto w-full max-w-7xl px-4 pt-14 pb-16 sm:px-6 lg:px-8">
        <div>
          {products.length === 0 ? (
            <EmptyCategory category={category} />
          ) : (
            <>
              {products.some((p) => p.isPlaceholder) && (
                <p className="border-warm/40 bg-warm/10 text-warning mb-6 rounded-2xl border px-4 py-3 text-sm">
                  {t("placeholderNotice")}
                </p>
              )}
              <CatalogueBrowser
                items={toCatalogueItems(products, locale as Locale)}
                categories={categorySlugs}
                showCategoryFilter={false}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
