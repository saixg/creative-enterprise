import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/hero/hero";
import { HeroLocal } from "@/components/hero/hero-local";
import { Pillars } from "@/components/landing/pillars";
import { CapabilityFlow } from "@/components/landing/capability-flow";
import { ClosingCta } from "@/components/landing/closing-cta";

/**
 * Landing page (D-021): fully light, white and blue, no catalogue content.
 *
 * The owner asked for no products and no owner photo here. The page is the
 * brand moment: the reactive 3D hero, the two pillars at equal size, what the
 * business does, where the store is, and one closing call to action. The
 * catalogue lives at /products and /services.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    // One continuous lit field so every glass surface has colour behind it.
    <div className="relative isolate bg-[linear-gradient(180deg,var(--background)_0%,#eef2ff_14%,#f3f6ff_55%,#eef3ff_80%,var(--background)_100%)]">
      <Hero />
      <CapabilityFlow />
      <Pillars />
      <HeroLocal />
      <div className="pt-16">
        <ClosingCta />
      </div>
    </div>
  );
}
