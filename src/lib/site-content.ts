import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { createPublicClient } from "@/lib/supabase/public";
import { mergeBusinessInfo, type BusinessInfo } from "@/lib/business-info";

/**
 * Editable website content (site_content table, /admin/content).
 *
 * Keys in use:
 *   "business"      locale "en" only: store details and contact numbers
 *   "announcement"  per locale: an optional banner above the site header
 *
 * Reads are cached under the `site-content` tag; admin saves refresh it.
 * A failed read falls back to the code defaults (all unverified), so an
 * outage can hide owner edits but can never show an invented fact.
 */
async function fetchContent(): Promise<
  { key: string; locale: "en" | "gu"; value: unknown }[]
> {
  "use cache";
  cacheTag(CACHE_TAGS.content);
  cacheLife("hours");
  const { data, error } = await createPublicClient()
    .from("site_content")
    .select("key, locale, value");
  if (error) {
    console.error("site_content read failed", error.code);
    return [];
  }
  return data;
}

export async function getBusinessInfo(): Promise<BusinessInfo> {
  const rows = await fetchContent();
  const row = rows.find((r) => r.key === "business" && r.locale === "en");
  return mergeBusinessInfo(row?.value);
}

export const announcementSchema = z.object({
  enabled: z.boolean(),
  text: z.string().trim().max(160),
  href: z
    .string()
    .trim()
    .max(200)
    .regex(/^(\/[^\s]*)?$/, "Use a path on this site, like /services.")
    .nullable(),
});
export type Announcement = z.infer<typeof announcementSchema>;

/** The banner for a locale, or null when off or empty. */
export async function getAnnouncement(
  locale: string,
): Promise<Announcement | null> {
  const rows = await fetchContent();
  const row = rows.find(
    (r) =>
      r.key === "announcement" && r.locale === (locale === "gu" ? "gu" : "en"),
  );
  const parsed = announcementSchema.safeParse(row?.value);
  if (!parsed.success || !parsed.data.enabled || !parsed.data.text) return null;
  return parsed.data;
}
