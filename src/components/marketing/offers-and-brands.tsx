import { Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { listProducts } from "@/lib/catalog";

/**
 * Offers — an honest empty state.
 *
 * D-011 put Offers in scope, but the owner has supplied no promotion, discount
 * or campaign. Doc 03 §3 lists discounts among the things never to invent, so
 * this section says what is missing and who supplies it rather than showing an
 * invented "20% off".
 *
 * When real offers arrive this becomes a grid; the heading and anchor stay, so
 * the navigation link keeps working either way.
 */
export async function OffersSection() {
  const t = await getTranslations("offers");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold tracking-tight">{t("heading")}</h2>
      <p className="text-muted mt-2">{t("subtitle")}</p>

      <div className="surface-card mt-8 flex flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
        <Tag aria-hidden className="text-border-strong size-10" />
        <p className="text-lg font-medium">{t("emptyTitle")}</p>
        <p className="text-muted max-w-md text-pretty">{t("emptyBody")}</p>
      </div>
    </div>
  );
}

/**
 * Brands.
 *
 * Shows only the brand names attached to catalogue records. No brand logos are
 * rendered and no authorised-dealer, partnership or reseller claim is made —
 * none has been confirmed (D-011), and doc 03 §3 lists business credentials as
 * something never to invent.
 */
export async function BrandStrip() {
  const [t, products] = await Promise.all([
    getTranslations("brands"),
    listProducts(),
  ]);

  const brands = [...new Set(products.map((p) => p.brand))].sort();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold tracking-tight">{t("heading")}</h2>
      <p className="text-muted mt-2 max-w-2xl text-pretty">{t("subtitle")}</p>

      <ul className="mt-8 flex flex-wrap gap-3">
        {brands.map((brand) => (
          <li
            key={brand}
            className="surface-card rounded-2xl px-6 py-4 text-sm font-medium"
          >
            {brand}
          </li>
        ))}
      </ul>

      <p className="text-warm mt-6 text-sm">{t("notice")}</p>
    </div>
  );
}
