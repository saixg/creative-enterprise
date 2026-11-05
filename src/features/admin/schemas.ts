import { z } from "zod";

import { serviceIconKeys } from "@/lib/services-map";

/**
 * Server-side validation for every admin write. RLS decides WHO may write;
 * these decide WHAT may be written. Runs on the server regardless of any
 * client-side checks (docs/ARCHITECTURE.md §5).
 */

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "HP Victus 15 (2024)" -> "hp-victus-15-2024" */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .transform((v) => (v === "" ? null : v));

/** One item per line; blank lines dropped. */
export const lines = (maxItems: number, maxLength: number) =>
  z
    .string()
    .transform((v) =>
      v
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(
          z
            .string()
            .max(maxLength, `Keep each line under ${maxLength} characters.`),
        )
        .max(maxItems, `Use at most ${maxItems} lines.`),
    );

const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.null(), z.undefined()])
  .transform((v) => v === "on" || v === "true");

/**
 * Rupees as typed by a person ("65,990" or "65990.50") -> integer paise.
 * Empty means "price on request" (null), never zero.
 */
export const rupeesToPaise = z
  .string()
  .trim()
  .transform((v, ctx) => {
    if (v === "") return null;
    const cleaned = v.replace(/[,\s₹]/g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
      ctx.addIssue({ code: "custom", message: "Enter an amount like 65990." });
      return z.NEVER;
    }
    const paise = Math.round(Number(cleaned) * 100);
    if (paise > 2_000_000_000) {
      ctx.addIssue({ code: "custom", message: "That amount is too large." });
      return z.NEVER;
    }
    return paise;
  });

export const specSchema = z.object({
  label: z.string().trim().min(1).max(60),
  value: z.string().trim().min(1).max(200),
});

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Give the product a name.").max(160),
    slug: z.string().trim().max(80),
    brand: z.string().trim().max(60),
    categoryId: z.uuid("Choose a category."),
    summaryEn: optionalText(300),
    summaryGu: optionalText(300),
    descriptionEn: optionalText(4000),
    descriptionGu: optionalText(4000),
    summarySpecs: lines(6, 40),
    specs: z
      .string()
      .transform((v, ctx) => {
        try {
          return JSON.parse(v || "[]") as unknown;
        } catch {
          ctx.addIssue({
            code: "custom",
            message: "Specifications are malformed.",
          });
          return z.NEVER;
        }
      })
      .pipe(z.array(specSchema).max(40)),
    price: rupeesToPaise,
    priceIsVerified: checkbox,
    availability: z.enum(["in_stock", "on_order", "unavailable", "unknown"]),
    isNew: checkbox,
    isFeatured: checkbox,
    isPlaceholder: checkbox,
    intent: z.enum(["save", "publish", "unpublish"]),
  })
  .transform((v) => ({ ...v, slug: v.slug ? v.slug : slugify(v.name) }))
  .superRefine((v, ctx) => {
    if (!SLUG_PATTERN.test(v.slug)) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Use lowercase letters, numbers and hyphens only.",
      });
    }
    // A verified price needs a price (doc 03 §3: never imply a verified
    // figure that does not exist).
    if (v.priceIsVerified && v.price === null) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Enter the price, or untick “Price is confirmed”.",
      });
    }
  });

export type ProductInput = z.output<typeof productSchema>;

export const serviceSchema = z
  .object({
    nameEn: z.string().trim().min(2, "Give the service a name.").max(120),
    nameGu: optionalText(120),
    slug: z.string().trim().max(80),
    icon: z.enum(serviceIconKeys),
    summaryEn: optionalText(400),
    summaryGu: optionalText(400),
    problemEn: optionalText(600),
    problemGu: optionalText(600),
    coversEn: lines(10, 120),
    coversGu: lines(10, 120),
    signsEn: lines(10, 120),
    signsGu: lines(10, 120),
    sortOrder: z.coerce.number().int().min(0).max(999),
    imageIsPhoto: checkbox,
    isConfirmed: checkbox,
    intent: z.enum(["save", "publish", "unpublish"]),
  })
  .transform((v) => ({ ...v, slug: v.slug ? v.slug : slugify(v.nameEn) }))
  .superRefine((v, ctx) => {
    if (!SLUG_PATTERN.test(v.slug)) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Use lowercase letters, numbers and hyphens only.",
      });
    }
  });

export type ServiceInput = z.output<typeof serviceSchema>;

/**
 * What a save does to publication. "save" keeps the current status (a new
 * record starts as a draft), so editing a live product never silently
 * unpublishes it.
 */
export function resolveStatus(
  intent: "save" | "publish" | "unpublish",
  current: "draft" | "published" | null,
): "draft" | "published" {
  if (intent === "publish") return "published";
  if (intent === "unpublish") return "draft";
  return current ?? "draft";
}

export type FieldErrors = Partial<Record<string, string>>;

/** First message per field, keyed by top-level field name. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: FieldErrors;
};

export const idle: ActionState = { status: "idle" };
