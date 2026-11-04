import type { Metadata } from "next";
import { ChevronLeft, Monitor } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getProduct, listProductSlugs, listProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/products/product-card";
import { ProductInquiry } from "@/components/products/product-inquiry";

/**
 * Every part of this page depends on the slug, so there is no useful
 * URL-independent shell to stream first. Partial Prefetching would otherwise
 * warn that `params` is read outside a Suspense boundary; a blocking route is
 * the honest shape here. Known slugs are still prerendered at build time by
 * `generateStaticParams` below, so this costs nothing for real products.
 */
export const instant = false;

export async function generateStaticParams() {
  const slugs = await listProductSlugs();

  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);

  if (!product) return {};

  const t = await getTranslations({ locale, namespace: "products" });

  return {
    title: product.name,
    // No invented marketing copy: the description is the verified spec line.
    description: `${product.brand} ${product.name} — ${product.summarySpecs.join(", ")}. ${t("inquiryLead")}`,
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProduct(slug);
  if (!product) notFound();

  const [t, all] = await Promise.all([
    getTranslations("products"),
    listProducts(),
  ]);

  const price = formatPrice(product.priceInPaise, locale as Locale);
  const related = all.filter((item) => item.slug !== product.slug).slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="text-muted hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft aria-hidden className="size-4" />
        {t("backToProducts")}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="surface-card flex aspect-4/3 items-center justify-center rounded-3xl">
          <Monitor aria-hidden className="text-border-strong size-20" />
          <span className="sr-only">{t("imagePending")}</span>
        </div>

        <div>
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

          <p className="text-muted mt-5 text-sm font-medium tracking-wide uppercase">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6">
            {price ? (
              <>
                <p className="text-3xl font-semibold">{price}</p>
                {!product.priceIsVerified && (
                  <p className="text-warm mt-1 text-sm">
                    {t("priceUnverifiedLong")}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted text-lg">{t("priceOnRequest")}</p>
            )}
          </div>

          <ProductInquiry productName={product.name} />

          <div className="mt-10">
            <h2 className="text-lg font-semibold">{t("specifications")}</h2>
            <dl className="border-border mt-4 divide-y divide-[var(--border)] border-t">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between gap-6 py-3"
                >
                  <dt className="text-muted text-sm">{spec.label}</dt>
                  <dd className="text-end text-sm font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
            {product.isPlaceholder && (
              <p className="text-warm mt-4 text-sm">{t("specsUnverified")}</p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("related")}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.slug} className="flex">
                <ProductCard product={item} locale={locale as Locale} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
