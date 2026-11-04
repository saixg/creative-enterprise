import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { businessInfo } from "@/lib/business-info";

/**
 * The local-identity strip that closes the light half of the homepage
 * (reference 02): Gujarati tagline, Rajkot landmark line art, business name.
 *
 * The landmark is interim artwork — simplified line art standing in for the
 * supplied illustration, which has not been provided. It is a neutral civic
 * silhouette, not a logo or an invented emblem (doc 02 §4 forbids unrelated
 * logo-like symbols).
 */
function ClockTowerArt() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 120"
      fill="none"
      className="text-primary/25 h-24 w-auto"
    >
      <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        {/* ground */}
        <path d="M4 112h212" strokeLinecap="round" />
        {/* main block */}
        <path d="M74 112V58h72v54" />
        <path d="M86 112V74h16v38M118 112V74h16v38" />
        {/* tower */}
        <path d="M96 58V30h28v28" />
        <path d="M110 30V16" strokeLinecap="round" />
        <path d="M100 16h20l-10-12-10 12Z" />
        {/* clock face */}
        <circle cx="110" cy="44" r="7" />
        <path d="M110 40v4l3 2" strokeLinecap="round" />
        {/* arches */}
        <path d="M80 112V92a6 6 0 0 1 12 0v20M128 112V92a6 6 0 0 1 12 0v20" />
        {/* flanking wings */}
        <path d="M46 112V78h28M174 112V78h-28" />
        {/* trees */}
        <path d="M30 112V96M30 96a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM190 112V96M190 96a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </g>
    </svg>
  );
}

export async function LocalStrip() {
  const t = await getTranslations("hero");

  return (
    <div className="border-border border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="flex items-center gap-6">
          <ClockTowerArt />
          <p
            lang="gu"
            className="max-w-[16rem] text-xl leading-snug font-medium text-balance"
          >
            {t("localTagline")}
          </p>
        </div>

        <p className="text-muted inline-flex items-center gap-2">
          <MapPin aria-hidden className="text-primary size-5" />
          <span>
            <span className="text-foreground block font-medium">
              {businessInfo.legalName.value}
            </span>
            <span className="text-sm">{businessInfo.city.value}</span>
          </span>
        </p>
      </div>
    </div>
  );
}
