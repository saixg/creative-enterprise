# CREATIVE ENTERPRISE — Architecture

**Status:** Foundation. The application structure below is being built now; the data
model is **designed and documented, not yet migrated**.

See `docs/project-brief/02-DESIGN-AND-TECHNICAL-SPECIFICATION.md` for the full
engineering direction and `docs/DECISIONS.md` for owner decisions that override it.

---

## 1. Shape of the system

One Next.js application. Two roles. One backend. One data layer.

```
                    ┌─────────────────────────────────────┐
   public visitor → │  /[locale]/(customer)/…             │
                    │    landing, products, services,     │
                    │    contact, inquiry + request forms │
                    ├─────────────────────────────────────┤
   admin sign-in  → │  /[locale]/admin/…                  │
                    │    dashboard, products, services,   │
                    │    inquiries, content, campaigns    │
                    └──────────────┬──────────────────────┘
                                   │  shared server code
                    ┌──────────────┴──────────────────────┐
                    │  features/  — domain logic          │
                    │  lib/       — db, auth, validation  │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │  Supabase: Postgres + Auth +        │
                    │  Storage, with RLS                  │
                    └──────────────┬──────────────────────┘
                                   │  (later milestone)
                    ┌──────────────┴──────────────────────┐
                    │  WhatsApp Cloud API                 │
                    │  outbound campaigns + inbound hook  │
                    └─────────────────────────────────────┘
```

The admin area is a route group inside this application, not a separate app. Every
privileged operation is checked on the server **and** constrained by a database
policy; hiding navigation is not access control.

## 2. Directory layout

```
src/
  app/
    [locale]/
      (customer)/        landing, products, services, contact
      admin/             protected; reserved now, built later
      layout.tsx         locale + theme shell
    api/                 route handlers (WhatsApp webhook later)
  components/
    ui/                  shadcn primitives, customised
    marketing/           landing + section blocks
    products/  services/  admin/
  features/
    products/ inquiries/ service-requests/ content/ whatsapp/
  lib/                   db client, auth guards, validation, utils
  types/                 shared domain types
  i18n/                  routing config + en/gu message dictionaries
supabase/
  migrations/            (empty until the backend milestone)
  seed/                  placeholder data, explicitly flagged
docs/
public/
```

**Why `[locale]` exists from day one:** retrofitting locale-prefixed routing onto an
established route tree touches every link, redirect and middleware rule. Adding it
at scaffold time costs nothing.

**Why `features/` is separate from `components/`:** components render, features
decide. Keeping domain logic out of the component tree is what lets the same product
logic serve a customer page and an admin table without duplication — which is the
practical meaning of "one shared business data layer".

## 3. Routing

| Route                       | Audience   | Notes                                         |
| --------------------------- | ---------- | --------------------------------------------- |
| `/[locale]`                 | public     | Landing page — theme `landing` (light)        |
| `/[locale]/products`        | public     | Catalogue — theme `app` (dark)                |
| `/[locale]/products/[slug]` | public     | Product detail + inquiry action               |
| `/[locale]/services`        | public     | Services index — equal prominence to products |
| `/[locale]/services/[slug]` | public     | Service detail + request form                 |
| `/[locale]/contact`         | public     | Store information and contact                 |
| `/[locale]/admin/login`     | public     | Admin sign-in                                 |
| `/[locale]/admin/**`        | admin only | Protected; server-checked on every request    |
| `/api/whatsapp/webhook`     | Meta       | Signature-verified inbound handler (later)    |

Locales: `en` (default) and `gu`.

## 4. Data model

Designed from the confirmed workflows in doc 01. **Not yet migrated** — tables are
created in the backend milestone, via migrations in `supabase/migrations/`.

Scope note: this is the MVP subset of doc 02 §14. Campaign, consent and messaging
tables are listed in §4.3 and arrive with the automation milestone, so the schema
does not get built ahead of the workflows that justify it.

### 4.1 Catalogue

**`brands`** — `id`, `slug`, `name`, `logo_url?`, `created_at`
**`categories`** — `id`, `slug`, `name_en`, `name_gu`, `parent_id? → categories`, `sort_order`
**`products`**

- `id`, `slug`, `brand_id? → brands`, `category_id → categories`
- `name`, `short_description_en/gu`, `description_en/gu`
- `specs` (jsonb — label/value pairs, verified only)
- `price_inr?` (integer **paise**, nullable), `price_is_verified` (bool)
- `availability` (enum: `in_stock` / `on_order` / `unavailable` / `unknown`)
- `is_featured`, `status` (enum: `draft` / `published`), `published_at?`
- `is_placeholder` (bool) — see §4.4
- `created_at`, `updated_at`

**`product_media`** — `id`, `product_id → products`, `storage_path`, `kind`
(`image` / `video`), `alt_en/gu`, `sort_order`, `is_primary`

Money is stored as an **integer in paise**, never a float. `price_inr` is nullable
and paired with `price_is_verified` because doc 03 forbids presenting an unverified
price as fact — a null price renders "Price on request", not a guess.

### 4.2 Services, inquiries and content

**`services`** — `id`, `slug`, `name_en/gu`, `summary_en/gu`, `body_en/gu`,
`icon`, `sort_order`, `status`, `is_placeholder`
Deliberately **no** price, warranty or turnaround columns yet: none are confirmed
(doc 01 §2.2), and absent columns cannot be filled with invented values.

**`contacts`** — `id`, `name`, `phone_e164`, `email?`, `preferred_locale`,
`created_at`. One row per person who ever contacts the business; reused by
inquiries, service requests and (later) campaigns.

**`inquiries`** — `id`, `contact_id → contacts`, `product_id? → products`,
`message`, `source` (enum: `web_form` / `whatsapp` / `phone`),
`status` (enum: `new` / `in_progress` / `answered` / `closed`),
`assigned_note?`, `created_at`, `updated_at`

**`service_requests`** — `id`, `contact_id → contacts`, `service_id → services`,
`description`, `preferred_contact_method`,
`status` (enum: `new` / `acknowledged` / `in_progress` / `completed` / `cancelled`),
`admin_notes?`, `created_at`, `updated_at`

**`site_content`** — `id`, `key`, `locale`, `value` (jsonb), `updated_by`,
`updated_at`. Backs editable homepage copy, banners and store details so the admin
can change them without a code deploy.

**`profiles`** — `id → auth.users`, `role` (enum: `admin`), `full_name`,
`created_at`. Role lives here, never in client-writable metadata, so a user cannot
self-assign `admin`.

### 4.3 Automation (later milestone, listed for completeness)

`campaigns`, `campaign_recipients`, `consent_records`, `message_templates`,
`conversations`, `messages`, `audit_logs`.

`consent_records` is the gate described in
`docs/project-brief/01-PRODUCT-VISION.md` §5.2: consent with its source and
timestamp, marketing eligibility and opt-out suppression. A contact row existing is
never sufficient to message that person.

### 4.4 Placeholder data

Any row not confirmed by the owner carries `is_placeholder = true`. The UI must make
placeholder content visibly distinguishable, and placeholder prices must never be
presented to a customer as current pricing. Current placeholders: the four laptops
and prices taken from the image-2 reference (`docs/DECISIONS.md` D-003).

## 5. Access and RLS posture

| Table                                               | Public (anon)                     | Admin    |
| --------------------------------------------------- | --------------------------------- | -------- |
| `products`, `product_media`, `brands`, `categories` | read where `status = 'published'` | full     |
| `services`                                          | read where `status = 'published'` | full     |
| `site_content`                                      | read                              | full     |
| `inquiries`, `service_requests`                     | **insert only**, no read          | full     |
| `contacts`                                          | no direct access                  | full     |
| `profiles`                                          | none                              | read own |

The insert-only posture on inquiries and service requests is the important one: a
public visitor can submit a request but can never read anyone's submissions,
including their own. There is no customer login (D-006), so there is no session to
scope a read to, and an unscoped read would expose every customer's details.

Server-side validation with Zod runs on every write regardless of policy — RLS is
the backstop, not the only check.

## 6. Theming

One semantic token contract, two value sets, selected by `data-theme`:
`landing` (light, image 1) and `app` (dark, image 2). Components use semantic tokens
only. See `docs/DECISIONS.md` D-005.

## 7. Failure isolation

Publishing a product and promoting it over WhatsApp are **separate operations with
separate failure states**. A WhatsApp outage, an unapproved template or a rejected
send must never prevent or roll back publication. Campaign status is surfaced on its
own, with its own errors and retries.

## 8. Build order

1. Scaffold, tokens, shared components ← _current_
2. Landing page (image 1)
3. Products and services pages (image 2)
4. Supabase provisioning, migrations, RLS
5. Admin auth and protected routes
6. Admin product/content management and publishing
7. Inquiries and service requests end to end
8. WhatsApp Cloud API, consent, campaigns
9. Automation, escalation, analytics

This follows doc 02 §18, which puts the database after the customer-facing site and
design system are stable.
