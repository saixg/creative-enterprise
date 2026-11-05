import type { Product, ProductImage } from "@/types/catalog";

/** A seed row: the database assigns the id; copy fields start empty. */
export type SeedProduct = Omit<
  Product,
  "id" | "summary" | "description" | "isFeatured"
>;

const changes =
  "Cropped, background removed and resized for the web by Creative Enterprise.";

/**
 * Photos from Wikimedia Commons, all under licences that permit commercial use
 * with attribution. Adaptations of CC BY-SA photos are themselves offered under
 * the same licence. Full list: docs/ASSET-CREDITS.md.
 */
const images: Record<string, ProductImage> = {
  "hp-victus-15": {
    src: "/images/products/hp-victus-15.webp",
    width: 1200,
    height: 871,
    alt: "HP Victus laptop, lid closed, seen from above",
    representative: true,
    credit: {
      title: "HP Victus laptop",
      author: "OhanaUnited",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:HP_Victus_laptop.jpg",
      changes,
    },
  },
  "lenovo-ideapad-slim-5": {
    src: "/images/products/lenovo-ideapad-slim-5.webp",
    width: 818,
    height: 900,
    alt: "Lenovo IdeaPad laptop, open, three-quarter view",
    representative: true,
    credit: {
      title: "Lenovo IdeaPad 110",
      author: "EEIM",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Lenovo_IdeaPad_110.jpg",
      changes,
    },
  },
  "asus-tuf-gaming-a15": {
    src: "/images/products/asus-tuf-gaming-a15.webp",
    width: 854,
    height: 900,
    alt: "ASUS TUF Gaming laptop, open, seen from above",
    representative: true,
    credit: {
      title: "ASUS TUF Gaming 5 Pro Laptop",
      author: "HuangWending18072009",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:ASUS_TUF_Gaming_5_Pro_Laptop.jpg",
      changes,
    },
  },
  "apple-macbook-air-m3": {
    src: "/images/products/apple-macbook-air-m3.webp",
    width: 1200,
    height: 821,
    alt: "Apple MacBook Air, lid closed, seen from above",
    representative: true,
    credit: {
      title: "MacBook Air (A2681) front",
      author: "メイド理世",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:MacBook_Air_(A2681)_front.jpg",
      changes,
    },
  },
};

/**
 * PLACEHOLDER CATALOGUE — NOT REAL DATA.
 *
 * Every record here was read off the image-2 design reference, not supplied by
 * the owner (docs/DECISIONS.md D-003). Prices, specifications and availability
 * are therefore unverified, and each row carries `isPlaceholder: true` and
 * `priceIsVerified: false`.
 *
 * These exist so the catalogue UI can be built and reviewed before the backend
 * milestone. When Supabase lands, this file becomes the seed script for a local
 * development database and the site reads from the database instead.
 *
 * DO NOT set `isPlaceholder: false` or `priceIsVerified: true` on any row until
 * the owner confirms that specific product and that specific price.
 */
export const placeholderProducts: SeedProduct[] = [
  {
    slug: "hp-victus-15",
    image: images["hp-victus-15"] ?? null,
    name: "HP Victus 15",
    brand: "HP",
    category: "laptops",
    summarySpecs: ["i5-13420H", "RTX 3050", "16GB", "512GB"],
    specs: [
      { label: "Processor", value: "Intel Core i5-13420H" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 3050" },
      { label: "Memory", value: "16GB" },
      { label: "Storage", value: "512GB SSD" },
    ],
    priceInPaise: 6_599_000,
    priceIsVerified: false,
    availability: "unknown",
    isNew: true,
    isPlaceholder: true,
  },
  {
    slug: "lenovo-ideapad-slim-5",
    image: images["lenovo-ideapad-slim-5"] ?? null,
    name: "Lenovo IdeaPad Slim 5",
    brand: "Lenovo",
    category: "laptops",
    summarySpecs: ["Ryzen 7", "16GB", "512GB SSD"],
    specs: [
      { label: "Processor", value: "AMD Ryzen 7" },
      { label: "Memory", value: "16GB" },
      { label: "Storage", value: "512GB SSD" },
    ],
    priceInPaise: 5_899_000,
    priceIsVerified: false,
    availability: "unknown",
    isNew: true,
    isPlaceholder: true,
  },
  {
    slug: "asus-tuf-gaming-a15",
    image: images["asus-tuf-gaming-a15"] ?? null,
    name: "ASUS TUF Gaming A15",
    brand: "ASUS",
    category: "laptops",
    summarySpecs: ["Ryzen 7", "RTX 4060", "16GB", "1TB"],
    specs: [
      { label: "Processor", value: "AMD Ryzen 7" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 4060" },
      { label: "Memory", value: "16GB" },
      { label: "Storage", value: "1TB SSD" },
    ],
    priceInPaise: 10_499_000,
    priceIsVerified: false,
    availability: "unknown",
    isNew: true,
    isPlaceholder: true,
  },
  {
    slug: "apple-macbook-air-m3",
    image: images["apple-macbook-air-m3"] ?? null,
    name: "Apple MacBook Air (M3)",
    brand: "Apple",
    category: "laptops",
    summarySpecs: ["M3", "8GB", "256GB", '13.6"'],
    specs: [
      { label: "Processor", value: "Apple M3" },
      { label: "Memory", value: "8GB unified" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Display", value: '13.6" Liquid Retina' },
    ],
    priceInPaise: 11_490_000,
    priceIsVerified: false,
    availability: "unknown",
    isNew: true,
    isPlaceholder: true,
  },
];

export function findPlaceholderProduct(slug: string): SeedProduct | undefined {
  return placeholderProducts.find((product) => product.slug === slug);
}
