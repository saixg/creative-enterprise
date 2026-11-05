import type { Localized } from "@/types/catalog";
import type { Database } from "@/types/database";
import { mediaUrl } from "@/lib/media";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

/** Icons a service can use; mirrors the CHECK constraint on services.icon. */
export const serviceIconKeys = [
  "repair",
  "screen",
  "upgrades",
  "software",
  "cctv",
  "printer",
  "amc",
  "network",
  "support",
] as const;
export type ServiceIcon = (typeof serviceIconKeys)[number];

export function isServiceIcon(value: string): value is ServiceIcon {
  return (serviceIconKeys as readonly string[]).includes(value);
}

export type ServiceCopy = {
  title: string;
  summary: string;
  problem: string;
  covers: string[];
  signs: string[];
};

/**
 * A service as the website renders it. No price, turnaround, warranty or
 * guarantee field exists anywhere in this type or its table (doc 03 §3).
 */
export type ServiceRecord = {
  id: string;
  slug: string;
  key: string;
  icon: ServiceIcon;
  /** Resolved image URL; null renders the service's icon instead. */
  image: string | null;
  /** True when the image is a photo (cover) rather than a cut-out (contain). */
  photo: boolean;
  /** Candidate from doc 01, not yet confirmed by the owner. */
  isCandidate: boolean;
  copy: Localized<ServiceCopy>;
};

export function toServiceRecord(row: ServiceRow): ServiceRecord {
  const en: ServiceCopy = {
    title: row.name_en,
    summary: row.summary_en ?? "",
    problem: row.problem_en ?? "",
    covers: row.covers_en,
    signs: row.signs_en,
  };
  // Field-level fallback: a missing Gujarati field shows the English one
  // rather than an empty gap.
  const gu: ServiceCopy = {
    title: row.name_gu || en.title,
    summary: row.summary_gu || en.summary,
    problem: row.problem_gu || en.problem,
    covers: row.covers_gu.length ? row.covers_gu : en.covers,
    signs: row.signs_gu.length ? row.signs_gu : en.signs,
  };
  return {
    id: row.id,
    slug: row.slug,
    key: row.key,
    icon: isServiceIcon(row.icon) ? row.icon : "repair",
    image: row.image_path ? mediaUrl(row.image_path) : null,
    photo: row.image_is_photo,
    isCandidate: row.is_candidate,
    copy: { en, gu },
  };
}

export function serviceCopy(
  service: ServiceRecord,
  locale: string,
): ServiceCopy {
  return locale === "gu" ? service.copy.gu : service.copy.en;
}
