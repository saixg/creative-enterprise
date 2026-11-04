import {
  Camera,
  Headset,
  Laptop,
  MapPin,
  Network,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { businessInfo } from "@/lib/business-info";
import { HeroBackdrop } from "@/components/hero/hero-backdrop";
import { HeroCards } from "@/components/hero/hero-cards";
import { HeroLocal } from "@/components/hero/hero-local";
import { HeroStage } from "@/components/hero/hero-stage";
import { HeroReveal } from "@/components/marketing/hero-reveal";

const capabilities = [
  { key: "laptops", Icon: Laptop },
  { key: "repair", Icon: Wrench },
  { key: "cctv", Icon: Camera },
  { key: "printer", Icon: Printer },
  { key: "onsite", Icon: Headset },
  { key: "network", Icon: Network },
] as const;

/**
 * Hero — a faithful reconstruction of reference 02.
 *
 * The reference is one dense, art-directed screen: copy left; the owner among
 * glass product panels right; entry cards overlapping his lower body; and a
 * local-identity band with the store strip along the bottom. It is rebuilt here
 * as a single section rather than spread across several, because the density
 * IS the design — spreading it out is what made the previous version generic.
 */
export async function Hero() {
  const [t, capabilityT] = await Promise.all([
    getTranslations("hero"),
    getTranslations("capabilities"),
  ]);

  const cards = <HeroCards />;

  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />

      <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-4 pt-6 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:px-10 lg:pt-4">
        {/* ---------------- Copy column ---------------- */}
        <HeroReveal className="order-2 lg:order-1 lg:pt-8">
          {/* Trust badge. Postal code only once the owner verifies it. */}
          <p className="glass inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-3xl px-5 py-2.5 text-sm sm:rounded-full sm:text-[0.95rem]">
            <span className="inline-flex items-center gap-2 font-semibold">
              <ShieldCheck
                aria-hidden
                className="fill-primary text-primary-foreground size-5"
              />
              {t("badge")}
            </span>
            <span
              aria-hidden
              className="bg-border-strong hidden h-5 w-px sm:block"
            />
            <span className="text-foreground inline-flex items-center gap-1.5 font-medium">
              <MapPin aria-hidden className="text-primary size-4" />
              {businessInfo.postalCode.verified
                ? `${businessInfo.city.value} ${businessInfo.postalCode.value}`
                : `${businessInfo.city.value}, ${businessInfo.state.value}`}
            </span>
          </p>

          <h1 className="mt-8">
            <span className="text-foreground block text-[clamp(1.55rem,2.5vw,2.4rem)] leading-tight font-medium tracking-tight">
              {t("headlineLead")}
            </span>
            <span className="relative mt-2 block text-[clamp(2.9rem,5vw,5.1rem)] leading-[0.98] font-extrabold tracking-[-0.035em] italic lg:whitespace-nowrap">
              <span className="text-foreground">{t("headlineSales")}</span>{" "}
              <span className="text-primary/55 font-bold">
                {t("headlineAmp")}
              </span>{" "}
              <span className="text-primary relative inline-block">
                {t("headlineService")}
                {/* Hand-drawn swoosh from the reference, tapering out. */}
                <svg
                  aria-hidden
                  viewBox="0 0 400 30"
                  preserveAspectRatio="none"
                  className="absolute -bottom-[0.32em] left-[-28%] h-[0.32em] w-[118%]"
                >
                  <defs>
                    <linearGradient id="swoosh" x1="0" x2="1">
                      <stop
                        offset="0"
                        stopColor="var(--primary)"
                        stopOpacity="0"
                      />
                      <stop
                        offset="0.25"
                        stopColor="var(--primary)"
                        stopOpacity="0.9"
                      />
                      <stop
                        offset="1"
                        stopColor="var(--primary-deep-2)"
                        stopOpacity="1"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M6 24 C 120 8, 260 4, 394 10"
                    fill="none"
                    stroke="url(#swoosh)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p className="text-foreground/80 mt-8 max-w-xl text-[1.15rem] leading-relaxed text-pretty lg:text-[1.25rem]">
            {(
              ["verbBuy", "verbRepair", "verbService", "verbMaintain"] as const
            ).map((key, index) => (
              <span key={key}>
                {index > 0 && (
                  <span aria-hidden className="text-primary mx-2.5 font-bold">
                    •
                  </span>
                )}
                {t(key)}
              </span>
            ))}{" "}
            <span aria-hidden className="text-primary/70 mx-1">
              —
            </span>{" "}
            {t("subTail")}
          </p>

          {/* Capability tiles */}
          <ul className="mt-8 grid max-w-xl grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6">
            {capabilities.map(({ key, Icon }) => (
              <li key={key} className="flex flex-col items-center text-center">
                <span className="glass flex size-[4.25rem] items-center justify-center rounded-[1.15rem] lg:size-[4.6rem]">
                  <Icon
                    aria-hidden
                    className="text-primary size-8"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="text-foreground mt-2.5 text-[0.8rem] leading-tight font-semibold text-balance">
                  {capabilityT(key)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="btn-gradient text-primary-foreground inline-flex h-14 items-center gap-3 rounded-full px-8 text-[1.05rem] font-semibold transition-transform hover:-translate-y-0.5"
            >
              <ShoppingBag aria-hidden className="size-5" strokeWidth={1.8} />
              {t("primaryCta")}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/services"
              className="glass text-foreground inline-flex h-14 items-center gap-3 rounded-full px-8 text-[1.05rem] font-semibold transition-transform hover:-translate-y-0.5"
            >
              <Wrench aria-hidden className="size-5" strokeWidth={1.8} />
              {t("secondaryCta")}
            </Link>
          </div>
        </HeroReveal>

        {/* ---------------- Stage ---------------- */}
        <div className="order-1 lg:order-2">
          <HeroStage ownerAlt={t("portraitAlt")} cards={cards} />
        </div>

        {/* Below lg the entry cards follow the copy instead of overlapping the
            owner — there is no room for the overlap on a narrow screen. */}
        <div className="order-3 lg:hidden">{cards}</div>
      </div>

      <HeroLocal />
    </section>
  );
}
