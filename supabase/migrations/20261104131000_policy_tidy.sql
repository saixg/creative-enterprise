-- Follow-up to initial_schema, from the Supabase performance advisor.
--
-- 1. Index the site_content.updated_by foreign key.
-- 2. Remove redundant "admin read" policies where the public read policy
--    already covers admins (it either allows everyone, or already ORs in
--    private.is_admin()). Two permissive SELECT policies cost two evaluations
--    per row for the same answer.
-- 3. Merge the visitor and admin INSERT policies on the inbound tables into
--    one: admins may insert anything; everyone else only a fresh submission.
--
-- Access is unchanged; this only removes overlap. Verified by the RLS checks
-- recorded in docs/ADMIN-PROVISIONING.md.

create index site_content_updated_by_idx on public.site_content (updated_by);

drop policy "brands: admin read" on public.brands;
drop policy "categories: admin read" on public.categories;
drop policy "site_content: admin read" on public.site_content;
drop policy "products: admin read" on public.products;
drop policy "services: admin read" on public.services;
drop policy "product_media: admin read" on public.product_media;

drop policy "inquiries: visitors submit" on public.inquiries;
drop policy "inquiries: admin insert" on public.inquiries;
create policy "inquiries: submit" on public.inquiries
  for insert to anon, authenticated
  with check (
    (select private.is_admin())
    or (status = 'new' and admin_notes is null)
  );

drop policy "service_requests: visitors submit" on public.service_requests;
drop policy "service_requests: admin insert" on public.service_requests;
create policy "service_requests: submit" on public.service_requests
  for insert to anon, authenticated
  with check (
    (select private.is_admin())
    or (status = 'new' and admin_notes is null)
  );
