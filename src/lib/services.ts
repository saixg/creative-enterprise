import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { createPublicClient } from "@/lib/supabase/public";
import { toServiceRecord, type ServiceRecord } from "@/lib/services-map";

export {
  serviceCopy,
  type ServiceCopy,
  type ServiceIcon,
  type ServiceRecord,
} from "@/lib/services-map";

/**
 * Service catalogue: the single seam between service pages and the database.
 *
 * Published rows only (RLS, anon client), cached under the `services` tag and
 * refreshed by admin saves. Records seeded from doc 01's candidate list keep
 * `isCandidate`, and the pages say so until the owner confirms each service.
 */
async function fetchPublishedServices(): Promise<ServiceRecord[]> {
  "use cache";
  cacheTag(CACHE_TAGS.services);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("sort_order")
    .order("name_en");

  if (error) throw new Error(`Services read failed: ${error.message}`);
  return data.map(toServiceRecord);
}

export async function listServices(): Promise<ServiceRecord[]> {
  return fetchPublishedServices();
}

export async function getService(slug: string): Promise<ServiceRecord | null> {
  return (await listServices()).find((s) => s.slug === slug) ?? null;
}

export async function listServiceSlugs(): Promise<string[]> {
  return (await listServices()).map((s) => s.slug);
}

/** Other services to suggest on a detail page, never the page's own. */
export async function listRelatedServices(
  service: ServiceRecord,
  limit = 3,
): Promise<ServiceRecord[]> {
  return (await listServices())
    .filter((s) => s.slug !== service.slug)
    .slice(0, limit);
}
