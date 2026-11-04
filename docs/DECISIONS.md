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

**Constraint retained:** This permits the treatments *as composed in the
references*. It is not licence for unbounded glow, gradients or glassmorphism
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

## D-004 — Catalogue extras are deferred, not rejected

**Date:** 2026-11-04
**Status:** Deferred
**Overrides:** nothing

Image 2 shows global search (⌘K), a wishlist control, a compare control and product
carousels. None of these appear in the project briefs, and a wishlist is
e-commerce-shaped against an explicitly inquiry-first scope.

**Decision:** Out of scope for now. Recorded here so they are understood as a
deliberate deferral rather than rediscovered later as missing features.

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
rather than by a demo date. The *content* of doc 01 §9 (what gets demonstrated)
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

## Still open — require owner input

These are unresolved and must not be filled with plausible-sounding values:

- **Store address, opening hours and the "4.9/5" satisfaction figure** shown in
  image 1 — not yet verified by the owner; cannot be published as fact.
- **Service catalogue** — exact services, pricing, warranty terms, turnaround
  promises and coverage (doc 01 §2.2).
- **Gujarati copy** — requires fluent-speaker review before publication; machine
  translation must not ship (doc 02 §10).
- **Logo** — exploratory concepts exist; no final mark is approved (doc 02 §9).
