"use server";

import { z } from "zod";

import { createPublicClient } from "@/lib/supabase/public";
import {
  looksAutomated,
  submissionSchema,
  type SubmissionState,
} from "@/features/inquiries/schema";

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value : "";
};

const uuid = z.uuid();

function parse(formData: FormData) {
  return submissionSchema.safeParse({
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    message: text(formData, "message"),
    locale: text(formData, "locale"),
  });
}

function errorsOf(error: z.ZodError): SubmissionState {
  const errors: NonNullable<SubmissionState["errors"]> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      field === "name" ||
      field === "phone" ||
      field === "email" ||
      field === "message"
    ) {
      errors[field] ??= field;
    }
  }
  return { status: "error", errors };
}

/**
 * Store a visitor's submission. Runs as `anon`: RLS lets visitors INSERT a
 * fresh row (status 'new', no admin notes) and never read any back, so even
 * this request cannot see what it wrote. Column grants restrict which fields
 * a visitor may set at all (initial_schema.sql).
 *
 * A bot trip returns "success" without storing anything, so the trap is not
 * revealed.
 */
async function submit(
  kind: "inquiry" | "service_request",
  targetId: string | null,
  formData: FormData,
): Promise<SubmissionState> {
  if (
    looksAutomated(
      text(formData, "company"),
      Number(text(formData, "startedAt")),
      Date.now(),
    )
  ) {
    return { status: "success" };
  }

  const parsed = parse(formData);
  if (!parsed.success) return errorsOf(parsed.error);
  const v = parsed.data;
  const target = targetId && uuid.safeParse(targetId).success ? targetId : null;

  const supabase = createPublicClient();
  const { error } =
    kind === "inquiry"
      ? await supabase.from("inquiries").insert({
          product_id: target,
          contact_name: v.name,
          phone: v.phone,
          email: v.email,
          message: v.message,
          preferred_locale: v.locale,
          source: "web_form",
        })
      : await supabase.from("service_requests").insert({
          service_id: target,
          contact_name: v.name,
          phone: v.phone,
          email: v.email,
          description: v.message,
          preferred_locale: v.locale,
        });

  if (error) {
    console.error(`${kind} insert failed`, error.code);
    return { status: "error", formError: "failed" };
  }
  return { status: "success" };
}

export async function submitInquiry(
  productId: string | null,
  _previous: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  return submit("inquiry", productId, formData);
}

export async function submitServiceRequest(
  serviceId: string | null,
  _previous: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  return submit("service_request", serviceId, formData);
}
