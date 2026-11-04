import type { Metadata } from "next";
import {
  ChevronRight,
  ClipboardList,
  MessageCircle,
  Monitor,
  PhoneCall,
  Wrench,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  getProduct,
  listProductSlugs,
  listRelatedProducts,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/products/product-card";
import { ProductInquiry } from "@/components/products/product-inquiry";
import { Tilt, TiltLayer } from "@/components/motion/tilt";
import { buttonClasses } from "@/components/ui/button";

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

  const [t, related] = await Promise.all([
    getTranslations("products"),
    listRelatedProducts(product),
  ]);

  const price = formatPrice(product.priceInPaise, locale as Locale);

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
          <li>
            <Link
              href={`/products/category/${product.category}`}
              className="hover:text-foreground"
            >
              {t(`categories.${product.category}`)}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        {/*
          Media stage. Depth motion (D-014): the stage tilts toward the
          pointer and the media plane lifts off it, with a lit platform
          beneath — reference 01's glowing pedestal, built in CSS. The product
          image itself is still pending (D-008), so the frame is labelled.
        */}
        <Tilt className="rounded-3xl lg:sticky lg:top-28 lg:self-start" max={6}>
          <div className="surface-card relative flex aspect-4/3 flex-col items-center justify-center rounded-3xl [transform-style:preserve-3d]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(60%_50%_at_50%_80%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]"
            />
            <TiltLayer depth={46}>
              <Monitor aria-hidden className="text-border-strong size-24" />
            </TiltLayer>
            <TiltLayer depth={18} className="mt-6">
              <span
                aria-hidden
                className="bg-accent/40 block h-3 w-48 rounded-[50%] blur-md"
              />
            </TiltLayer>
            <span className="bg-warm/15 text-warm absolute bottom-4 rounded-full px-3 py-1 text-xs font-semibold">
              {t("imagePending")}
            </span>
          </div>
        </Tilt>

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

      {/* What an enquiry involves — inquiry-first, so this replaces the
          checkout an e-commerce site would have. Describes the process only;
          no response times or guarantees are promised (doc 03 §3). */}
      <section className="mt-20 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-card rounded-3xl p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("enquirySteps.heading")}
          </h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {(
              [
                ["ask", MessageCircle],
                ["confirm", ClipboardList],
                ["collect", PhoneCall],
              ] as const
            ).map(([key, Icon], index) => (
              <li key={key}>
                <span className="bg-primary/15 text-primary inline-flex size-10 items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <Icon aria-hidden className="text-accent mt-4 size-5" />
                <p className="mt-2 font-medium">
                  {t(`enquirySteps.${key}.title`)}
                </p>
                <p className="text-muted mt-1 text-sm text-pretty">
                  {t(`enquirySteps.${key}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Products and services are equal pillars (doc 01 §2): every
            product page offers the service side too. */}
        <div className="surface-card flex flex-col justify-between gap-6 rounded-3xl p-8">
          <div>
            <Wrench aria-hidden className="text-accent size-7" />
            <h2 className="mt-4 text-xl font-semibold tracking-tight">
              {t("serviceCrossLink.title")}
            </h2>
            <p className="text-muted mt-2 text-sm text-pretty">
              {t("serviceCrossLink.body")}
            </p>
          </div>
          <Link
            href="/services"
            className={buttonClasses({
              variant: "secondary",
              className: "self-start",
            })}
          >
            {t("serviceCrossLink.cta")}
          </Link>
        </div>
      </section>

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
