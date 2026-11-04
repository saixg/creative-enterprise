/**
 * Service catalogue: the single seam between service pages and their data.
 *
 * The list is doc 01 §2.2's *candidate* service categories. None is confirmed
 * by the owner yet, so pages carry a notice, and no record holds a price,
 * turnaround time, warranty or guarantee (doc 03 §3). Fields for those are
 * deliberately absent: a column that does not exist cannot be filled with an
 * invented value.
 *
 * Copy lives in the message catalogues under `serviceCatalogue.<key>`; this
 * file holds only structure and media.
 */

export type ServiceKey =
  "repair" | "screen" | "upgrades" | "software" | "cctv" | "printer" | "amc";

export type ServiceRecord = {
  slug: string;
  key: ServiceKey;
  /** Cut-out render or photo; null renders the service's icon instead. */
  image: string | null;
  /** True when the image is a photo (cover) rather than a cut-out (contain). */
  photo: boolean;
  /** Candidate from doc 01, not yet confirmed by the owner. */
  isCandidate: true;
};

export const services: ServiceRecord[] = [
  {
    slug: "laptop-desktop-repair",
    key: "repair",
    image: "/images/storefront/promo-repair.webp",
    photo: true,
    isCandidate: true,
  },
  {
    slug: "screen-replacement",
    key: "screen",
    image: "/images/products/lenovo-ideapad-slim-5.webp",
    photo: false,
    isCandidate: true,
  },
  {
    slug: "hardware-upgrades",
    key: "upgrades",
    image: "/images/storefront/cat-components.png",
    photo: false,
    isCandidate: true,
  },
  {
    slug: "software-troubleshooting",
    key: "software",
    image: null,
    photo: false,
    isCandidate: true,
  },
  {
    slug: "cctv-installation",
    key: "cctv",
    image: "/images/hero/cctv.png",
    photo: false,
    isCandidate: true,
  },
  {
    slug: "printer-repair",
    key: "printer",
    image: "/images/hero/printer.png",
    photo: false,
    isCandidate: true,
  },
  {
    slug: "maintenance-amc",
    key: "amc",
    image: "/images/storefront/cat-services.png",
    photo: false,
    isCandidate: true,
  },
];

export async function listServices(): Promise<ServiceRecord[]> {
  return services;
}

export async function getService(slug: string): Promise<ServiceRecord | null> {
  return services.find((s) => s.slug === slug) ?? null;
}

export async function listServiceSlugs(): Promise<string[]> {
  return services.map((s) => s.slug);
}

/** Other services to suggest on a detail page, never the page's own. */
export async function listRelatedServices(
  service: ServiceRecord,
  limit = 3,
): Promise<ServiceRecord[]> {
  return services.filter((s) => s.slug !== service.slug).slice(0, limit);
}
