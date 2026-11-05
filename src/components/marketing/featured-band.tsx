import { ArrowRight, BadgeCheck, ShieldCheck, Wrench, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";
import { LitPlatform } from "@/components/storefront/storefront-sections";

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

        {/* Reference 01's lit product moment, shared with /products. */}
        <LitPlatform />
      </div>
    </div>
  );
}
