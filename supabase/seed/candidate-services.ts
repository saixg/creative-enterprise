/**
 * CANDIDATE SERVICES: seed input only (scripts/seed/build-seed.ts).
 *
 * Doc 01 §2.2's candidate categories, none confirmed by the owner (D-017).
 * The live list is the `services` table, edited in /admin/services; this file
 * only exists so supabase/seed/seed.sql can be regenerated.
 */
export type CandidateService = {
  slug: string;
  key:
    "repair" | "screen" | "upgrades" | "software" | "cctv" | "printer" | "amc";
  image: string | null;
  photo: boolean;
  isCandidate: true;
};

export const candidateServices: CandidateService[] = [
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
