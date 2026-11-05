"use server";

import { updateTag } from "next/cache";
import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { isStoredMedia, MEDIA_BUCKET } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import {
  fieldErrors,
  resolveStatus,
  serviceSchema,
  type ActionState,
} from "@/features/admin/schemas";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value : "";
};
const box = (fd: FormData, key: string) => (fd.get(key) ? "on" : null);

/**
 * Create or update a service. There is deliberately no price, turnaround,
 * warranty or guarantee input: none is confirmed (doc 01 §2.2, doc 03 §3).
 */
export async function saveService(
  serviceId: string | null,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = serviceSchema.safeParse({
    nameEn: text(formData, "nameEn"),
    nameGu: text(formData, "nameGu"),
    slug: text(formData, "slug"),
    icon: text(formData, "icon"),
    summaryEn: text(formData, "summaryEn"),
    summaryGu: text(formData, "summaryGu"),
    problemEn: text(formData, "problemEn"),
    problemGu: text(formData, "problemGu"),
    coversEn: text(formData, "coversEn"),
    coversGu: text(formData, "coversGu"),
    signsEn: text(formData, "signsEn"),
    signsGu: text(formData, "signsGu"),
    sortOrder: text(formData, "sortOrder") || "0",
    imageIsPhoto: box(formData, "imageIsPhoto"),
    isConfirmed: box(formData, "isConfirmed"),
    intent: text(formData, "intent") || "save",
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Some fields need attention.",
      errors: fieldErrors(parsed.error),
    };
  }
  const v = parsed.data;
  const supabase = await createClient();

  let current: "draft" | "published" | null = null;
  if (serviceId) {
    const { data } = await supabase
      .from("services")
      .select("status")
      .eq("id", serviceId)
      .maybeSingle();
    if (!data)
      return { status: "error", message: "That service no longer exists." };
    current = data.status;
  }

  const record = {
    name_en: v.nameEn,
    name_gu: v.nameGu,
    slug: v.slug,
    icon: v.icon,
    summary_en: v.summaryEn,
    summary_gu: v.summaryGu,
    problem_en: v.problemEn,
    problem_gu: v.problemGu,
    covers_en: v.coversEn,
    covers_gu: v.coversGu,
    signs_en: v.signsEn,
    signs_gu: v.signsGu,
    sort_order: v.sortOrder,
    image_is_photo: v.imageIsPhoto,
    is_candidate: !v.isConfirmed,
    status: resolveStatus(v.intent, current),
  };

  const result = serviceId
    ? await supabase
        .from("services")
        .update(record)
        .eq("id", serviceId)
        .select("id")
        .single()
    : await supabase
        .from("services")
        .insert({ ...record, key: v.slug })
        .select("id")
        .single();

  if (result.error) {
    if (result.error.code === "23505") {
      return {
        status: "error",
        message: "Some fields need attention.",
        errors: { slug: "Another service already uses this web address." },
      };
    }
    return {
      status: "error",
      message: "The service could not be saved. Try again.",
    };
  }

  updateTag(CACHE_TAGS.services);

  if (!serviceId) {
    const locale = await getLocale();
    redirect({ href: `/admin/services/${result.data.id}?created=1`, locale });
  }
  const messages = {
    publish: "Saved and published. It is live on the website now.",
    unpublish: "Saved and unpublished. Visitors can no longer see it.",
    save: "Saved.",
  } as const;
  return { status: "success", message: messages[v.intent] };
}

/** Point the service at a just-uploaded image (or clear it with null). */
export async function setServiceImage(
  serviceId: string,
  path: string | null,
): Promise<ActionState> {
  await requireAdmin();
  if (path !== null && !path.startsWith(`services/${serviceId}/`)) {
    return { status: "error", message: "That upload is not valid." };
  }
  const supabase = await createClient();
  const { data: before } = await supabase
    .from("services")
    .select("image_path")
    .eq("id", serviceId)
    .maybeSingle();
  const { error } = await supabase
    .from("services")
    .update({ image_path: path })
    .eq("id", serviceId);
  if (error)
    return { status: "error", message: "The image could not be saved." };

  if (
    before?.image_path &&
    isStoredMedia(before.image_path) &&
    before.image_path !== path
  ) {
    await supabase.storage.from(MEDIA_BUCKET).remove([before.image_path]);
  }
  updateTag(CACHE_TAGS.services);
  return {
    status: "success",
    message: path ? "Image updated." : "Image removed.",
  };
}

export async function deleteService(serviceId: string): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("services")
    .select("image_path")
    .eq("id", serviceId)
    .maybeSingle();
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);
  if (error)
    return { status: "error", message: "The service could not be deleted." };
  if (row?.image_path && isStoredMedia(row.image_path)) {
    await supabase.storage.from(MEDIA_BUCKET).remove([row.image_path]);
  }
  updateTag(CACHE_TAGS.services);
  const locale = await getLocale();
  redirect({ href: "/admin/services?deleted=1", locale });
  return { status: "success" };
}
