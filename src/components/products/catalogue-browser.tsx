"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";

import type { CategorySlug } from "@/types/catalog";
import { cn } from "@/lib/utils";

/**
 * Client-side filtering and sorting over a server-rendered product list.
 *
 * Each item carries a fully rendered `ProductCard` (`node`) from the server,
 * so the card's honesty rules — Placeholder badge, unverified-price label,
 * price-on-request fallback — exist in exactly one place. This component only
 * chooses which cards to show and in what order.
 *
 * Filtering in the browser keeps the page statically prerendered under Cache
 * Components; reading `searchParams` on the server would make it dynamic. The
 * trade-off is that a filtered view has no shareable URL yet.
 */
export type CatalogueItem = {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  /** Integer paise, or null when there is no price. */
  price: number | null;
  node: ReactNode;
};

type Sort = "featured" | "priceAsc" | "priceDesc" | "name";

const chip =
  "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors " +
  "focus-visible:outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";

export function CatalogueBrowser({
  items,
  categories,
  showCategoryFilter = true,
}: {
  items: CatalogueItem[];
  /** Category slugs to offer as filters, in display order. */
  categories: readonly CategorySlug[];
  showCategoryFilter?: boolean;
}) {
  const t = useTranslations("products");
  const reduceMotion = useReducedMotion();
  const [category, setCategory] = useState<CategorySlug | "all">("all");
  const [brand, setBrand] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const brands = useMemo(
    () => [...new Set(items.map((item) => item.brand))].sort(),
    [items],
  );

  const visible = useMemo(() => {
    const filtered = items.filter(
      (item) =>
        (category === "all" || item.category === category) &&
        (brand === "all" || item.brand === brand),
    );
    if (sort === "featured") return filtered;

    // Items without a price sort last in both directions: "price on request"
    // is not cheaper or dearer than anything.
    const byPrice =
      (direction: 1 | -1) => (a: CatalogueItem, b: CatalogueItem) => {
        if (a.price === null) return b.price === null ? 0 : 1;
        if (b.price === null) return -1;
        return (a.price - b.price) * direction;
      };
    return [...filtered].sort(
      sort === "name"
        ? (a, b) => a.name.localeCompare(b.name)
        : byPrice(sort === "priceAsc" ? 1 : -1),
    );
  }, [items, category, brand, sort]);

  const countIn = (slug: CategorySlug) =>
    items.filter((item) => item.category === slug).length;

  const isFiltered = category !== "all" || brand !== "all";

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          {showCategoryFilter && (
            <div
              role="group"
              aria-label={t("filters.category")}
              className="flex flex-wrap gap-2"
            >
              {(["all", ...categories] as const).map((slug) => {
                const active = category === slug;
                const count = slug === "all" ? items.length : countIn(slug);
                return (
                  <button
                    key={slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(slug)}
                    className={cn(
                      chip,
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface text-foreground hover:border-border-strong",
                    )}
                  >
                    {slug === "all"
                      ? t("filters.all")
                      : t(`categories.${slug}`)}
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        active ? "opacity-80" : "text-muted",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {brands.length > 1 && (
            <div
              role="group"
              aria-label={t("filters.brand")}
              className="flex flex-wrap gap-2"
            >
              {["all", ...brands].map((name) => {
                const active = brand === name;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setBrand(name)}
                    className={cn(
                      chip,
                      "h-9 text-[0.8rem]",
                      active
                        ? "border-accent bg-accent/15 text-foreground"
                        : "border-border text-muted hover:text-foreground",
                    )}
                  >
                    {name === "all" ? t("filters.allBrands") : name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <label className="text-muted flex items-center gap-3 text-sm">
          <SlidersHorizontal aria-hidden className="size-4" />
          <span>{t("filters.sort")}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="border-border bg-surface text-foreground focus-visible:outline-focus-ring h-10 rounded-full border px-4 text-sm font-medium focus-visible:outline-2"
          >
            <option value="featured">{t("filters.sortFeatured")}</option>
            <option value="priceAsc">{t("filters.sortPriceAsc")}</option>
            <option value="priceDesc">{t("filters.sortPriceDesc")}</option>
            <option value="name">{t("filters.sortName")}</option>
          </select>
        </label>
      </div>

      <p aria-live="polite" className="text-muted mt-5 text-sm">
        {t("filters.results", { count: visible.length })}
      </p>

      {visible.length === 0 ? (
        <div className="surface-card mt-6 flex flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
          <p className="text-lg font-medium">{t("filters.noMatchTitle")}</p>
          <p className="text-muted max-w-md text-pretty">
            {t("filters.noMatchBody")}
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                setBrand("all");
              }}
              className={cn(chip, "border-border bg-surface mt-2")}
            >
              {t("filters.clear")}
            </button>
          )}
        </div>
      ) : (
        // Layout animation: cards glide to their new positions when the
        // filter or sort changes, instead of jumping. Off under reduced motion.
        <LayoutGroup>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((item) => (
                <motion.li
                  key={item.slug}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex"
                >
                  {item.node}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </LayoutGroup>
      )}
    </div>
  );
}
