import type { Product } from "@/types/catalog";

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
export const placeholderProducts: Product[] = [
  {
    slug: "hp-victus-15",
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

export function findPlaceholderProduct(slug: string): Product | undefined {
  return placeholderProducts.find((product) => product.slug === slug);
}
