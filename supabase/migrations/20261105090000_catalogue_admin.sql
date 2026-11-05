-- Catalogue administration (docs/DECISIONS.md D-019).
--
-- Additive only: new columns, one trigger, one Storage bucket and its
-- policies. Nothing is dropped or rewritten.
--
-- 1. services gains its customer-facing copy (until now it lived in the
--    message catalogues, where the admin could not edit it), an icon and an
--    image. Still no price, turnaround, warranty or guarantee column
--    (doc 03 §3).
-- 2. product_media gains the dimensions next/image needs and the
--    "representative photo" flag D-015 requires the UI to disclose.
-- 3. published_at is stamped by the database, not trusted from the client.
-- 4. A public `media` bucket for admin uploads. Public means anyone can
--    DOWNLOAD a file by its URL; only admins can upload, replace or delete,
--    and nobody but an admin can LIST the bucket.

-- ---------------------------------------------------------------- services
alter table public.services
  add column summary_en text check (summary_en is null or char_length(summary_en) <= 400),
  add column summary_gu text check (summary_gu is null or char_length(summary_gu) <= 400),
  add column problem_en text check (problem_en is null or char_length(problem_en) <= 600),
  add column problem_gu text check (problem_gu is null or char_length(problem_gu) <= 600),
  add column covers_en text[] not null default '{}',
  add column covers_gu text[] not null default '{}',
  add column signs_en text[] not null default '{}',
  add column signs_gu text[] not null default '{}',
  add column icon text not null default 'repair'
    check (icon in ('repair', 'screen', 'upgrades', 'software', 'cctv', 'printer', 'amc', 'network', 'support')),
  -- A path under /public (leading "/") or an object key in the media bucket.
  add column image_path text,
  -- True when the image is a photo (cover) rather than a cut-out (contain).
  add column image_is_photo boolean not null default false,
  add column published_at timestamptz;

create index services_status_idx on public.services (status);

-- ---------------------------------------------------------------- media
alter table public.product_media
  add column width integer check (width is null or width > 0),
  add column height integer check (height is null or height > 0),
  -- The photo shows the product line or an equivalent, not this exact unit.
  add column is_representative boolean not null default false;

-- At most one primary image per product.
create unique index product_media_one_primary_idx
  on public.product_media (product_id) where is_primary;

-- ---------------------------------------------------------------- publish stamp
create function private.stamp_published_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.published_at := now();
  elsif new.status = 'draft' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

create trigger products_stamp_published_at before insert or update of status on public.products
  for each row execute function private.stamp_published_at();
create trigger services_stamp_published_at before insert or update of status on public.services
  for each row execute function private.stamp_published_at();

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

-- No public SELECT policy: a public bucket already serves files by URL, and a
-- SELECT policy for anon would also let anyone list every object.
create policy "media: admin read" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "media: admin upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "media: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin()))
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "media: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
