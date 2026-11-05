import { z } from "zod";

/**
 * Business facts for Creative Enterprise.
 *
 * Two layers:
 *   1. `businessInfo` below: the code DEFAULTS. Values read off the image-1
 *      reference, every one unverified, and no contact details at all.
 *   2. `site_content` key "business" (edited in /admin/content), which the
 *      owner fills in. `getBusinessInfo()` merges it over the defaults.
 *
 * Every field carries a `verified` flag. Doc 03 §3 forbids presenting
 * unconfirmed business details as fact, so the UI checks the flag before
 * rendering a value: unverified details render with a visible notice or not
 * at all. Only the owner ticking "confirmed" in the admin sets it.
 */

export type Fact<T> = {
  value: T;
  verified: boolean;
};

export type OpeningHours = { days: string; opens: string; closes: string };

const unverified = <T>(value: T): Fact<T> => ({ value, verified: false });

export const businessInfo = {
  legalName: { value: "Creative Enterprise", verified: true },
  city: { value: "Rajkot", verified: true },
  state: { value: "Gujarat", verified: true },

  /** Read from the image-1 reference; awaiting owner confirmation. */
  addressLines: unverified([
    "Shree Guruaksha Complex",
    "Tagore Road, Virani Chowk",
    "Rajkot, Gujarat",
  ]),
  postalCode: unverified("360001"),

  /** Read from the image-1 reference; awaiting owner confirmation. */
  hours: unverified<OpeningHours[]>([
    { days: "Mon - Sat", opens: "10:00", closes: "20:30" },
    { days: "Sun", opens: "11:00", closes: "18:00" },
  ]),

  /**
   * No phone number, WhatsApp number or email has been supplied by the owner.
   * Do not invent one. Until a real number exists, WhatsApp actions are
   * hidden rather than pointed at a placeholder.
   */
  whatsappNumberE164: null as string | null,
  phone: null as string | null,
  email: null as string | null,

  /**
   * The "4.9/5 Customer Satisfaction" figure appears in the image-1 reference
   * with no source. It is a ratings claim, which doc 03 §3 lists explicitly as
   * something never to invent. Not rendered until the owner supplies a source.
   */
  satisfactionRating: unverified(null as number | null),
} as const;

export type BusinessInfo = {
  legalName: Fact<string>;
  city: Fact<string>;
  state: Fact<string>;
  addressLines: Fact<string[]>;
  postalCode: Fact<string>;
  hours: Fact<OpeningHours[]>;
  whatsappNumberE164: string | null;
  phone: string | null;
  email: string | null;
  satisfactionRating: Fact<number | null>;
};

/** True when every fact the store strip needs has been confirmed. */
export const storeDetailsVerified =
  businessInfo.addressLines.verified && businessInfo.hours.verified;

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

/** The JSON stored in site_content (key "business", locale "en"). */
export const storedBusinessSchema = z.object({
  addressLines: z.array(z.string().trim().min(1).max(120)).max(5),
  postalCode: z.string().trim().max(12),
  addressVerified: z.boolean(),
  hours: z
    .array(
      z.object({
        days: z.string().trim().min(1).max(40),
        opens: time,
        closes: time,
      }),
    )
    .max(7),
  hoursVerified: z.boolean(),
  /** E.164, e.g. +919876543210. Entered by the owner; never invented. */
  whatsappNumberE164: z
    .string()
    .regex(/^\+\d{10,15}$/)
    .nullable(),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/)
    .nullable(),
  email: z.email().nullable(),
});

export type StoredBusiness = z.infer<typeof storedBusinessSchema>;

/** Merge the owner's saved details over the code defaults. */
export function mergeBusinessInfo(stored: unknown): BusinessInfo {
  const parsed = storedBusinessSchema.safeParse(stored);
  if (!parsed.success) return businessInfo as unknown as BusinessInfo;
  const s = parsed.data;
  return {
    ...(businessInfo as unknown as BusinessInfo),
    addressLines: { value: s.addressLines, verified: s.addressVerified },
    postalCode: { value: s.postalCode, verified: s.addressVerified },
    hours: { value: s.hours, verified: s.hoursVerified },
    whatsappNumberE164: s.whatsappNumberE164,
    phone: s.phone,
    email: s.email,
  };
}

/** The defaults expressed in the stored shape, to prefill the admin form. */
export function defaultStoredBusiness(): StoredBusiness {
  return {
    addressLines: [...businessInfo.addressLines.value],
    postalCode: businessInfo.postalCode.value,
    addressVerified: false,
    hours: businessInfo.hours.value.map((h) => ({ ...h })),
    hoursVerified: false,
    whatsappNumberE164: null,
    phone: null,
    email: null,
  };
}

export function whatsappLink(
  numberE164: string | null,
  message?: string,
): string | null {
  if (!numberE164) return null;
  const base = `https://wa.me/${numberE164.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
