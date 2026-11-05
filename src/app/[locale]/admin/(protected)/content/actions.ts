"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { storedBusinessSchema } from "@/lib/business-info";
import { announcementSchema } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";
import { fieldErrors, type ActionState } from "@/features/admin/schemas";
import { phoneSchema } from "@/features/inquiries/schema";
import type { Json } from "@/types/database";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};

/** "98765 43210" -> "+919876543210"; a bare 10-digit number is Indian. */
function toE164(raw: string): string | null {
  if (!raw) return null;
  const parsed = phoneSchema.safeParse(raw);
  if (!parsed.success) return "invalid";
  const v = parsed.data;
  if (v.startsWith("+")) return v;
  if (v.length === 10) return `+91${v}`;
  if (v.length === 12 && v.startsWith("91")) return `+${v}`;
  return "invalid";
}

async function upsert(key: string, locale: "en" | "gu", value: Json) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  return supabase
    .from("site_content")
    .upsert(
      { key, locale, value, updated_by: admin.id },
      { onConflict: "key,locale" },
    );
}

/**
 * Store details and contact numbers. Entering a number here is the owner
 * supplying it; nothing is published until saved. Address and hours carry
 * their own "confirmed" ticks, which are what remove the website's
 * "awaiting confirmation" notice.
 */
export async function saveBusiness(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const whatsapp = toE164(text(formData, "whatsapp"));
  const phone = toE164(text(formData, "phone"));
  const errors: Record<string, string> = {};
  if (whatsapp === "invalid")
    errors.whatsapp = "Enter a full mobile number, e.g. +91 98765 43210.";
  if (phone === "invalid")
    errors.phone = "Enter a full phone number, e.g. +91 98765 43210.";

  let hours: unknown = [];
  try {
    hours = JSON.parse(text(formData, "hours") || "[]");
  } catch {
    errors.hours = "Opening hours are malformed.";
  }

  const candidate = {
    addressLines: text(formData, "addressLines")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean),
    postalCode: text(formData, "postalCode"),
    addressVerified: formData.get("addressVerified") === "on",
    hours,
    hoursVerified: formData.get("hoursVerified") === "on",
    whatsappNumberE164: whatsapp === "invalid" ? null : whatsapp,
    phone: phone === "invalid" ? null : phone,
    email: text(formData, "email") || null,
  };
  const parsed = storedBusinessSchema.safeParse(candidate);
  if (!parsed.success || Object.keys(errors).length) {
    return {
      status: "error",
      message: "Some fields need attention.",
      errors: {
        ...(parsed.success ? {} : fieldErrors(parsed.error)),
        ...errors,
      },
    };
  }

  const { error } = await upsert(
    "business",
    "en",
    parsed.data as unknown as Json,
  );
  if (error)
    return { status: "error", message: "The details could not be saved." };
  updateTag(CACHE_TAGS.content);
  return {
    status: "success",
    message: "Store details saved. The website is updated.",
  };
}

const localeSchema = z.enum(["en", "gu"]);

export async function saveAnnouncement(
  locale: "en" | "gu",
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const loc = localeSchema.parse(locale);
  const parsed = announcementSchema.safeParse({
    enabled: formData.get("enabled") === "on",
    text: text(formData, "text"),
    href: text(formData, "href") || null,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Some fields need attention.",
      errors: fieldErrors(parsed.error),
    };
  }
  if (parsed.data.enabled && !parsed.data.text) {
    return {
      status: "error",
      message: "Some fields need attention.",
      errors: { text: "Write the announcement, or switch it off." },
    };
  }
  const { error } = await upsert(
    "announcement",
    loc,
    parsed.data as unknown as Json,
  );
  if (error)
    return { status: "error", message: "The announcement could not be saved." };
  updateTag(CACHE_TAGS.content);
  return {
    status: "success",
    message: parsed.data.enabled
      ? "Announcement is live."
      : "Announcement saved (off).",
  };
}
