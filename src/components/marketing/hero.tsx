import { ArrowRight, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";
import { businessInfo } from "@/lib/business-info";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      {/* Ambient wash. Permitted by D-002 (the reference governs), kept to one
          soft field rather than glow on every element. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_75%_10%,var(--background-subtle),transparent_70%)]"
      />

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:py-24">
        <div>
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

          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t("headlineLead")}{" "}
            <span className="text-primary block italic">
              {t("headlineEmphasis")}
            </span>
          </h1>

          <p className="text-muted mt-6 max-w-xl text-lg text-pretty">
            {t("subheadline")}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
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

          <p lang="gu" className="text-muted mt-10 text-lg font-medium">
            {t("localTagline")}
          </p>
        </div>

        {/*
          Owner portrait slot — PLACEHOLDER.
          The real photograph is pending (docs/DECISIONS.md D-008). Doc 02 §4
          and doc 03 §9 forbid substituting a generated person, so this stays an
          empty labelled frame until the supplied asset arrives.
        */}
        <div className="relative">
          <div className="border-border-strong bg-surface-muted shadow-card aspect-4/3 w-full rounded-3xl border border-dashed p-6">
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="bg-warm/15 text-warm rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                Placeholder
              </span>
              <p className="text-muted max-w-xs text-sm">{t("portraitAlt")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
