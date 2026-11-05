import { z } from "zod";

/**
 * Validation for the PUBLIC inquiry and service-request forms. Error values
 * are message keys (inquiryForm.errors.*), so the form can show them in the
 * visitor's language.
 */

/** Keeps digits and a leading +; rejects anything that is not a phone number. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s().-]/g, ""))
  .pipe(z.string().regex(/^\+?\d{10,15}$/, "phone"));

export const submissionSchema = z.object({
  name: z.string().trim().min(1, "name").max(120, "name"),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .max(254, "email")
    .transform((v) => (v === "" ? null : v))
    .pipe(z.email("email").nullable()),
  message: z.string().trim().min(10, "message").max(2000, "message"),
  locale: z.enum(["en", "gu"]),
});

export type SubmissionErrorKey =
  "name" | "phone" | "email" | "message" | "failed";

export type SubmissionState = {
  status: "idle" | "error" | "success";
  errors?: Partial<
    Record<"name" | "phone" | "email" | "message", SubmissionErrorKey>
  >;
  formError?: SubmissionErrorKey;
};

/**
 * Spam traps without third-party scripts: a hidden field a person never
 * fills, and a minimum time between rendering the form and submitting it.
 */
export const MIN_FILL_MS = 2500;

export function looksAutomated(
  honeypot: string,
  startedAt: number,
  now: number,
) {
  return (
    honeypot.trim() !== "" ||
    !Number.isFinite(startedAt) ||
    now - startedAt < MIN_FILL_MS
  );
}
