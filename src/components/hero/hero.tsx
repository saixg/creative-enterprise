import { ArrowRight, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { businessInfo } from "@/lib/business-info";
import { HeroBackdrop } from "@/components/hero/hero-backdrop";
import { HeroScene } from "@/components/hero3d/hero-scene";
import { HeroReveal } from "@/components/marketing/hero-reveal";

/**
 * Landing hero (D-021): the copy column and a reactive WebGL scene.
 *
 * The owner's photo and the product tiles are gone at the owner's request;
 * the right half is now the flowing glass form (components/hero3d). Four
 * text elements, unchanged: eyebrow, headline, one sentence, two CTAs (one
 * per pillar, so products and services stay equal).
 */
export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />
      {/* The 3D core fills the hero behind the copy: right of it on desktop,
          below the CTAs on phones, inside the first screen on both. */}
      <HeroScene className="pointer-events-none absolute inset-0 -z-[5]" />

      <div className="mx-auto grid min-h-[calc(100dvh-5rem)] w-full max-w-7xl content-between gap-6 px-4 pt-10 pb-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:content-center lg:items-center lg:gap-12 lg:px-8 lg:pt-6 lg:pb-20">
        <HeroReveal>
          {/* 1. Eyebrow */}
          <p className="glass inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full px-4 py-2 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold">
              <ShieldCheck aria-hidden className="text-primary size-4" />
              {t("badge")}
            </span>
            <span
              aria-hidden
              className="bg-border-strong hidden h-4 w-px sm:block"
            />
            <span className="text-muted inline-flex items-center gap-1.5">
              <MapPin aria-hidden className="size-3.5" />
              {businessInfo.city.value}, {businessInfo.state.value}
            </span>
          </p>

          {/* 2. Headline */}
          <h1 className="mt-8">
            <span className="text-foreground block text-[clamp(1.6rem,2.6vw,2.5rem)] leading-tight font-semibold tracking-tight">
              {t("headlineLead")}
            </span>
            <span className="mt-1 block pb-2 text-[clamp(3rem,6vw,5.25rem)] leading-[1.1] font-extrabold tracking-[-0.035em] italic">
              <span className="text-foreground">{t("headlineSales")}</span>{" "}
              <span className="text-primary/50 font-bold">
                {t("headlineAmp")}
              </span>{" "}
              <span className="text-primary relative inline-block">
                {t("headlineService")}
                <svg
                  aria-hidden
                  viewBox="0 0 400 30"
                  preserveAspectRatio="none"
                  className="absolute -bottom-[0.2em] left-0 h-[0.26em] w-full"
                >
                  <path
                    d="M6 22 C 120 8, 260 4, 394 10"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.45"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* 3. One sentence, under 20 words. */}
          <p className="text-muted mt-7 max-w-[34rem] text-lg leading-relaxed text-pretty lg:text-xl">
            {t("subcopy")}
          </p>

          {/* 4. Two CTAs, one per intent. */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="btn-gradient sheen text-primary-foreground relative inline-flex h-13 items-center gap-2.5 overflow-hidden rounded-full px-7 text-base font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              {t("primaryCta")}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              href="/services"
              className="glass text-foreground hover:border-primary/40 inline-flex h-13 items-center gap-2.5 rounded-full px-7 text-base font-semibold transition-[transform,border-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Wrench aria-hidden className="size-4" />
              {t("secondaryCta")}
            </Link>
          </div>
        </HeroReveal>
        {/* Room for the 3D core: below the copy on phones, the right column
            on desktop. */}
        <div aria-hidden className="min-h-[32dvh] lg:min-h-0" />
      </div>
    </section>
  );
}
