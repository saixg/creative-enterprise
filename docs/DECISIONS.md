# CREATIVE ENTERPRISE — Decision Record

**Purpose:** A durable record of product and design decisions made by the owner,
especially where a decision overrides something written in the project briefs.

`docs/project-brief/` remains the source of truth for everything this file does not
explicitly override. Where this file overrides a brief, **this file wins** and the
brief carries a pointer to the relevant decision.

Per `03-CLAUDE-WORKING-RULES.md` §15, requirements are never silently rewritten to
match an implementation. Each entry below records what was decided, when, why, and
what it changes.

---

## D-001 — Image 1 is the landing page; image 2 is the inside pages

**Date:** 2026-11-04
**Status:** Confirmed
**Overrides:** nothing

Two visual references were supplied. They are both approved, for different parts of
the site:

- **Image 1** — light, premium hero with the owner portrait, bilingual switcher,
  service icon row and local store strip → the **landing page**.
- **Image 2** — dark catalogue layout with category tiles, product cards and
  WhatsApp quote actions → the **inside pages** (products, services and other
  interior routes).

**Reason:** The landing page carries the first impression and should showcase design
quality; the interior pages are working surfaces for browsing and enquiring.

---

## D-002 — The visual reference governs over the written "avoid" list

**Date:** 2026-11-04
**Status:** Confirmed
**Overrides:** `02-DESIGN-AND-TECHNICAL-SPECIFICATION.md` §4 ("Avoid")

Doc 02 §4 instructs avoiding decorative glow around the owner portrait, excessive
glow and glassmorphism. The approved image 1 uses glow framing on the owner and on
the floating product cluster.

**Decision:** Where the approved reference and the written avoid-list disagree, the
**reference governs**. The glow and depth treatments visible in the references are
permitted.

**Reason:** The references are the approved visual target; the avoid-list was
written as general guidance before they existed.

**Constraint retained:** This permits the treatments _as composed in the
references_. It is not licence for unbounded glow, gradients or glassmorphism
elsewhere. Glow is implemented as a small set of reusable token-driven utilities, not
invented per component. Everything else in doc 02 §4 — no unrelated logo-like
symbols, no random floating UI panels, no generic template layouts, no animation
that competes with the message — still applies.

---

## D-003 — Image 2's prices are placeholders, used as-is for now

**Date:** 2026-11-04
**Status:** Confirmed — temporary
**Overrides:** nothing (operates within `03-CLAUDE-WORKING-RULES.md` §3)

The product names, specifications and prices shown in image 2 (HP Victus 15
₹65,990; Lenovo IdeaPad Slim 5 ₹58,990; ASUS TUF Gaming A15 ₹1,04,990; Apple
MacBook Air M3 ₹1,14,900) are used as **placeholder seed data** until the owner
supplies verified catalogue data.

**Required handling:** Every placeholder record carries an explicit
`isPlaceholder: true` flag in the seed file, so it can never be mistaken for
owner-verified data. These values must not be presented to a customer as current
pricing before the owner confirms them.

---

## D-004 — Catalogue extras: partly reinstated

**Date:** 2026-11-04 (revised the same day)
**Status:** Partly superseded by D-011
**Overrides:** nothing

Image 2 shows global search (⌘K), a wishlist control, a compare control and product
carousels. None of these appear in the project briefs, and a wishlist is
e-commerce-shaped against an explicitly inquiry-first scope.

**Original decision:** all deferred.

**Revised:** the master design brief reinstated several of them. Brands, Offers
and New Arrivals are now in scope — see **D-011**. Global search, the wishlist
and the compare control remain deferred.

---

## D-005 — Two themes: light landing, dark inside pages

**Date:** 2026-11-04
**Status:** Confirmed
**Overrides:** `02-DESIGN-AND-TECHNICAL-SPECIFICATION.md` §2 (visual direction)

Doc 02 §2 specifies "a mostly neutral light interface with controlled blue accents"
and dark sections used selectively.

**Decision:** The application has **two theme value sets**:

- `landing` — the light premium treatment from image 1, used on the landing page.
- `app` — the dark treatment from image 2, used on interior pages.

**Reason:** The landing page is a showcase surface; interior pages are browsing
surfaces where the dark catalogue treatment reads better.

**Implementation constraint:** This is **one semantic token contract with two value
sets**, selected by a `data-theme` attribute — never two parallel sets of
components. Components reference semantic tokens only (`background`, `foreground`,
`surface`, `primary`, `muted`, `border`, …); no raw colour values in component code.
Concrete values for both sets live in the theme stylesheet and are the
implementation of this decision.

---

## D-006 — No customer authentication

**Date:** 2026-11-04
**Status:** Confirmed
**Overrides:** nothing — settles the open question in `01-PRODUCT-VISION.md` §3.1

No customer accounts, no customer sign-in, no customer dashboard, no order history.
The `customer` role means the public visitor. Admin authentication is unaffected and
still required.

---

## D-007 — The five-day demonstration timeline is dropped

**Date:** 2026-11-04
**Status:** Confirmed
**Overrides:** `01-PRODUCT-VISION.md` §9

The five-day client demonstration sequence is no longer a target. Work proceeds by
milestone, without a calendar deadline.

**Reason:** Owner direction — work starts immediately and is paced by readiness
rather than by a demo date. The _content_ of doc 01 §9 (what gets demonstrated)
remains a useful ordering; only the five-day deadline is withdrawn.

---

## D-008 — Real design assets will be supplied by the owner

**Date:** 2026-11-04
**Status:** Pending delivery
**Overrides:** nothing

The owner holds and will supply the original owner photograph, the logo artwork and
product imagery.

**Until they arrive:** use clearly-marked placeholders. Per doc 02 §4 and doc 03 §9,
the real owner's likeness must be preserved — no generated person, no material
alteration of identity, and no reconstructing assets from the reference screenshots
and presenting them as final artwork.

---

## D-009 — One homepage: light hero into dark catalogue

**Date:** 2026-11-04
**Status:** Confirmed
**Supersedes:** part of D-001 and D-005

The master design brief requires one coherent homepage rather than two separate
designs. The homepage now carries both references:

- **Upper** — reference 02 (owner hero), light `landing` theme. The primary
  brand and identity direction.
- **Lower** — reference 01 (product storefront), dark `app` theme. The product
  discovery, catalogue and promotional direction.

The transition between them must read as one art-directed page, not two
templates stitched together.

**Interior pages are unchanged:** `/products` and other interior routes keep the
dark `app` theme. D-005's token contract is untouched — this decision changes
only _where_ each value set is applied, never how theming works. Theme scoping
therefore moves from the route-group layout down to the section level on the
homepage.

---

## D-010 — D-002 reaffirmed: the reference still governs

**Date:** 2026-11-04
**Status:** Confirmed
**Overrides:** the master brief's restatement of doc 02 §4

The master design brief restated doc 02's avoid-list, including "do not add
decorative glowing rings around the owner". That conflicts with D-002, where the
owner decided the approved reference governs.

**Decision: D-002 stands.** The glow and glass treatments visible in the
references are permitted, including around the hero composition, implemented as
reusable token-driven utilities rather than invented per component.

The parts of the avoid-list that do not conflict with the references still
apply: no unrelated logo-like symbols, no random floating blobs or circles, no
generic template layouts, no animation competing with the message.

---

## D-011 — Brands, Offers and New Arrivals are in scope

**Date:** 2026-11-04
**Status:** Confirmed — Offers and Brands need owner content
**Revises:** D-004

Navigation and homepage sections for **Brands**, **Offers** and **New Arrivals**
are in scope.

**Content gaps that must not be invented:**

- **Offers** — no promotion, discount or campaign has been supplied. The section
  renders an honest empty state until the owner provides real offers. Doc 03 §3
  lists discounts as something never to invent.
- **Brands** — only the four brand names attached to placeholder products exist
  (HP, Lenovo, ASUS, Apple). No authorised-dealer, partnership or reseller claim
  may be made, since none has been confirmed.

Global search and the wishlist remain deferred.

---

## D-012 — Owner portrait cropped from the reference

**Date:** 2026-11-04
**Status:** Interim — the original file is still wanted
**Relates to:** D-008

No standalone photograph of the owner has been supplied. The owner's likeness
exists only inside `design-references/reference-02-owner-hero.jpg` (1600×900).

**Decision:** crop the real person from that reference and use it as the hero
portrait. This preserves the actual owner's likeness, which doc 02 §4 and doc 03
§9 require, and avoids substituting a generated person.

**Constraints:** the crop is low resolution and is recorded as such in
`docs/KNOWN-ISSUES.md`. Identity, body and clothing must not be altered. The
original photograph is still needed before production.

Product photography and the logo artwork remain unavailable and stay as
clearly-marked placeholders.

---

## D-013 — Hero rebuilt to the reference, using its own assets

**Date:** 2026-11-04
**Status:** Confirmed — assets interim
**Relates to:** D-008, D-012
**Prompted by:** owner feedback that the first homepage build was "very bad"
and should recreate reference 02 "with more quality and design authority".

**What went wrong before.** The first build treated every missing asset as a
labelled placeholder: a framed photo instead of a cut-out owner, blank tiles
instead of product renders, a flat white field instead of the lavender-blue
lighting, a medium-weight headline instead of a heavy display italic. Each
choice was defensible; together they produced a page that looked nothing like
the approved design.

**Decision.** Rebuild the hero as a faithful reconstruction of reference 02,
and cut the missing visuals out of the approved references themselves:

- the owner (real person, background removed — extends D-012)
- the laptop, gaming desktop, CCTV camera, printer and tools renders
- the two entry-card photos
- the Rajkot landmark illustration
- the "C" logo mark, from `reference-03-brand-logo.jpg`

Background removal uses `rembg` with the `isnet-general-use` model, run
locally. The full pipeline and every crop box live in
`scripts/reference-assets/` so each asset's provenance is auditable and
reproducible.

**Typeface** changes from Inter to Plus Jakarta Sans for the whole site. The
reference headline is a heavy geometric italic that Inter cannot reproduce. Doc
02 §3 lists both as approved.

**Constraints that still hold:**

- These are **interim** assets cut from a 1600×900 reference; they are soft at
  large sizes. Original photography and an approved SVG logo are still needed.
- The logo mark is a raster cut from an _exploration_. Doc 02 §9 says an
  exploration must not become the final logo — it is used here as an interim
  stand-in only.
- Unverified facts in the reference are still not published as fact: the store
  address and hours carry an explicit marker, and the "4.9/5" rating and the
  "RAJ Code" postal badge are still omitted.

---

## D-014 — Depth motion without WebGL; catalogue structure with empty states

**Date:** 2026-11-04
**Status:** Confirmed

**3D.** The owner asked for "3D motions". Chosen interpretation: _depth
motion_ — CSS perspective driven by `motion/react`: cards and panels that tilt
toward the pointer, layered parallax in the hero, product media that turns in
3D space on hover. **No WebGL / Three.js** in this phase: there are no GLB
assets, and a procedurally modelled product would not be the owner's actual
stock (doc 02 §9). Revisit when real models exist.

Rules: tilt is pointer-only (never on touch, where it would fight scrolling),
capped at a few degrees, spring-damped, and fully disabled under
`prefers-reduced-motion`. Depth never hides or delays content.

**Catalogue.** Build the structure — category pages, category and brand
filters, sorting, richer detail pages — over the existing four placeholder
laptops (D-003). **No new products are invented.** Categories with no products
render an honest empty state that says the range is being added and invites an
enquiry.

---

## Still open — require owner input

These are unresolved and must not be filled with plausible-sounding values:

- **Store address, opening hours and the "4.9/5" satisfaction figure** shown in
  image 1 — not yet verified by the owner; cannot be published as fact.
- **Service catalogue** — exact services, pricing, warranty terms, turnaround
  promises and coverage (doc 01 §2.2).
- **Gujarati copy** — requires fluent-speaker review before publication; machine
  translation must not ship (doc 02 §10).
- **Logo** — exploratory concepts exist; no final mark is approved (doc 02 §9).

---

## D-015 — Web product photos; hero redesigned to one job

**Date:** 2026-11-04
**Status:** Confirmed

**Product photos.** The owner asked for web images for the listed products.
Manufacturer press images are copyrighted and normally restricted to
authorised resellers, and no dealer relationship is confirmed (D-011), so the
photos come from **Wikimedia Commons** under licences that allow commercial
use (CC0, CC BY-SA). All four are _representative_ (the product line or an
equivalent model, not the exact unit) and the product page says so, with the
attribution each licence requires. Credits: `docs/ASSET-CREDITS.md`.

**Hero.** The owner rejected the reconstruction of reference 02 as
"disgusting". A design audit (design-taste-frontend skill) found the causes:
every visual a soft fragment of a low-resolution composite, ~14 elements
competing in one screen, glass on everything, and an em-dash/bullet run in the
copy. The hero now does one job: eyebrow, two-line headline, one sentence,
two CTAs, and the owner on a deep-blue brand plate with three labelled product
chips. The capability tiles, entry cards and store band from the reference
moved to the sections directly below. Brand signatures kept: the owner, the
heavy italic "Sales & Service", the blue palette.

All visible em-dashes were removed from both locales, per the same audit.

---

## D-016 — Inner platform follows the storefront reference

**Date:** 2026-11-04
**Status:** Confirmed
**Revises:** D-005 (interior theme) and D-004 (search)

The owner asked for reference 01 (`design-references/reference-01-storefront-full.webp`)
to be reverse-engineered and applied to the inner platform, excluding the
landing page.

**Structure, taken from the reference:**

- **Dark storefront band** at the top of every inner page: the dark header,
  then a featured band (product visual on a lit platform, trust row) on the
  products page, or a compact title band on category and product pages.
- **Category tiles** with product renders, overlapping the band's lower edge.
- **Light catalogue body** below: white product cards on a pale field.
- **Promo row**: Custom PC Builds, Laptop & Desktop Repair, Why choose us.

This replaces D-005's "dark interior pages" with _dark band, light body_. The
token contract is unchanged; only where each value set applies moves.

**Search is now in scope** (revises D-004): a working client-side search over
the catalogue in the inner header, with the reference's ⌘K shortcut.

**Still out, with reasons:**

- Wishlist and compare: e-commerce shaped against an inquiry-first site.
- Carousel arrows and dots: four placeholder products do not justify one.
- The repair promo's play button: no video exists.
- "Competitive pricing" from the reference's trust list: an unverified claim.
- Reference product renders on the product cards: the cards keep the real
  Commons photos (D-015); the reference renders are AI art of these products.

Category tiles, the featured visual and promo images are cut from the
reference (interim, like D-013); crop boxes are recorded in
`docs/ASSET-CREDITS.md`.

---

## D-017 — Services pages before the admin panel

**Date:** 2026-11-04
**Status:** Confirmed

The owner redirected from the admin panel to the services pages. The admin
panel is deferred, not dropped; it still needs the backend decision (where
Supabase runs) before it can be built with real authentication.

**Built:** `/services` and seven `/services/[slug]` pages in the storefront
language of D-016, so the two business pillars read as equals (doc 01 §2).
The list is doc 01 §2.2's _candidate_ categories, labelled "being confirmed";
no record has a price, turnaround, warranty or guarantee field (doc 03 §3).

**Motion, each with a reason:** a scroll-drawn timeline for the request
process (it is a sequence), reveal-on-scroll for the bento (paces a dense
grid), pointer parallax in the band and tilt on cards (depth, D-014). All
static under `prefers-reduced-motion`.

---

## D-018 — Backend: Supabase cloud project

**Date:** 2026-11-04
**Status:** Confirmed — created, empty

|           |                                                   |
| --------- | ------------------------------------------------- |
| Project   | `creative-enterprise`                             |
| Ref       | `cgwphkmezoaigxgvywpe`                            |
| URL       | `https://cgwphkmezoaigxgvywpe.supabase.co`        |
| Region    | `ap-south-1` (Mumbai, closest to Rajkot)          |
| Plan cost | $0 / month (free tier), confirmed before creation |

The URL and publishable key live in `.env.local` (git-ignored). The
publishable key is designed to be public, but it is only safe once Row Level
Security is enabled on every table, so **no table may be created without RLS**
(doc 03 §11). The secret key has not been retrieved; nothing needs it yet.

The database is empty. Next: migrations for the MVP schema in
`docs/ARCHITECTURE.md` §4, then admin authentication.
