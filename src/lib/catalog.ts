import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import type { CategorySlug, Product } from "@/types/catalog";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createPublicClient } from "@/lib/supabase/public";
import {
  PRODUCT_SELECT,
  toProduct,
  type ProductQueryRow,
} from "@/lib/catalog-map";

export { categorySlugs, isCategorySlug } from "@/lib/catalog-map";

/**
 * Catalogue data access: the single seam between pages and the database.
 *
 * Reads go through the cookie-less public client, so RLS returns PUBLISHED
 * products only. Results are cached under the `catalogue` tag and the pages
 * stay prerendered; admin saves call `updateTag(CACHE_TAGS.catalogue)` so a
 * publish shows on the website immediately (docs/DECISIONS.md D-019).
 *
 * A failed read throws rather than returning an empty list: an outage must
 * never masquerade as "we have no products".
 */
async function fetchPublishedProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(CACHE_TAGS.catalogue);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Catalogue read failed: ${error.message}`);
  return (data as unknown as ProductQueryRow[]).flatMap((row) => {
    const product = toProduct(row);
    return product ? [product] : [];
  });
}

export async function listProducts(): Promise<Product[]> {
  return fetchPublishedProducts();
}

export async function getProduct(slug: string): Promise<Product | null> {
  return (await listProducts()).find((p) => p.slug === slug) ?? null;
}

export async function listProductSlugs(): Promise<string[]> {
  return (await listProducts()).map((product) => product.slug);
}

/** True while any published product is still unverified placeholder content. */
export async function catalogueIsPlaceholder(): Promise<boolean> {
  return (await listProducts()).some((product) => product.isPlaceholder);
}

export async function listProductsByCategory(
  category: CategorySlug,
): Promise<Product[]> {
  return (await listProducts()).filter((p) => p.category === category);
}

/** Related products: same category first, then the rest, never the product itself. */
export async function listRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const others = (await listProducts()).filter((p) => p.slug !== product.slug);
  const same = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, limit);
}
