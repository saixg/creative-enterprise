import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
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
import { Tilt } from "@/components/motion/tilt";

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
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label={t("breadcrumb")} className="text-muted text-sm">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/products" className="hover:text-foreground">
              {t("title")}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="text-foreground">
            {name}
          </li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        {name}
      </h1>
      <p className="text-muted mt-3 max-w-xl text-pretty">
        {t("categoryIntro", { category: name.toLowerCase() })}
      </p>

      {/* Sibling categories, so a visitor can move across without going back. */}
      <ul className="mt-8 flex flex-wrap gap-2">
        {categorySlugs.map((slug) => (
          <li key={slug}>
            <Tilt className="rounded-full" max={10} glare={false}>
              <Link
                href={`/products/category/${slug}`}
                aria-current={slug === category ? "page" : undefined}
                className={
                  slug === category
                    ? "bg-primary text-primary-foreground inline-flex h-10 items-center rounded-full px-5 text-sm font-medium"
                    : "border-border bg-surface hover:border-border-strong inline-flex h-10 items-center rounded-full border px-5 text-sm font-medium"
                }
              >
                {t(`categories.${slug}`)}
              </Link>
            </Tilt>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        {products.length === 0 ? (
          <EmptyCategory category={category} />
        ) : (
          <>
            {products.some((p) => p.isPlaceholder) && (
              <p className="border-warm/40 bg-warm/10 text-warm mb-6 rounded-2xl border px-4 py-3 text-sm">
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
  );
}
