import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/marketing/hero";
import { CapabilityStrip } from "@/components/marketing/capability-strip";
import { EntryPoints } from "@/components/marketing/entry-points";
import { StoreStrip } from "@/components/marketing/store-strip";

/**
 * Landing page — theme `landing` (light), per docs/DECISIONS.md D-001/D-005.
 *
 * Section order follows doc 02 §4: hero, two equal entry points, capabilities,
 * store information. Featured products and the services showcase arrive with
 * the catalogue milestone, once there is real data behind them.
 */
export default async function LandingPage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  // Enables static rendering for this locale.
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <CapabilityStrip />
      <EntryPoints />
      <StoreStrip />
    </>
  );
}
