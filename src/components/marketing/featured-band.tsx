import {
  ArrowRight,
  BadgeCheck,
  Laptop,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";

/**
 * The cinematic dark band — reference 01's hero, repurposed as the homepage's
 * "desire" moment after the trust-building light half.
 *
 * No carousel: deferred under D-004, and a carousel over four placeholder
 * records would be motion for its own sake.
 *
 * The trust row states only what doc 02 already permits. No warranty terms, no
 * turnaround promise, no dealer claim — none are confirmed.
 */
const trust = [
  { key: "genuine", Icon: ShieldCheck },
  { key: "warranty", Icon: BadgeCheck },
  { key: "expert", Icon: Wrench },
  { key: "response", Icon: Zap },
] as const;

export async function FeaturedBand() {
  const t = await getTranslations("featured");

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_85%_at_72%_18%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_70%)]"
      />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="bg-accent/15 text-accent inline-flex rounded-full px-3 py-1 text-xs font-semibold">
            {t("badge")}
          </p>

          <h2 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {t("headline")}
          </h2>

          <p className="text-muted mt-5 max-w-lg text-lg text-pretty">
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
              {t("secondaryCta")}
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 lg:flex lg:flex-wrap lg:gap-6">
            {trust.map(({ key, Icon }) => (
              <li key={key} className="flex items-center gap-2 text-sm">
                <Icon aria-hidden className="text-accent size-4 shrink-0" />
                <span className="text-muted">{t(`trust.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/*
          Product stage. Reference 01 puts a lit laptop on a glowing platform
          here. No product photography has been supplied, so the platform and
          framing are built and the product itself is a labelled placeholder.
        */}
        <div className="relative">
          <div className="border-border/70 bg-surface/40 flex aspect-4/3 items-center justify-center rounded-3xl border backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <Laptop aria-hidden className="text-border-strong size-16" />
              <span className="bg-warm/15 text-warm rounded-full px-3 py-1 text-xs font-semibold">
                {t("imagePending")}
              </span>
            </div>
          </div>

          {/* The glowing ellipse beneath the product — one of this viewport's
              two permitted glows (D-002, D-010). */}
          <div
            aria-hidden
            className="bg-accent/30 mx-auto -mt-6 h-10 w-2/3 rounded-[50%] blur-2xl"
          />
        </div>
      </div>
    </div>
  );
}
