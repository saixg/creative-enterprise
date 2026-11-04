import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import {
  ThemeSection,
  TransitionBand,
} from "@/components/layout/theme-section";
import { Hero } from "@/components/hero/hero";
import { HeroCards } from "@/components/hero/hero-cards";
import { HeroLocal } from "@/components/hero/hero-local";
import { ServiceStrip } from "@/components/hero/service-strip";
import { FeaturedBand } from "@/components/marketing/featured-band";
import { CategoryTiles } from "@/components/marketing/category-tiles";
import { NewArrivals } from "@/components/marketing/new-arrivals";
import {
  BrandStrip,
  OffersSection,
} from "@/components/marketing/offers-and-brands";
import {
  CtaSection,
  PromoPair,
  ServiceShowcase,
  WhyChooseUs,
} from "@/components/marketing/promo-sections";

/**
 * Homepage — one page, two themed halves (docs/DECISIONS.md D-009).
 *
 * Upper half, light `landing` theme (reference 02): who the business is.
 * Lower half, dark `app` theme (reference 01): what it sells and services.
 *
 * The ordering is the design argument: trust, then desire, then utility.
 * `TransitionBand` carries the eye between them so the two halves read as one
 * art-directed page rather than two templates stitched together.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* ---- Light half: brand and identity ---- */}
      {/* Hero does one job. What reference 02 packed around it follows
          directly below, each with room of its own. */}
      <Hero />
      <ServiceStrip />
      <section className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <h2 className="sr-only">Products and services</h2>
        <HeroCards />
      </section>
      <HeroLocal />

      <TransitionBand />

      {/* ---- Dark half: products, promotions and services ---- */}
      <ThemeSection theme="app" aria-label="Products and services">
        <FeaturedBand />
        <CategoryTiles />

        <div id="new-arrivals" className="scroll-mt-24">
          <NewArrivals locale={locale as Locale} />
        </div>

        <div id="offers" className="scroll-mt-24">
          <OffersSection />
        </div>

        <PromoPair />
        <ServiceShowcase />

        <div id="brands" className="scroll-mt-24">
          <BrandStrip />
        </div>

        <WhyChooseUs />
        <CtaSection />
      </ThemeSection>
    </>
  );
}
