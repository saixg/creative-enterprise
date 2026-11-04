import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import {
  ThemeSection,
  TransitionBand,
} from "@/components/layout/theme-section";
import { Hero } from "@/components/hero/hero";
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
      {/* The hero carries the whole of reference 02 — capability tiles, entry
          cards, local identity and store strip — as one composition. */}
      <Hero />

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
