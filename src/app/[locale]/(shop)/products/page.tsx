import type { Metadata } from "next";
import {
  ArrowRight,
  Cpu,
  Headphones,
  Laptop,
  Monitor,
  Wrench,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buttonClasses } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { listProducts } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return { title: t("title"), description: t("metaDescription") };
}

/**
 * Category tiles from the image-2 reference. "Services" sits alongside the
 * product categories deliberately — doc 01 §2 requires services to carry equal
 * weight, and burying them here would be exactly the drift doc 03 §4 warns
 * about.
 */
const categories = [
  { key: "laptops", href: "/products", Icon: Laptop },
  { key: "desktops", href: "/products", Icon: Monitor },
  { key: "components", href: "/products", Icon: Cpu },
  { key: "accessories", href: "/products", Icon: Headphones },
  { key: "services", href: "/services", Icon: Wrench },
] as const;

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
      {/* Banner. Static, not a carousel — carousels are deferred (D-004). */}
      <section className="border-border relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_70%_20%,var(--surface-muted),transparent_70%)]"
        />

        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="bg-accent/15 text-accent inline-flex rounded-full px-3 py-1 text-xs font-semibold">
            {t("badgeNew")}
          </p>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {t("heroHeadline")}
          </h1>

          <p className="text-muted mt-5 max-w-xl text-lg text-pretty">
            {t("heroSubheadline")}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#catalogue" className={buttonClasses({ size: "lg" })}>
              {t("heroPrimaryCta")}
              <ArrowRight aria-hidden className="size-4" />
            </a>
            <Link
              href="/services"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              <Wrench aria-hidden className="size-4" />
              {t("heroSecondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="sr-only">{t("categoriesHeading")}</h2>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ key, href, Icon }) => (
            <li key={key}>
              <Link
                href={href}
                className="surface-card hover:shadow-raised flex items-center justify-between gap-3 rounded-2xl px-5 py-6 transition-shadow"
              >
                <span className="font-medium">{t(`categories.${key}`)}</span>
                <Icon aria-hidden className="text-muted size-6 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="catalogue"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-accent text-sm font-medium">
              {t("justArrived")}
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">
              {t("newArrivals")}
            </h2>
            <p className="text-muted mt-2">{t("newArrivalsSubtitle")}</p>
          </div>
        </div>

        {/* Honest framing: this whole grid is placeholder data (D-003). Saying
            so once at the top is clearer than relying on per-card badges alone. */}
        <p className="border-warm/40 bg-warm/10 text-warm mt-6 rounded-2xl border px-4 py-3 text-sm">
          {t("placeholderNotice")}
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.slug} className="flex">
              <ProductCard product={product} locale={locale as Locale} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
