import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Admin reads. These use the signed-in session client, so RLS shows drafts
 * and inbound messages to admins only; called from pages that render inside
 * the protected layout's <AdminGate>.
 */

export async function listAdminProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, status, is_placeholder, is_featured, is_new, price_paise, price_is_verified, availability, updated_at, brand:brands(name), category:categories(name_en), media:product_media(storage_path, is_primary, width)",
    )
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Products read failed: ${error.message}`);
  return data;
}

export async function getAdminProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, brand:brands(name), media:product_media(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Product read failed: ${error.message}`);
  return data;
}

export async function listCategoriesAndBrands() {
  const supabase = await createClient();
  const [categories, brands] = await Promise.all([
    supabase.from("categories").select("id, name_en").order("sort_order"),
    supabase.from("brands").select("name").order("name"),
  ]);
  if (categories.error || brands.error) {
    throw new Error("Category or brand read failed");
  }
  return {
    categories: categories.data.map((c) => ({ id: c.id, name: c.name_en })),
    brands: brands.data.map((b) => b.name),
  };
}

export async function listAdminServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, name_en, name_gu, status, is_candidate, sort_order, icon, image_path, updated_at",
    )
    .order("sort_order")
    .order("name_en");
  if (error) throw new Error(`Services read failed: ${error.message}`);
  return data;
}

export async function getAdminService(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Service read failed: ${error.message}`);
  return data;
}
