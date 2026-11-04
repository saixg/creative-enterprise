import { describe, expect, it } from "vitest";

import { listProducts } from "./catalog";
import { formatPrice } from "./format";

/**
 * Guards docs/DECISIONS.md D-003 and doc 03 §3: the seeded catalogue is
 * placeholder content and must not drift into looking like verified data.
 *
 * When the owner supplies the real catalogue, these expectations change in the
 * same commit that replaces the data — which is the point. Promoting a row to
 * verified should be a deliberate, reviewable edit.
 */
describe("catalogue", () => {
  it("marks every seeded product as a placeholder", async () => {
    const products = await listProducts();
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      expect(product.isPlaceholder, `${product.slug} isPlaceholder`).toBe(true);
      expect(product.priceIsVerified, `${product.slug} priceIsVerified`).toBe(
        false,
      );
    }
  });

  it("claims no availability it cannot verify", async () => {
    const products = await listProducts();

    for (const product of products) {
      expect(product.availability, `${product.slug} availability`).toBe(
        "unknown",
      );
    }
  });

  it("uses unique slugs", async () => {
    const slugs = (await listProducts()).map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("price formatting", () => {
  it("formats paise as whole rupees", () => {
    // 6_599_000 paise = ₹65,990 — the figure shown in the image-2 reference.
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
  it("recognises only the data model's categories", async () => {
    const { isCategorySlug } = await import("./catalog");
    expect(isCategorySlug("laptops")).toBe(true);
    expect(isCategorySlug("services")).toBe(false);
    expect(isCategorySlug("Laptops")).toBe(false);
  });

  it("returns an empty list, not invented products, for an unstocked category", async () => {
    // D-014: empty categories show an empty state; nothing is padded in.
    const { listProductsByCategory } = await import("./catalog");
    expect(await listProductsByCategory("accessories")).toEqual([]);
  });

  it("never lists a product as related to itself", async () => {
    const { listProducts, listRelatedProducts } = await import("./catalog");
    for (const product of await listProducts()) {
      const related = await listRelatedProducts(product);
      expect(related.map((p) => p.slug)).not.toContain(product.slug);
      expect(related.length).toBeLessThanOrEqual(4);
    }
  });
});
