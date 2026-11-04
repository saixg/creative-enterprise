"use server";

import { z } from "zod";
import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdmin } from "@/lib/auth/admin";

export type SignInState = { error: "invalid" | "not_admin" | null };

const credentials = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
});

/**
 * Admin sign-in.
 *
 * Validates input on the server, signs in with Supabase Auth, then confirms
 * the account is actually an admin. A valid account that is NOT an admin is
 * signed straight back out, so a stray account can never hold a session here.
 *
 * Error messages never say which of email or password was wrong.
 */
export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "invalid" };

  const admin = await getAdmin();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "not_admin" };
  }

  const locale = await getLocale();
  redirect({ href: "/admin", locale });
  return { error: null };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect({ href: "/admin/login", locale });
}
