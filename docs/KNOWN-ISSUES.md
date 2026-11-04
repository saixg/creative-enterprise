# Known issues and open items

Honest status, per `docs/project-brief/03-CLAUDE-WORKING-RULES.md` §8. Nothing here
is hidden behind a "done".

Last updated: 2026-11-04 (homepage reconstruction)

## Blocking publication

### 1. Gujarati copy is unreviewed

`src/i18n/messages/gu.json` carries `_status: "DRAFT — NOT REVIEWED"`. The strings
were drafted during the foundation build and have **not** been checked by a fluent
Gujarati speaker. Doc 02 §10 forbids publishing unreviewed translations.

**Needed:** a fluent speaker reviews the catalogue; then remove `_status` and the
test in `src/i18n/messages.test.ts` that guards it, in the same change.

### 2. Store details are unverified

The address, postal code and opening hours in `src/lib/business-info.ts` were read
off the image-1 reference and are **not confirmed by the owner**. They render behind
a visible "awaiting owner confirmation" notice.

**Needed:** owner confirms each field; set `verified: true` and update
`src/lib/business-info.test.ts` in the same change.

### 3. No contact details exist

No phone number, WhatsApp number or email has been supplied. The WhatsApp action
renders nothing rather than linking to an invented number, and `/contact` has no
destination content yet.

**Needed:** the owner supplies real contact details.

### 4. Design assets are mostly placeholders

- **Owner portrait** — now the REAL owner, cropped from reference 02 (D-012).
  It is only 310x420 and is presented as a deliberately framed photograph
  because no transparent cutout exists. The original file is still wanted.
- **Previously** an empty labelled frame; the real photograph is still pending
  (`docs/DECISIONS.md` D-008). No generated person may be substituted.
- **Logo** — `src/components/marketing/logo.tsx` is a neutral geometric stand-in,
  explicitly not the approved mark. Doc 02 §9: exploratory concepts are not
  approved artwork.
- **Product imagery** — none yet.

### 5. The "4.9/5" rating is not rendered

The image-1 reference shows a customer-satisfaction figure with no source. Doc 03 §3
lists ratings as something never to invent, so it is omitted entirely rather than
displayed. It can ship once the owner supplies a real figure and its source.

## Scope gaps — expected, not defects

These are simply not built yet. They are the next milestones, not bugs:

- `/services`, `/about`, `/contact` routes — the header and footer link to them and
  they will 404 until those pages are built.
- The product catalogue is placeholder data only (D-003). `/products` and
  `/products/[slug]` work, but every row is flagged `isPlaceholder` and no price
  is verified.
- The product inquiry action is **disabled**: no WhatsApp number exists, and the
  stored inquiry form arrives with the backend milestone. The button says so
  rather than pretending to submit.
- Product images are placeholder frames; no product imagery has been supplied.
- Admin area, authentication, Supabase, WhatsApp — see `docs/ARCHITECTURE.md` §8.

## Verified this build

- `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test`
  (13 tests) and `npm run build` pass locally.
- Landing and products pages prerender as static in both locales; product detail
  pages prerender per slug per locale.
- All four pages inspected in a real browser in both themes.
- No horizontal overflow at 375px, 768px or 1440px.
- Theme scoping verified: `/products` resolves `data-theme="app"` with a dark
  root background, `/` resolves `landing`. Header and footer re-skin with no
  component changes.
- No browser console errors on either locale.

## Not yet verified

- The Playwright suite has **not** been run locally (browsers are not installed on
  the development machine). It is wired into CI, where its first real execution will
  happen. Treat `npm run test:e2e` as untested until CI reports on it.
- Nothing has been deployed. No production or staging environment exists.
- The layout has not been compared side by side against the image-1 reference by
  the owner.

## Added by the homepage reconstruction (2026-11-04)

### Claims that need owner confirmation

The dark featured band carries four trust statements taken from the approved
reference 01: _Genuine products_, _Warranty support_, _Expert service_, _Quick
response_.

"Warranty support" is the one to watch. It reads as a service commitment, and
doc 03 §3 lists warranties among the things never to invent. It is on the page
because the approved reference shows it (D-002/D-010), **not** because the
business has confirmed it.

**Needed:** the owner confirms each of the four, or they are reworded.

### Interim artwork

- **Rajkot clock-tower line art** in the local strip is simplified artwork drawn
  to stand in for the supplied illustration, which has not been provided. It is
  a neutral civic silhouette, not a logo.
- **Floating hero panels** frame labelled icons, not products. No product
  photography exists. The frames sit at the reference's ratios so real images
  drop in without moving the layout.
- **Featured band product** is a labelled placeholder frame for the same reason.

### Sections with no content behind them

- **Offers** renders an honest empty state. No promotion has been supplied, and
  doc 03 §3 lists discounts among the things never to invent (D-011).
- **Brands** lists only the brand names attached to placeholder catalogue rows,
  with an explicit notice that no dealer or partnership relationship is claimed.

### Not carried over from the references, on purpose

- The hero carousel, its arrows and dots (D-004).
- The ⌘K search and the wishlist control (D-004).
- The "4.9/5 Customer Satisfaction" figure — a ratings claim with no source.
- The video play button on the repair promo — no video exists, and a play button
  that plays nothing is a false affordance.

### Still not verified

- Playwright has still never been run. The suite's assertions were written
  against the earlier landing page; they still pass by inspection of the markup
  (`Shop Products`, `Get IT Services` and the Gujarati headline are all present)
  but that is reasoning, not a test run. CI remains its first real execution.
- No Lighthouse or performance measurement has been taken.
- The rendered page has not been compared side by side with the references by
  the owner.
