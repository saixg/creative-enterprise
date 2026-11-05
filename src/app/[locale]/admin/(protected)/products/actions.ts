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
  productSchema,
  resolveStatus,
  slugify,
  type ActionState,
} from "@/features/admin/schemas";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value : "";
};
const box = (fd: FormData, key: string) => (fd.get(key) ? "on" : null);

/**
 * Create or update a product. Validation is server-side (Zod); authorisation
 * is checked here AND by RLS, because the client used carries the admin's
 * own session. Website publication is this one write: nothing else (no
 * campaign, no WhatsApp) can make it fail (doc 01 §6 failure isolation).
 */
export async function saveProduct(
  productId: string | null,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    name: text(formData, "name"),
    slug: text(formData, "slug"),
    brand: text(formData, "brand"),
    categoryId: text(formData, "categoryId"),
    summaryEn: text(formData, "summaryEn"),
    summaryGu: text(formData, "summaryGu"),
    descriptionEn: text(formData, "descriptionEn"),
    descriptionGu: text(formData, "descriptionGu"),
    summarySpecs: text(formData, "summarySpecs"),
    specs: text(formData, "specs"),
    price: text(formData, "price"),
    priceIsVerified: box(formData, "priceIsVerified"),
    availability: text(formData, "availability"),
    isNew: box(formData, "isNew"),
    isFeatured: box(formData, "isFeatured"),
    isPlaceholder: box(formData, "isPlaceholder"),
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

  // Brand: reuse by slug, create when new. Never renames an existing brand.
  let brandId: string | null = null;
  if (v.brand) {
    const slug = slugify(v.brand);
    const { data: existing } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      brandId = existing.id;
    } else {
      const { data: created, error } = await supabase
        .from("brands")
        .insert({ slug, name: v.brand })
        .select("id")
        .single();
      if (error)
        return { status: "error", message: "Could not save the brand." };
      brandId = created.id;
    }
  }

  let current: "draft" | "published" | null = null;
  if (productId) {
    const { data } = await supabase
      .from("products")
      .select("status")
      .eq("id", productId)
      .maybeSingle();
    if (!data)
      return { status: "error", message: "That product no longer exists." };
    current = data.status;
  }

  const record = {
    name: v.name,
    slug: v.slug,
    brand_id: brandId,
    category_id: v.categoryId,
    summary_en: v.summaryEn,
    summary_gu: v.summaryGu,
    description_en: v.descriptionEn,
    description_gu: v.descriptionGu,
    summary_specs: v.summarySpecs,
    specs: v.specs,
    price_paise: v.price,
    price_is_verified: v.priceIsVerified,
    availability: v.availability,
    is_new: v.isNew,
    is_featured: v.isFeatured,
    is_placeholder: v.isPlaceholder,
    status: resolveStatus(v.intent, current),
  };

  const result = productId
    ? await supabase
        .from("products")
        .update(record)
        .eq("id", productId)
        .select("id")
        .single()
    : await supabase.from("products").insert(record).select("id").single();

  if (result.error) {
    if (result.error.code === "23505") {
      return {
        status: "error",
        message: "Some fields need attention.",
        errors: { slug: "Another product already uses this web address." },
      };
    }
    return {
      status: "error",
      message: "The product could not be saved. Try again.",
    };
  }

  updateTag(CACHE_TAGS.catalogue);

  if (!productId) {
    const locale = await getLocale();
    redirect({ href: `/admin/products/${result.data.id}?created=1`, locale });
  }

  const messages = {
    publish: "Saved and published. It is live on the website now.",
    unpublish: "Saved and unpublished. Visitors can no longer see it.",
    save: "Saved.",
  } as const;
  return { status: "success", message: messages[v.intent] };
}

export async function deleteProduct(productId: string): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("product_media")
    .select("storage_path")
    .eq("product_id", productId);
  const stored = (media ?? []).map((m) => m.storage_path).filter(isStoredMedia);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  if (error) {
    // 23503: referenced elsewhere. Inquiries keep their product link as
    // ON DELETE SET NULL, so this is unexpected; report it plainly.
    return { status: "error", message: "The product could not be deleted." };
  }
  // Files after the row: a leftover file is harmless, a row pointing at a
  // missing file is not.
  if (stored.length) await supabase.storage.from(MEDIA_BUCKET).remove(stored);

  updateTag(CACHE_TAGS.catalogue);
  const locale = await getLocale();
  redirect({ href: "/admin/products?deleted=1", locale });
  return { status: "success" };
}

/** Record a photo the browser has just uploaded to the media bucket. */
export async function addProductMedia(
  productId: string,
  file: { path: string; width: number; height: number; alt: string },
): Promise<ActionState> {
  await requireAdmin();
  if (
    !file.path.startsWith(`products/${productId}/`) ||
    !Number.isInteger(file.width) ||
    !Number.isInteger(file.height) ||
    file.width <= 0 ||
    file.height <= 0
  ) {
    return { status: "error", message: "That upload is not valid." };
  }
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("product_media")
    .select("id, is_primary")
    .eq("product_id", productId);

  const { error } = await supabase.from("product_media").insert({
    product_id: productId,
    storage_path: file.path,
    kind: "image",
    alt_en: file.alt.trim().slice(0, 200) || null,
    width: file.width,
    height: file.height,
    sort_order: existing?.length ?? 0,
    is_primary: !existing?.some((m) => m.is_primary),
  });
  if (error)
    return { status: "error", message: "The photo could not be saved." };

  updateTag(CACHE_TAGS.catalogue);
  return { status: "success", message: "Photo added." };
}

export async function updateProductMedia(
  mediaId: string,
  values: { altEn: string; altGu: string; isRepresentative: boolean },
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_media")
    .update({
      alt_en: values.altEn.trim().slice(0, 200) || null,
      alt_gu: values.altGu.trim().slice(0, 200) || null,
      is_representative: values.isRepresentative,
    })
    .eq("id", mediaId);
  if (error)
    return {
      status: "error",
      message: "The photo details could not be saved.",
    };
  updateTag(CACHE_TAGS.catalogue);
  return { status: "success", message: "Photo details saved." };
}

export async function setPrimaryMedia(
  productId: string,
  mediaId: string,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  // Clear first: a unique index allows one primary per product.
  const clear = await supabase
    .from("product_media")
    .update({ is_primary: false })
    .eq("product_id", productId)
    .eq("is_primary", true);
  const set = await supabase
    .from("product_media")
    .update({ is_primary: true })
    .eq("id", mediaId)
    .eq("product_id", productId);
  if (clear.error || set.error) {
    return { status: "error", message: "The main photo could not be changed." };
  }
  updateTag(CACHE_TAGS.catalogue);
  return { status: "success", message: "Main photo updated." };
}

export async function deleteProductMedia(
  mediaId: string,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("product_media")
    .select("product_id, storage_path, is_primary")
    .eq("id", mediaId)
    .maybeSingle();
  if (!row) return { status: "error", message: "That photo no longer exists." };

  const { error } = await supabase
    .from("product_media")
    .delete()
    .eq("id", mediaId);
  if (error)
    return { status: "error", message: "The photo could not be removed." };
  if (isStoredMedia(row.storage_path)) {
    await supabase.storage.from(MEDIA_BUCKET).remove([row.storage_path]);
  }

  if (row.is_primary) {
    const { data: next } = await supabase
      .from("product_media")
      .select("id")
      .eq("product_id", row.product_id)
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    if (next) {
      await supabase
        .from("product_media")
        .update({ is_primary: true })
        .eq("id", next.id);
    }
  }

  updateTag(CACHE_TAGS.catalogue);
  return { status: "success", message: "Photo removed." };
}
