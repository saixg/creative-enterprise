import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * The two inboxes share one shape so one set of screens serves both.
 * Reads use the admin's session: visitors can insert rows but RLS gives
 * them no read access at all, so only admins ever see these.
 */
export type InboxKind = "inquiries" | "requests";

export const statusOptions = {
  inquiries: [
    ["new", "New"],
    ["in_progress", "In progress"],
    ["answered", "Answered"],
    ["closed", "Closed"],
  ],
  requests: [
    ["new", "New"],
    ["acknowledged", "Acknowledged"],
    ["in_progress", "In progress"],
    ["completed", "Completed"],
    ["cancelled", "Cancelled"],
  ],
} as const;

export type InboxItem = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  notes: string | null;
  locale: "en" | "gu";
  subject: string | null;
  subjectHref: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export async function listInbox(kind: InboxKind): Promise<InboxItem[]> {
  const supabase = await createClient();
  if (kind === "inquiries") {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*, product:products(id, name)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(`Inquiries read failed: ${error.message}`);
    return data.map((r) => ({
      id: r.id,
      name: r.contact_name,
      phone: r.phone,
      email: r.email,
      message: r.message,
      status: r.status,
      notes: r.admin_notes,
      locale: r.preferred_locale,
      subject: r.product?.name ?? null,
      subjectHref: r.product ? `/admin/products/${r.product.id}` : null,
      source: r.source,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }
  const { data, error } = await supabase
    .from("service_requests")
    .select("*, service:services(id, name_en)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`Requests read failed: ${error.message}`);
  return data.map((r) => ({
    id: r.id,
    name: r.contact_name,
    phone: r.phone,
    email: r.email,
    message: r.description,
    status: r.status,
    notes: r.admin_notes,
    locale: r.preferred_locale,
    subject: r.service?.name_en ?? null,
    subjectHref: r.service ? `/admin/services/${r.service.id}` : null,
    source: "web_form",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}
