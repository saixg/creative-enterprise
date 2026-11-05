import { ArrowRight, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { businessInfo } from "@/lib/business-info";
import { HeroBackdrop } from "@/components/hero/hero-backdrop";
import { HeroStage, type StageChip } from "@/components/hero/hero-stage";
import { HeroReveal } from "@/components/marketing/hero-reveal";

/**
 * Hero: one job, four text elements (design audit, 2026-11-04).
 *
 * The previous hero packed ~14 elements into one screen: capability tiles,
 * entry cards, landmark, tagline and store strip all competed with the
 * headline. Those now live in the sections directly below. What stays is the
 * brand's signature from reference 02: the owner, and "Sales & Service" in a
 * heavy italic.
 */
export async function Hero() {
  const [t, products] = await Promise.all([
    getTranslations("hero"),
    getTranslations("products"),
  ]);

  // Five tiles in reference 02's arrangement, all interim renders cut from
  // the reference (D-013) until product photography is supplied. They are
  // category illustrations, not catalogue items, so no product claim rides
  // on them; the catalogue itself uses the credited photos (D-015).
  const chips: StageChip[] = [
    {
      key: "laptops",
      src: "/images/hero/laptop.png",
      alt: "Laptop",
      label: products("categories.laptops"),
    },
    {
      key: "desktops",
      src: "/images/hero/tower.png",
      alt: "Gaming desktop",
      label: products("categories.desktops"),
    },
    {
      key: "cctv",
      src: "/images/hero/cctv.png",
      alt: "CCTV dome camera",
      label: t("chipCctv"),
    },
    {
      key: "repair",
      src: "/images/hero/tools.png",
      alt: "Repair tools",
      label: t("chipRepair"),
    },
    {
      key: "printer",
      src: "/images/hero/printer.png",
      alt: "Office printer",
      label: t("chipPrinter"),
    },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />

      <div className="mx-auto grid min-h-[calc(100dvh-6rem)] w-full max-w-7xl items-center gap-12 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pt-6 lg:pb-20">
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

        <HeroStage ownerAlt={t("portraitAlt")} chips={chips} />
      </div>
    </section>
  );
}
