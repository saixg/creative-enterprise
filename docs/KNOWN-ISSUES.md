# Known issues and open items

Honest status, per `docs/project-brief/03-CLAUDE-WORKING-RULES.md` §8. Nothing here
is hidden behind a "done".

Last updated: 2026-11-04

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

### 4. Design assets are placeholders

- **Owner portrait** — an empty labelled frame. The real photograph is pending
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

- `/products`, `/services`, `/about`, `/contact` routes — the header and footer link
  to them and they will 404 until the catalogue milestone.
- The dark `app` theme is defined in tokens but no page uses it yet; the first
  interior page will set `data-theme="app"`.
- Admin area, authentication, Supabase, WhatsApp — see `docs/ARCHITECTURE.md` §8.

## Verified this build

- `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` and
  `npm run build` pass locally.
- `/` and `/gu` prerender as static; both inspected in a real browser.
- No horizontal overflow at 375px, 768px or 1440px.
- No browser console errors on either locale.

## Not yet verified

- The Playwright suite has **not** been run locally (browsers are not installed on
  the development machine). It is wired into CI, where its first real execution will
  happen. Treat `npm run test:e2e` as untested until CI reports on it.
- Nothing has been deployed. No production or staging environment exists.
- The layout has not been compared side by side against the image-1 reference by
  the owner.
