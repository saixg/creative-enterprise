import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, CircleAlert, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { businessInfo } from "@/lib/business-info";
import {
  getService,
  listRelatedServices,
  listServiceSlugs,
} from "@/lib/services";
import { CompactBand } from "@/components/storefront/storefront-sections";
import { ServiceCard, serviceIcons } from "@/components/services/service-card";
import { Tilt, TiltLayer } from "@/components/motion/tilt";
import { RevealItem } from "@/components/motion/reveal";
import { buttonClasses } from "@/components/ui/button";

export async function generateStaticParams() {
  const slugs = await listServiceSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  const t = await getTranslations({
    locale,
    namespace: `serviceCatalogue.${service.key}`,
  });
  return { title: t("title"), description: t("summary") };
}

/** Whole page depends on the slug; known slugs prerender. */
export const instant = false;

/**
 * A service, laid out as doc 02 §6 asks: what it is, the problem it solves,
 * what it covers, how a request works, and how to make one. No price,
 * turnaround or warranty appears, because none is confirmed (doc 03 §3).
 */
export default async function ServiceDetailPage({
  params,
}: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = await getService(slug);
  if (!service) notFound();

  const [t, pages, related] = await Promise.all([
    getTranslations(`serviceCatalogue.${service.key}`),
    getTranslations("servicePages"),
    listRelatedServices(service),
  ]);
  const covers = t.raw("covers") as string[];
  const signs = t.raw("signs") as string[];
  const Icon = serviceIcons[service.key];
  const whatsapp = businessInfo.whatsappNumberE164;

  return (
    <>
      <CompactBand
        label={pages("breadcrumb")}
        crumbs={[
          { href: "/services", label: pages("title") },
          { label: t("title") },
        ]}
        title={t("title")}
        intro={t("summary")}
      />

      <div className="relative z-10 mx-auto -mt-16 grid w-full max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        {/* Media stage: the service's image lifted off a tilting plate. */}
        <Tilt className="rounded-3xl lg:sticky lg:top-28 lg:self-start" max={5}>
          <div className="surface-card relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl [transform-style:preserve-3d]">
            {service.photo && service.image ? (
              <Image
                src={service.image}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 560px, 92vw"
                className="object-cover"
              />
            ) : (
              <>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_75%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]"
                />
                <TiltLayer depth={44} className="relative size-[62%]">
                  {service.image ? (
                    <span className="relative block size-full">
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        priority
                        sizes="360px"
                        className="object-contain drop-shadow-[0_24px_28px_color-mix(in_oklab,var(--primary-deep)_30%,transparent)]"
                      />
                    </span>
                  ) : (
                    <span className="bg-primary/10 text-primary flex size-full items-center justify-center rounded-[2rem]">
                      <Icon
                        aria-hidden
                        className="size-1/2"
                        strokeWidth={1.2}
                      />
                    </span>
                  )}
                </TiltLayer>
              </>
            )}
            <span className="bg-warm/15 text-warm absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold">
              {pages("candidateBadge")}
            </span>
          </div>
        </Tilt>

        <div className="lg:pt-20">
          <RevealItem>
            <h2 className="text-muted text-sm font-semibold">
              {pages("problem")}
            </h2>
            <p className="mt-2 text-xl leading-relaxed font-medium text-pretty">
              {t("problem")}
            </p>
          </RevealItem>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <RevealItem index={1} className="surface-card rounded-3xl p-6">
              <h2 className="text-lg font-bold">{pages("covers")}</h2>
              <ul className="mt-4 space-y-2.5">
                {covers.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <CheckCircle2
                      aria-hidden
                      className="text-primary mt-0.5 size-4 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
            <RevealItem index={2} className="surface-card rounded-3xl p-6">
              <h2 className="text-lg font-bold">{pages("signs")}</h2>
              <ul className="mt-4 space-y-2.5">
                {signs.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <CircleAlert
                      aria-hidden
                      className="text-accent-soft mt-0.5 size-4 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          </div>

          <RevealItem index={3} className="mt-6">
            <div
              data-theme="app"
              className="bg-background text-foreground relative overflow-hidden rounded-3xl p-7"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(60%_90%_at_90%_10%,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_70%)]"
              />
              <div className="relative">
                <h2 className="text-xl font-bold">{pages("requestHeading")}</h2>
                {whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(t("title"))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses({ size: "lg", className: "mt-5" })}
                  >
                    <MessageCircle aria-hidden className="size-4" />
                    {pages("primaryCta")}
                  </a>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled
                      aria-describedby="service-request-unavailable"
                      className={buttonClasses({
                        size: "lg",
                        className: "mt-5",
                      })}
                    >
                      <MessageCircle aria-hidden className="size-4" />
                      {pages("primaryCta")}
                    </button>
                    <p
                      id="service-request-unavailable"
                      className="text-warm mt-3 text-sm"
                    >
                      {pages("requestUnavailable")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </RevealItem>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight">
          {pages("related")}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {related.map((item, index) => (
            <li key={item.slug}>
              <RevealItem index={index} className="h-full">
                <ServiceCard service={item} />
              </RevealItem>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
