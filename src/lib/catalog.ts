import type { Product } from "@/types/catalog";
import {
  findPlaceholderProduct,
  placeholderProducts,
} from "../../supabase/seed/placeholder-products";

/**
 * Catalogue data access — the single seam between pages and the data source.
 *
 * Today it returns placeholder seed records (docs/DECISIONS.md D-003). At the
 * backend milestone these functions query Supabase instead, and no page needs
 * to change. Pages must import from here, never from the seed file directly.
 */

export async function listProducts(): Promise<Product[]> {
  return placeholderProducts;
}

export async function getProduct(slug: string): Promise<Product | null> {
  return findPlaceholderProduct(slug) ?? null;
}

export async function listProductSlugs(): Promise<string[]> {
  return placeholderProducts.map((product) => product.slug);
}

/** True while the catalogue is still unverified placeholder content. */
export async function catalogueIsPlaceholder(): Promise<boolean> {
  const products = await listProducts();
  return products.some((product) => product.isPlaceholder);
}
