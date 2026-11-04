import { ArrowRight, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";
import { businessInfo } from "@/lib/business-info";
import { FloatingPanels } from "@/components/marketing/floating-panels";
import { OwnerPortrait } from "@/components/marketing/owner-portrait";
import { HeroReveal } from "@/components/marketing/hero-reveal";

/**
 * Hero — reference 02, the brand-first half of the homepage.
 *
 * Composition: copy left, owner centred in a stage of floating product panels
 * right. The owner sits IN FRONT of the panels (higher z-index), which is what
 * makes the cluster read as his stock rather than as decoration.
 */
export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        // Cool wash in the upper right, as in reference 02. It is what gives
        // the product panels something to sit against instead of floating on
        // flat white.
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_65%_at_78%_6%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_68%),radial-gradient(95%_75%_at_72%_22%,var(--background-subtle),transparent_72%)]"
      />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8 lg:px-8 lg:pt-16 lg:pb-24">
        <HeroReveal className="order-2 lg:order-1">
          <p className="border-border bg-surface shadow-card inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border px-4 py-2 text-sm">
            <span className="inline-flex items-center gap-2 font-medium">
              <ShieldCheck aria-hidden className="text-primary size-4" />
              {t("badge")}
            </span>
            {businessInfo.postalCode.verified && (
              <>
                <span aria-hidden className="text-border-strong">
                  |
                </span>
                <span className="text-muted inline-flex items-center gap-2">
                  <MapPin aria-hidden className="size-4" />
                  {businessInfo.postalCode.value}
                </span>
              </>
            )}
          </p>

          <h1 className="mt-7 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t("headlineLead")}{" "}
            <span className="relative inline-block">
              <span className="text-primary italic">
                {t("headlineEmphasis")}
              </span>
              {/* The hand-drawn swoosh from the reference — part of the
                  brand's character, so it is rebuilt as SVG rather than
                  dropped. */}
              <svg
                aria-hidden
                viewBox="0 0 320 18"
                preserveAspectRatio="none"
                className="text-primary/60 absolute -bottom-2 left-0 h-3 w-full"
              >
                <path
                  d="M4 13C64 4 150 2 232 6c34 2 60 5 84 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-muted mt-8 max-w-xl text-lg text-pretty">
            {t("subheadline")}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/products" className={buttonClasses({ size: "lg" })}>
              {t("primaryCta")}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              href="/services"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              <Wrench aria-hidden className="size-4" />
              {t("secondaryCta")}
            </Link>
          </div>
        </HeroReveal>

        {/* Hero stage: panels behind, owner in front. */}
        <div className="relative order-1 mx-auto flex aspect-square w-full max-w-md items-center justify-center lg:order-2 lg:max-w-xl">
          <FloatingPanels label={t("panelsLabel")} />
          <OwnerPortrait alt={t("portraitAlt")} className="relative z-10" />
        </div>
      </div>
    </section>
  );
}
