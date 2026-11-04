/**
 * Business facts for Creative Enterprise.
 *
 * Every field carries an explicit `verified` flag. Doc 03 §3 forbids presenting
 * unconfirmed business details as fact, so the UI must check the flag before
 * rendering a value — unverified details render with a visible notice or not at
 * all, never as plain confident copy.
 *
 * The values below were read off the supplied image-1 reference. They have NOT
 * been confirmed by the owner. Set `verified: true` only when the owner has
 * confirmed that specific field.
 */

export type Fact<T> = {
  value: T;
  verified: boolean;
};

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
  hours: unverified([
    { days: "Mon – Sat", opens: "10:00", closes: "20:30" },
    { days: "Sun", opens: "11:00", closes: "18:00" },
  ]),

  /**
   * No phone number, WhatsApp number or email has been supplied by the owner.
   * Do not invent one. Until a real number exists, the WhatsApp action is
   * disabled rather than pointed at a placeholder.
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

/** True when every fact the store strip needs has been confirmed. */
export const storeDetailsVerified =
  businessInfo.addressLines.verified && businessInfo.hours.verified;
