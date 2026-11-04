import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardCheck,
  MessageSquareText,
  PackageCheck,
  ScanSearch,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { listServices } from "@/lib/services";
import {
  BandShell,
  CategoryRail,
} from "@/components/storefront/storefront-sections";
import { ServiceStage } from "@/components/services/service-stage";
import { ServiceCard } from "@/components/services/service-card";
import { RevealItem } from "@/components/motion/reveal";
import { ScrollTimeline } from "@/components/motion/scroll-timeline";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicePages" });
  return { title: t("title"), description: t("metaDescription") };
}

/**
 * Services: the second business pillar, built in the same storefront language
 * as /products (D-016) so the two read as equals (doc 01 §2).
 *
 * Sequence: band with a layered service visual, the category rail, a bento of
 * services, the request process as a scroll-drawn timeline, and a bridge back
 * to products.
 */
export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, services] = await Promise.all([
    getTranslations("servicePages"),
    listServices(),
  ]);

  // Bento: the lead service gets a 2x2 cell; the last two share the bottom row
  // at double width, so 4 columns x 3 rows fill exactly with no empty cell.
  const sizes = ["lg", "sm", "sm", "sm", "sm", "md", "md"] as const;
  const spans = [
    "sm:col-span-2 lg:row-span-2",
    "",
    "",
    "",
    "",
    "sm:col-span-1 lg:col-span-2",
    "sm:col-span-1 lg:col-span-2",
  ];

  const stepIcons = {
    tell: <MessageSquareText className="size-5" />,
    assess: <ScanSearch className="size-5" />,
    agree: <ClipboardCheck className="size-5" />,
    done: <PackageCheck className="size-5" />,
  };

  return (
    <>
      <BandShell>
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-12 pb-40 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pt-16 lg:pb-44">
          <div>
            <p className="border-accent/40 bg-accent/15 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
              <Sparkles aria-hidden className="text-accent size-3.5" />
              {t("badge")}
            </p>
            <h1 className="mt-5 text-[clamp(2.3rem,4vw,3.6rem)] leading-[1.05] font-extrabold tracking-tight text-balance">
              {t("headline")}
            </h1>
            <p className="text-muted mt-5 max-w-lg text-lg text-pretty">
              {t("subhead")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#request"
                className="bg-surface-inverse text-foreground-inverse inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {t("primaryCta")}
                <ArrowRight aria-hidden className="size-4" />
              </a>
              <Link
                href="/products"
                className="border-accent/60 hover:bg-accent/15 inline-flex h-12 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors"
              >
                <ShoppingBag aria-hidden className="text-accent size-4" />
                {t("secondaryCta")}
              </Link>
            </div>
          </div>
          <ServiceStage label={t("headline")} />
        </div>
      </BandShell>

      <CategoryRail current="services" />

      <section className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {t("gridHeading")}
        </h2>
        <p className="text-muted mt-1.5">{t("gridSubtitle")}</p>
        <p className="border-warm/40 bg-warm/10 text-warm mt-6 rounded-2xl border px-4 py-3 text-sm">
          {t("candidateNotice")}
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.slug} className={spans[index]}>
              <RevealItem index={index} className="h-full">
                <ServiceCard service={service} size={sizes[index] ?? "sm"} />
              </RevealItem>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="request"
        className="mx-auto grid w-full max-w-7xl scroll-mt-24 gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
      >
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {t("processHeading")}
          </h2>
          <p className="text-muted mt-3 max-w-sm text-pretty">
            {t("processSubtitle")}
          </p>
          <p className="text-muted mt-8 max-w-sm text-sm text-pretty">
            {t("requestUnavailable")}
          </p>
        </div>
        <ScrollTimeline
          steps={(["tell", "assess", "agree", "done"] as const).map((key) => ({
            key,
            title: t(`steps.${key}.title`),
            body: t(`steps.${key}.body`),
            icon: stepIcons[key],
          }))}
        />
      </section>

      {/* Bridge back to the other pillar. */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div
          data-theme="app"
          className="bg-background text-foreground relative overflow-hidden rounded-3xl p-10 lg:p-14"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(50%_80%_at_85%_50%,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_70%)]"
          />
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {t("productsBridge.title")}
            </h2>
            <p className="text-muted mt-3 text-pretty">
              {t("productsBridge.body")}
            </p>
            <Link
              href="/products"
              className="bg-surface-inverse text-foreground-inverse mt-7 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold"
            >
              {t("productsBridge.cta")}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
