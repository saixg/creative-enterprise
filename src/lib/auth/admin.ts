import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string | null;
  name: string | null;
};

/**
 * The signed-in admin, or null.
 *
 * Two checks, both server-side:
 *  1. getClaims() verifies the session token. It is never trusted from the
 *     cookie alone, which anyone can forge.
 *  2. The user must have a row in public.profiles with role 'admin'. RLS lets
 *     a user read only their own profile, and no client can write one, so the
 *     role cannot be self-assigned (docs/ADMIN-PROVISIONING.md).
 *
 * Never reads user_metadata: users can edit it themselves.
 */
export async function getAdmin(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", data.claims.sub)
    .maybeSingle();

  if (profile?.role !== "admin") return null;

  return {
    id: data.claims.sub,
    email: typeof data.claims.email === "string" ? data.claims.email : null,
    name: profile.full_name,
  };
}

/**
 * For server actions: the admin, or a thrown error. Every admin mutation
 * calls this first; RLS then enforces the same rule again in the database.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) throw new Error("Not authorised");
  return admin;
}
