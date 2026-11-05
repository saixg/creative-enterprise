import { describe, expect, it } from "vitest";

import { placeholderProducts } from "../../supabase/seed/placeholder-products";
import {
  isCategorySlug,
  parseSpecs,
  pick,
  primaryImage,
  toProduct,
  type ProductQueryRow,
} from "./catalog-map";
import { mediaUrl } from "./media";
import { formatPrice } from "./format";

/**
 * Guards docs/DECISIONS.md D-003 and doc 03 §3: the placeholder seed (which
 * supabase/seed/seed.sql is generated from) must not drift into looking like
 * verified data. Promoting a row to verified is a deliberate admin action,
 * never a seed edit.
 */
describe("placeholder seed", () => {
  it("marks every seeded product as a placeholder with an unverified price", () => {
    expect(placeholderProducts.length).toBeGreaterThan(0);
    for (const product of placeholderProducts) {
      expect(product.isPlaceholder, `${product.slug} isPlaceholder`).toBe(true);
      expect(product.priceIsVerified, `${product.slug} priceIsVerified`).toBe(
        false,
      );
      expect(product.availability, `${product.slug} availability`).toBe(
        "unknown",
      );
    }
  });

  it("uses unique slugs", () => {
    const slugs = placeholderProducts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

const media = (overrides: Partial<ProductQueryRow["media"][number]> = {}) => ({
  id: "m1",
  product_id: "p1",
  storage_path: "/images/products/x.webp",
  kind: "image",
  alt_en: "A laptop",
  alt_gu: null,
  sort_order: 0,
  is_primary: false,
  credit: null,
  created_at: "",
  width: 800,
  height: 600,
  is_representative: false,
  ...overrides,
});

const row = (overrides: Partial<ProductQueryRow> = {}): ProductQueryRow => ({
  id: "p1",
  slug: "x",
  brand_id: null,
  category_id: "c1",
  name: "X",
  summary_en: "Short",
  summary_gu: null,
  description_en: null,
  description_gu: null,
  summary_specs: [],
  specs: [],
  price_paise: null,
  price_is_verified: false,
  availability: "unknown",
  is_new: false,
  is_featured: false,
  is_placeholder: false,
  status: "published",
  published_at: null,
  created_at: "",
  updated_at: "",
  brand: { name: "HP" },
  category: { slug: "laptops" },
  media: [],
  ...overrides,
});

describe("row mapping", () => {
  it("drops malformed specs instead of inventing values", () => {
    expect(
      parseSpecs([
        { label: "CPU", value: "M3" },
        { label: "", value: "x" },
        { label: "RAM" },
        "junk",
      ]),
    ).toEqual([{ label: "CPU", value: "M3" }]);
    expect(parseSpecs({ not: "an array" })).toEqual([]);
  });

  it("prefers the primary image, then sort order", () => {
    const image = primaryImage([
      media({ id: "a", storage_path: "/a.webp", sort_order: 0 }),
      media({
        id: "b",
        storage_path: "/b.webp",
        sort_order: 1,
        is_primary: true,
      }),
    ]);
    expect(image?.src).toBe("/b.webp");
  });

  it("skips media without dimensions rather than guessing a size", () => {
    expect(primaryImage([media({ width: null })])).toBeNull();
  });

  it("skips a product whose category has no storefront page", () => {
    expect(toProduct(row({ category: { slug: "drones" } }))).toBeNull();
    expect(toProduct(row({ category: null }))).toBeNull();
  });

  it("keeps a missing price as null, never zero", () => {
    expect(toProduct(row())?.priceInPaise).toBeNull();
  });

  it("falls back to English when Gujarati copy is missing", () => {
    const product = toProduct(row())!;
    expect(pick(product.summary, "gu")).toBe("Short");
    expect(pick({ en: "en", gu: "gu" }, "gu")).toBe("gu");
  });
});

describe("media urls", () => {
  it("serves bundled assets as-is and bucket keys from Storage", () => {
    expect(mediaUrl("/images/a.webp")).toBe("/images/a.webp");
    expect(mediaUrl("products/a b.webp")).toMatch(
      /\/storage\/v1\/object\/public\/media\/products\/a%20b\.webp$/,
    );
  });
});

describe("price formatting", () => {
  it("formats paise as whole rupees", () => {
    // 6_599_000 paise = ₹65,990, the figure shown in the image-2 reference.
    expect(formatPrice(6_599_000, "en")).toContain("65,990");
  });

  it("returns null when there is no price, so callers must handle it", () => {
    expect(formatPrice(null, "en")).toBeNull();
  });

  it("never renders a zero for a missing price", () => {
    expect(formatPrice(null, "gu")).not.toBe("₹0");
  });
});

describe("categories", () => {
  it("recognises only the data model's categories", () => {
    expect(isCategorySlug("laptops")).toBe(true);
    expect(isCategorySlug("services")).toBe(false);
    expect(isCategorySlug("Laptops")).toBe(false);
  });
});
