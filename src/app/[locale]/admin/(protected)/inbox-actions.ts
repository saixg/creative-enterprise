"use server";

import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/features/admin/schemas";

const inquiryUpdate = z.object({
  id: z.uuid(),
  status: z.enum(["new", "in_progress", "answered", "closed"]),
  notes: z.string().trim().max(4000),
});

const requestUpdate = z.object({
  id: z.uuid(),
  status: z.enum([
    "new",
    "acknowledged",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  notes: z.string().trim().max(4000),
});

/**
 * Update an inquiry's or a service request's status and private notes.
 * Notes are admin-only: RLS gives visitors no read access to either table.
 */
export async function updateInboxItem(
  kind: "inquiries" | "requests",
  values: { id: string; status: string; notes: string },
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  if (kind === "inquiries") {
    const parsed = inquiryUpdate.safeParse(values);
    if (!parsed.success)
      return { status: "error", message: "That update is not valid." };
    const { error } = await supabase
      .from("inquiries")
      .update({
        status: parsed.data.status,
        admin_notes: parsed.data.notes || null,
      })
      .eq("id", parsed.data.id);
    if (error)
      return { status: "error", message: "The inquiry could not be updated." };
  } else {
    const parsed = requestUpdate.safeParse(values);
    if (!parsed.success)
      return { status: "error", message: "That update is not valid." };
    const { error } = await supabase
      .from("service_requests")
      .update({
        status: parsed.data.status,
        admin_notes: parsed.data.notes || null,
      })
      .eq("id", parsed.data.id);
    if (error)
      return { status: "error", message: "The request could not be updated." };
  }
  return { status: "success", message: "Saved." };
}
