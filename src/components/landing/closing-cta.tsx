import { ArrowRight, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/**
 * Closing call to action: a light band with a slowly flowing blue field
 * behind glass. The two buttons repeat the hero's two intents with the same
 * labels (one label per intent across the page).
 */
export async function ClosingCta() {
  const [t, hero] = await Promise.all([
    getTranslations("finalCta"),
    getTranslations("hero"),
  ]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 lg:py-24">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,var(--primary-deep),var(--primary)_55%,var(--accent))]"
        />
        <div
          aria-hidden
          className="animate-drift absolute -inset-1/3 -z-10 bg-[radial-gradient(40%_50%_at_30%_40%,color-mix(in_oklab,white_45%,transparent),transparent_70%),radial-gradient(35%_45%_at_75%_65%,color-mix(in_oklab,var(--accent)_60%,transparent),transparent_70%)] opacity-60"
        />
        <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-extrabold tracking-tight text-balance text-white">
          {t("heading")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-white/80">
          {t("subtitle")}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="sheen text-primary-deep relative inline-flex h-13 items-center gap-2.5 overflow-hidden rounded-full bg-white px-7 text-base font-semibold shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {hero("primaryCta")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-md transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.98]"
          >
            <Wrench aria-hidden className="size-4" />
            {hero("secondaryCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
