-- Creative Enterprise: initial schema (docs/ARCHITECTURE.md §4, D-018).
--
-- Access model (docs/ARCHITECTURE.md §5):
--   anon / visitors   read published catalogue, services and site content;
--                     may INSERT inquiries and service requests, never read them
--   admin             full access, decided by public.profiles.role = 'admin'
--
-- Security rules applied throughout (Supabase skill checklist):
--   * RLS enabled on every table; no table is reachable without a policy.
--   * The admin check lives in the unexposed `private` schema, so it cannot be
--     called as a public API endpoint, and reads profiles, never user_metadata.
--   * No one can set a role through the API: profiles has no insert/update
--     policy for any client role. Admins are provisioned by SQL (see
--     docs/ADMIN-PROVISIONING.md).
--   * Every UPDATE policy has USING and WITH CHECK, and a matching SELECT.
--   * Visitor inserts are column-restricted, so a visitor cannot set status,
--     notes or timestamps.
--
-- Deliberately absent: contacts (inquiries carry their own contact fields
-- until the campaigns milestone needs a shared contact record), and any
-- price/turnaround/warranty column on services (doc 03 §3).

-- ---------------------------------------------------------------- schemas
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

-- ---------------------------------------------------------------- types
create type public.admin_role as enum ('admin');
create type public.publish_status as enum ('draft', 'published');
create type public.availability as enum ('in_stock', 'on_order', 'unavailable', 'unknown');
create type public.inquiry_status as enum ('new', 'in_progress', 'answered', 'closed');
create type public.inquiry_source as enum ('web_form', 'whatsapp', 'phone');
create type public.service_request_status as enum ('new', 'acknowledged', 'in_progress', 'completed', 'cancelled');
create type public.locale as enum ('en', 'gu');

-- ---------------------------------------------------------------- helpers
create function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- profiles
-- One row per admin. Customers have no accounts (D-006).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.admin_role not null default 'admin',
  full_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Admin check. SECURITY DEFINER so policies on profiles itself do not
-- recurse; safe because it lives in an unexposed schema, takes no input and
-- only ever answers for the calling user.
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

create policy "profiles: read own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

-- ---------------------------------------------------------------- catalogue
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_gu text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand_id uuid references public.brands (id) on delete set null,
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  summary_en text,
  summary_gu text,
  description_en text,
  description_gu text,
  summary_specs text[] not null default '{}',
  specs jsonb not null default '[]'::jsonb,
  -- Integer paise, never float. Null = price on request.
  price_paise integer check (price_paise is null or price_paise >= 0),
  price_is_verified boolean not null default false,
  availability public.availability not null default 'unknown',
  is_new boolean not null default false,
  is_featured boolean not null default false,
  is_placeholder boolean not null default false,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_id_idx on public.products (category_id);
create index products_brand_id_idx on public.products (brand_id);
create index products_status_idx on public.products (status);
create trigger products_set_updated_at before update on public.products
  for each row execute function private.set_updated_at();

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  kind text not null default 'image' check (kind in ('image', 'video')),
  alt_en text,
  alt_gu text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  -- Licence/credit for third-party photos (D-015).
  credit jsonb,
  created_at timestamptz not null default now()
);
create index product_media_product_id_idx on public.product_media (product_id);

-- ---------------------------------------------------------------- services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  key text not null unique,
  name_en text not null,
  name_gu text,
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  is_candidate boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger services_set_updated_at before update on public.services
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------- inbound
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  contact_name text not null check (char_length(contact_name) between 1 and 120),
  phone text not null check (char_length(phone) between 6 and 20),
  email text check (email is null or char_length(email) <= 254),
  message text not null check (char_length(message) between 1 and 2000),
  preferred_locale public.locale not null default 'en',
  source public.inquiry_source not null default 'web_form',
  status public.inquiry_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index inquiries_product_id_idx on public.inquiries (product_id);
create index inquiries_status_created_idx on public.inquiries (status, created_at desc);
create trigger inquiries_set_updated_at before update on public.inquiries
  for each row execute function private.set_updated_at();

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services (id) on delete set null,
  contact_name text not null check (char_length(contact_name) between 1 and 120),
  phone text not null check (char_length(phone) between 6 and 20),
  email text check (email is null or char_length(email) <= 254),
  description text not null check (char_length(description) between 1 and 2000),
  preferred_locale public.locale not null default 'en',
  status public.service_request_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index service_requests_service_id_idx on public.service_requests (service_id);
create index service_requests_status_created_idx on public.service_requests (status, created_at desc);
create trigger service_requests_set_updated_at before update on public.service_requests
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------- content
create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  locale public.locale not null,
  value jsonb not null,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (key, locale)
);
create trigger site_content_set_updated_at before update on public.site_content
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------- RLS
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.services enable row level security;
alter table public.inquiries enable row level security;
alter table public.service_requests enable row level security;
alter table public.site_content enable row level security;

-- Public reads: published content only.
create policy "brands: public read" on public.brands
  for select to anon, authenticated using (true);
create policy "categories: public read" on public.categories
  for select to anon, authenticated using (true);
create policy "products: read published or admin" on public.products
  for select to anon, authenticated
  using (status = 'published' or (select private.is_admin()));
create policy "product_media: read with published product or admin" on public.product_media
  for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );
create policy "services: read published or admin" on public.services
  for select to anon, authenticated
  using (status = 'published' or (select private.is_admin()));
create policy "site_content: public read" on public.site_content
  for select to anon, authenticated using (true);

-- Visitor submissions: insert only, always as 'new'. Never readable by them.
create policy "inquiries: visitors submit" on public.inquiries
  for insert to anon, authenticated
  with check (status = 'new' and admin_notes is null);
create policy "service_requests: visitors submit" on public.service_requests
  for insert to anon, authenticated
  with check (status = 'new' and admin_notes is null);

-- Admin: everything else. Separate policies per command so UPDATE carries
-- both USING and WITH CHECK.
do $$
declare t text;
begin
  foreach t in array array[
    'brands', 'categories', 'products', 'product_media', 'services',
    'inquiries', 'service_requests', 'site_content'
  ] loop
    execute format(
      'create policy "%1$s: admin read" on public.%1$I for select to authenticated using ((select private.is_admin()))', t);
    execute format(
      'create policy "%1$s: admin insert" on public.%1$I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format(
      'create policy "%1$s: admin update" on public.%1$I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format(
      'create policy "%1$s: admin delete" on public.%1$I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------- grants
-- Explicit, so access does not depend on project-level Data API defaults.
-- RLS above still decides which rows each role sees.
revoke all on all tables in schema public from anon, authenticated;

grant select on public.brands, public.categories, public.products,
  public.product_media, public.services, public.site_content
  to anon, authenticated;

-- Visitors may only supply these columns.
grant insert (product_id, contact_name, phone, email, message, preferred_locale, source)
  on public.inquiries to anon, authenticated;
grant insert (service_id, contact_name, phone, email, description, preferred_locale)
  on public.service_requests to anon, authenticated;

-- Authenticated admins: full table privileges, gated row-by-row by RLS.
grant select, insert, update, delete on public.brands, public.categories,
  public.products, public.product_media, public.services, public.inquiries,
  public.service_requests, public.site_content
  to authenticated;
grant select on public.profiles to authenticated;
