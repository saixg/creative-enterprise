import type {
  CategorySlug,
  Localized,
  Product,
  ProductImage,
  Spec,
} from "@/types/catalog";
import type { Database, Json } from "@/types/database";
import { mediaUrl } from "@/lib/media";

type Tables = Database["public"]["Tables"];
type ProductRow = Tables["products"]["Row"];
type MediaRow = Tables["product_media"]["Row"];

/** The columns the public catalogue selects. */
export const PRODUCT_SELECT =
  "*, brand:brands(name), category:categories(slug), media:product_media(*)" as const;

export type ProductQueryRow = ProductRow & {
  brand: { name: string } | null;
  category: { slug: string } | null;
  media: MediaRow[];
};

export const categorySlugs = [
  "laptops",
  "desktops",
  "components",
  "accessories",
] as const satisfies readonly CategorySlug[];

export function isCategorySlug(value: string): value is CategorySlug {
  return (categorySlugs as readonly string[]).includes(value);
}

function isRecord(value: Json | undefined): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const str = (value: Json | undefined) =>
  typeof value === "string" ? value : "";

/** Specs are stored as jsonb; anything malformed is dropped, never invented. */
export function parseSpecs(value: Json): Spec[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) =>
    isRecord(item) && str(item.label) && str(item.value)
      ? [{ label: str(item.label), value: str(item.value) }]
      : [],
  );
}

export function toProductImage(row: MediaRow): ProductImage | null {
  if (row.kind !== "image" || !row.width || !row.height) return null;
  const credit = isRecord(row.credit ?? undefined)
    ? (row.credit as Record<string, Json>)
    : null;
  return {
    src: mediaUrl(row.storage_path),
    width: row.width,
    height: row.height,
    alt: row.alt_en ?? "",
    representative: row.is_representative,
    credit: credit
      ? {
          title: str(credit.title),
          author: str(credit.author),
          license: str(credit.license),
          licenseUrl: str(credit.licenseUrl),
          sourceUrl: str(credit.sourceUrl),
          changes: str(credit.changes),
        }
      : null,
  };
}

/** The primary image, else the first by sort order. */
export function primaryImage(media: MediaRow[]): ProductImage | null {
  const sorted = [...media].sort(
    (a, b) =>
      Number(b.is_primary) - Number(a.is_primary) ||
      a.sort_order - b.sort_order,
  );
  for (const row of sorted) {
    const image = toProductImage(row);
    if (image) return image;
  }
  return null;
}

const localized = (
  en: string | null,
  gu: string | null,
): Localized<string | null> => ({ en, gu });

export function toProduct(row: ProductQueryRow): Product | null {
  const category = row.category?.slug;
  // A category the storefront has no page for would produce a broken link;
  // skip the row rather than guess where it belongs.
  if (!category || !isCategorySlug(category)) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand?.name ?? "",
    category,
    summary: localized(row.summary_en, row.summary_gu),
    description: localized(row.description_en, row.description_gu),
    isFeatured: row.is_featured,
    summarySpecs: row.summary_specs,
    specs: parseSpecs(row.specs),
    priceInPaise: row.price_paise,
    priceIsVerified: row.price_is_verified,
    availability: row.availability,
    isNew: row.is_new,
    image: primaryImage(row.media ?? []),
    isPlaceholder: row.is_placeholder,
  };
}

/** Pick a locale's text, falling back to English when Gujarati is missing. */
export function pick<T>(value: Localized<T | null>, locale: string): T | null {
  return (locale === "gu" ? value.gu : null) ?? value.en;
}
