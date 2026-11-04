import type { CategorySlug, Product } from "@/types/catalog";
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

/**
 * Product categories, in display order. The set is fixed by the data model
 * (`CategorySlug`); a category can exist with no products yet, and its page
 * then shows an honest empty state rather than being hidden (D-014).
 */
export const categorySlugs = [
  "laptops",
  "desktops",
  "components",
  "accessories",
] as const satisfies readonly CategorySlug[];

export function isCategorySlug(value: string): value is CategorySlug {
  return (categorySlugs as readonly string[]).includes(value);
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
