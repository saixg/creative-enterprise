# Design review, 2026-11-09

Scope: public platform (landing, products, product detail, services, service detail, header, footer, mobile nav, inquiry forms, `/gu`) plus admin by code review only. Lens: `design-taste-frontend`. Source read plus `curl` of the running dev server (all eight sampled routes returned 200: `/`, `/products`, `/products/category/laptops`, `/products/hp-victus-15`, `/services`, `/services/laptop-desktop-repair`, `/gu`, `/gu/products`). Nothing was viewed in a visible browser, so visual and motion findings are marked "verify" where they rest on code reading. No source was changed.

Owner constraints respected: D-021 (landing light only, no products, no owner photo), D-003/D-011 (placeholder and unverified labels stay), D-016 (dark band + light body inside), inquiry-first. Nothing below recommends removing a placeholder label.

---

## 1. Design read

**Reading this as:** local IT sales and service shop in Rajkot, consumer and small-business buyers, premium-glass white-and-blue language, leaning toward Tailwind 4 tokens + Plus Jakarta Sans + Motion + one R3F glass hero.

Dials as the site stands:

| Dial             | Value                          | Reasoning                                                                                                                                                                                            |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DESIGN_VARIANCE  | 5                              | Split hero is asymmetric, but every section below it is a symmetric two-up, centred band or standard grid. Inner pages follow one template (dark band, tile rail, light body).                       |
| MOTION_INTENSITY | 8                              | WebGL knot, Lenis, marquee, drift blooms, tilt, spotlight, sheen, reveals, scroll timeline. This is above what a trust-first local shop needs and is stacked on pages that are mostly informational. |
| VISUAL_DENSITY   | 2 on landing, 5 on inner pages | Landing is very sparse (5 sections, no visible section headings); inner pages are denser but fine.                                                                                                   |

Suggested target dials for the business: variance 5, motion 5, density 4. Keep the 3D hero and the quieter reveals; cut ambient loops and stacked pointer effects elsewhere.

---

## 2. Cons

### High

**C1. Header "Get a Quote", footer "About/Contact", and mobile menu all point at 404 routes.**
`/about` and `/contact` both return 404 (also `/gu/about`). Linked from: `src/components/marketing/site-header.tsx:43` (primary header CTA), `src/components/storefront/storefront-header.tsx:59`, `src/components/marketing/mobile-nav.tsx:19-20,96`, `src/components/marketing/desktop-nav.tsx:124`, `site-header.tsx` `footerNavItems` (lines 13-16, rendered by `site-footer.tsx`). The single most prominent conversion button on every page lands on a not-found page. For an inquiry-first site this is the worst defect. Fix by building `/contact` (it can be the inquiry form plus store details, honestly labelled while contact numbers are missing) or temporarily pointing the CTA at the inquiry anchor of the current page type.

**C2. Dead in-page anchors: `/#new-arrivals`, `/#brands`, `/#offers`.**
`desktop-nav.tsx:21-23` and `mobile-nav.tsx:15-17`. D-021 removed those sections from the landing page, so the links go to the top of `/` and do nothing. Remove them, or point to `/products` sections that exist (Brands and Offers components live in `components/marketing/offers-and-brands.tsx`; check where they render). Needs owner decision if the nav items should stay at all (D-011 put them in scope).

**C3. Placeholder / unverified labels fail contrast on the light inner pages.**
`text-warm` is `#F0A34A` (`globals.css`, `--warm`), about 2.1:1 on white. It is used for the very labels that must stay visible: "Unverified price" (`product-card.tsx:92`, 12px), "Placeholder" badge (`product-card.tsx:63`, `products/[slug]/page.tsx:139`), price warning (`products/[slug]/page.tsx:157`), specs warning (`:201`), the candidate and placeholder notices (`products/page.tsx:69`, `services/page.tsx:114`, `products/category/[category]/page.tsx:80`), "Being confirmed" (`services/[slug]/page.tsx:123`), the footer build notice (`site-footer.tsx:42`) and the store "awaiting owner confirmation" line (`hero-local.tsx:150`, 12px `text-muted`). The shop layout is `theme="landing"` (light body), so these sit on white or pale blue. The labels are present but are the hardest text on the page to read. Fix by adding a `--warning-text` token (for example `#8a4b08`, about 6:1) and using it for text, keeping the amber only for borders and fills.

**C4. Mobile menu overlay is probably clipped to the header height. (verify in browser)**
`mobile-nav.tsx:64` renders `fixed inset-0` inside `<header ... backdrop-blur-xl>` (`site-header.tsx:28`, `storefront-header.tsx:38`). `backdrop-filter` makes the header the containing block for fixed descendants, so the "full screen" menu would be roughly 80-96px tall. If confirmed, mobile users cannot navigate. Fix by portalling the overlay to `document.body` (`createPortal`) or moving the blur to a pseudo-element on the header.

**C5. Gujarati copy is unreviewed and live.**
`gu.json` is marked "DRAFT, NOT REVIEWED" (KNOWN-ISSUES 1; doc 02 forbids publishing it). `/gu` renders fully. Not a design defect in itself, but it blocks launch and means every Gujarati layout check below is on provisional strings.

### Medium

**C6. Landing page is thin and has no visible section headings.**
`app/[locale]/(landing)/page.tsx` renders Hero, marquee, two pillar panels, store strip, closing CTA. Both middle section headings are `sr-only` (`pillars.tsx:37`, `capability-flow.tsx` heading). A visitor never learns, on the page itself, how a request works, what the shop stands for, or why to choose it. The business facts that exist and are safe (sales and service under one roof, walk-in store in Rajkot, "tell us the problem" process from `servicePages.steps`) are only on inner pages. Density 2 is gallery-airy for a shop whose visitors want to know "can you fix my laptop and where are you". Needs owner decision only if new claims are added; the four-step process and the store strip already exist.

**C7. `pillars.tsx:37` hard-codes English "Products and services" in an `sr-only` h2.** On `/gu` a screen reader hears English. Same class of leak: `aria-label="Creative Enterprise home"` (`site-header.tsx:32`, `storefront-header.tsx:43`), `aria-label="Mobile"` (`mobile-nav.tsx:81`), `aria-label="Footer"` (`site-footer.tsx:24`), and the logo tagline "Sales · Service · Solutions" (`logo.tsx:46`) which is not translated and is also duplicated by `footer.tagline` in the same footer.

**C8. Landing header is 96px tall at lg.**
`site-header.tsx:29` uses `lg:h-24`, over the 80px nav cap, with a 56px logo (`logo.tsx` `lg:h-14`). The inner header is 72px (`storefront-header.tsx` `h-18`). The two headers also differ in style: landing has a navy filled "Get a Quote" pill (`h-12`), inner has a cyan-outlined one with a message icon (`h-11`). Same action, two looks, two sizes.

**C9. Heavy motion is stacked, with no budget.**
On the landing page alone: WebGL knot with Sparkles and transmission material (`flow-scene.tsx`), Lenis inertia (`smooth-scroll.tsx`), marquee (`animate-marquee`), two or more drifting blooms in the hero (`hero-backdrop.tsx`), drift fields on each pillar, drift on the closing CTA, tilt + spotlight + sheen on the pillars, `HeroReveal`. About 8 `backdrop-filter` users and 5 drift/float users across components. `MeshTransmissionMaterial` is the most expensive material in drei and is the LCP-adjacent hero on mid-range Android (the typical Rajkot customer device). The `lite` path only switches on width under 768 or 4 or fewer cores (`hero-scene.tsx` lines around the `setLite` call), which will miss many mid-range 8-core phones. Not measured: KNOWN-ISSUES 272-279 confirm no Lighthouse run and no phone frame-rate test. Run both before adding more.

**C10. Lenis smooth scroll is a net negative for an inquiry-first practical shop.**
It hijacks wheel inertia on every public page (`smooth-scroll.tsx`, `lerp: 0.12`), feels laggy on low-end laptops, and conflicts with browser find, keyboard scrolling and sticky offsets. The stated reason (glass reads as one surface) is aesthetic. Recommend removing from inner pages at least (owner decision, since D-020 introduced it).

**C11. Form field borders and placeholders are low contrast.**
`inquiry-form.tsx:15`: border `--border-strong` `#cdd6e6` on white is about 1.5:1 (WCAG 1.4.11 asks 3:1 for the field boundary); `placeholder:text-muted/70` is about 3.3:1 (needs 4.5:1). The phone field uses a bare `+91` placeholder (`:170`) and the message placeholder (`:215`) carries information. Labels are above the fields (good) and errors are below (good).

**C12. Gujarati headline is forced italic and extra-bold.**
`hero.tsx:48` applies `italic font-extrabold` to the headline span. Noto Sans Gujarati has no italic or ExtraBold, so the browser fakes oblique and bold, which distorts conjuncts and looks smeared. Verify on `/gu`. Use `:lang(gu)` to drop italic and cap weight at 700 (`globals.css` already has a `:lang(gu)` rule at the base layer).

**C13. Inner-page templates are repetitive.**
Products, category, services and details all open with the same dark band, then a pale body of `surface-card rounded-3xl` cards. The product detail page ends with the 3-step "How enquiring works" (three equal columns, `products/[slug]/page.tsx:~217-236`) next to a cross-link card. Services repeats a 4-col grid then a sticky two-column process. Content is fine; the layout family repeats (see Section 3).

**C14. Product detail lists 10+ spec rows with a divider under every row.**
`products/[slug]/page.tsx:~189` uses `divide-y` on a `dl`. Acceptable for four placeholder laptops; becomes the "spec sheet with hairlines under every row" pattern as the catalogue grows. Group into 3 clusters when real data arrives.

**C15. Product photos are "representative", not the stocked item.**
Handled honestly (`representativePhoto` copy and credit), but the card gives no on-image cue; the disclosure is only on the detail page (`products/[slug]/page.tsx:~125`). A buyer scanning `/products` sees a photo that looks like the exact unit next to a price. Consider a small caption on cards when `image.isRepresentative`.

### Low

**C16. Hero eyebrow pill carries two facts and a divider** (`hero.tsx:27-39`): shield icon + "Rajkot's Trusted IT Partner" + 1px divider + pin + "Rajkot, Gujarat". Rajkot appears twice in the first 4 lines. "Trusted" is also a self-claim; same family as the unconfirmed "Warranty support" in KNOWN-ISSUES. Use the pin only, or the badge only.

**C17. `hero-local.tsx` mixes three jobs in one band** (landmark art, Gujarati tagline with a warm swoosh, business name block hidden below `sm` at line 88, store strip). On mobile the business name and city drop out, leaving the Gujarati tagline and the strip. The interim landmark art remains a raster (`rajkot-landmark.png`) stood in for a real illustration.

**C18. Same icons recur with different meanings.** `Wrench` appears in hero secondary CTA, marquee chip, pillar, closing CTA. Fine as a service marker, but the marquee chips and pillars are the same icon-in-circle pattern twice in a row.

**C19. Dark mode is absent by design.** `globals.css:` `color-scheme: light` on landing (D-021). Correct per owner; noted because the skill expects dual-mode. Inner header is always dark (`data-theme="app"`), so the header flips theme against its light body; this is the owner-approved reference 01 structure (D-016) and reads as intended.

**C20. Admin is functional but visually separate.** Flat white surfaces, 32px (`h-8`) action buttons in `media-manager.tsx:291,301,310`, `text-xs` labels in `content-forms.tsx:167-198`. Tokens are shared so it is consistent with the public site's palette. `admin-ui.tsx:268` prints an em-dash for empty dates (admin only). Mobile admin nav is a horizontal scroll bar (`admin-nav.tsx:39-41`) which is acceptable. Admin copy is English only by D-019. The skill treats admin as out of scope; the only actionable items are touch target size and the placeholder-contrast point if admin reuses `text-warm` (it does, `admin/(protected)/page.tsx:95`).

**C21. lucide-react across the whole site** (67 to 86 `lucide` SVG hits per page). The skill discourages it, but it is the existing dependency; one family, consistent stroke widths (hero uses 1.6-1.8 in places, default 2 elsewhere). Low.

---

## 3. Slop / AI tells

Checked against Sections 4 and 9 of the skill.

| Tell                                           | Found?                                                                                                                                                                                                                                                                                                                                                                                                            | Evidence                                                                                                                                                                                                                                                                |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Em-dash (U+2014) in visible copy               | No in rendered HTML for all eight routes (0 hits each); none in `en.json`. Yes in code comments (`hero-local.tsx:4,15`, `products/[slug]/page.tsx:93,207`) and admin `admin-ui.tsx:268` (`"—"` for empty date, admin only).                                                                                                                                                                                       | Clean on the public site. Replace the admin one with `-` or "Not set".                                                                                                                                                                                                  |
| Eyebrow overuse (`uppercase tracking`)         | Low. Only 4 source sites: `logo.tsx:45` (9.6px tagline on every page), `product-card.tsx:69` (brand), `products/[slug]/page.tsx:145` (brand), `admin-ui.tsx:249` (table header).                                                                                                                                                                                                                                  | Passes the 1-per-3-sections rule. The logo one is a 9.6px muted caption with `tracking-[0.28em]`, too small to read.                                                                                                                                                    |
| Glass pill as eyebrow                          | Yes                                                                                                                                                                                                                                                                                                                                                                                                               | `hero.tsx:27` `glass ... rounded-full` badge above the headline; also repeated on `/services` band (`servicePages.badge` "Sales and service under one roof") and `/products` (`featured.badge` "New Arrivals"). Three heroes, three pills.                              |
| Middle-dot (`·`) rationing                     | Partly. Visible: "Sales · Service · Solutions" (`logo.tsx:46`, `en.json footer.tagline`) rendered in header and footer on every page; product card specs `{product.summarySpecs.join(" · ")}` (`product-card.tsx:83`); search results (`catalogue-search.tsx:190`); `meta.titleTemplate "%s · Creative Enterprise"`. Admin: `inbox-view.tsx:265-267`.                                                             | Product spec strings with 3 dots per line exceed "max 1 per line". Prefer commas or separate lines.                                                                                                                                                                     |
| Decorative status dots                         | One. `hero-local.tsx:151` `bg-warm size-1.5 rounded-full` before "Store details are awaiting owner confirmation".                                                                                                                                                                                                                                                                                                 | Semantic enough to keep (it is real status), but the sentence needs no dot once contrast is fixed.                                                                                                                                                                      |
| Three equal cards                              | Yes. Product detail "How enquiring works" (3 columns, `products/[slug]/page.tsx`); storefront promos `lg:grid-cols-[1.1fr_1fr_1fr]` (`storefront-sections.tsx:333`: Custom PC Builds, Repair, Why choose us) is near-equal; category rail `sm:grid-cols-3 lg:grid-cols-5`.                                                                                                                                        | The two-up Pillars on landing is a deliberate 50/50 (equal weight is a business rule), so that one is justified.                                                                                                                                                        |
| Generic hero copy                              | Yes. "Your One-Stop IT Partner for Sales & Service" (`hero.headlineLead/Sales/Amp/Service`), "Rajkot's Trusted IT Partner".                                                                                                                                                                                                                                                                                       | "One-stop" and "trusted partner" are interchangeable with any shop. Subcopy is concrete and good. Needs owner input for a sharper line, not invention.                                                                                                                  |
| Mock-humble / cute copy                        | Mild. `why.reasons.guidance.body`: "Advice on what actually suits your use and budget, not the biggest sale." and `why.reasons.local.body`: "so support does not mean a courier and a wait."                                                                                                                                                                                                                      | Reads as AI-craftsman. Also these are claims about the business that the owner has not confirmed.                                                                                                                                                                       |
| Unconfirmed claims                             | Yes (known). "Genuine products", "Warranty support", "Expert service", "Quick response" (`featured.trust.*`); "genuine products, expert support and after-sales service" (`products.heroSubheadline`, duplicated verbatim at `featured.subheadline`).                                                                                                                                                             | In KNOWN-ISSUES already. Flagging that the same sentence is stored twice.                                                                                                                                                                                               |
| Duplicate CTA intent                           | Yes. "Product" intent: "Explore products" / "Shop Products" / "Browse products" / "Browse all services" / "Explore Laptops" / "View all". "Service" intent: "Book a service" / "Get IT Services" / "Request a service" / "Request this service" / "Browse services" / "Explore our services". "Quote" intent: "Get a Quote" / "Get Quote" / "Request a quote" / "Ask what's available" / "Enquire about a build". | On the landing page alone: hero "Explore products" + "Book a service", pillars "Shop Products" + "Get IT Services", closing CTA repeats the hero pair. Four labels for two intents. Pick one label per intent: e.g. "Browse products", "Book a service", "Get a quote". |
| Fake-precise numbers                           | Placeholder prices (₹65,990 etc.) are labelled as placeholders, so allowed. No invented ratings or percentages found.                                                                                                                                                                                                                                                                                             | Pass.                                                                                                                                                                                                                                                                   |
| Split header (big left, small right paragraph) | No.                                                                                                                                                                                                                                                                                                                                                                                                               | Section headers stack. Pass.                                                                                                                                                                                                                                            |
| Zigzag > 2                                     | No.                                                                                                                                                                                                                                                                                                                                                                                                               | Pass.                                                                                                                                                                                                                                                                   |
| Section layout repetition                      | Inner pages: dark band + pale-card body repeat on 4 routes (C13). Landing: 4 different families (split hero, ribbon, two-up panels, strip, centred CTA band).                                                                                                                                                                                                                                                     | Landing passes; inner pages are template-driven by design (D-016).                                                                                                                                                                                                      |
| Marquee max 1                                  | Yes, one (`capability-flow.tsx`), and it is the landing page's only content-bearing section after the hero.                                                                                                                                                                                                                                                                                                       | Passes the count, but see C6: the marquee carries six one-word chips and no section heading.                                                                                                                                                                            |
| Scroll cue, version labels, locale strip       | No scroll cue. Locale strip: "Rajkot, Gujarat" in hero pill and `why.location`; legitimate (physical shop).                                                                                                                                                                                                                                                                                                       | Pass.                                                                                                                                                                                                                                                                   |
| Div-based fake screenshots                     | No.                                                                                                                                                                                                                                                                                                                                                                                                               | Pass.                                                                                                                                                                                                                                                                   |
| Pills overlaid on images                       | Yes. `bg-warm/15 ... absolute bottom-4` "Product image pending" on detail media (`products/[slug]/page.tsx:115`); "Being confirmed" on service image (`services/[slug]/page.tsx:123`); "Placeholder" and "New" badges above the card body.                                                                                                                                                                        | These are mandatory honesty labels, not decoration. Keep. Improve contrast (C3).                                                                                                                                                                                        |
| Hand-rolled SVG decoration                     | Yes. Hero headline underline swoosh (`hero.tsx:55-67`), hero ribbon (`hero-backdrop.tsx`), warm swoosh under the Gujarati tagline (`hero-local.tsx:67-78`), raster Rajkot landmark.                                                                                                                                                                                                                               | Three separate swooshes. Cut the headline underline or the Gujarati swoosh.                                                                                                                                                                                             |
| Inter default                                  | No. Plus Jakarta Sans + Noto Sans Gujarati via `next/font`.                                                                                                                                                                                                                                                                                                                                                       | Pass.                                                                                                                                                                                                                                                                   |
| AI purple                                      | No. Blue, cyan, one violet token (`--accent-soft: #7650e8`) used in a hero bloom (`hero-backdrop.tsx:30`) and the dark theme accent.                                                                                                                                                                                                                                                                              | Violet appears only as a bloom on landing and as the dark-theme accent; the stated palette is white + blue + one accent. Consider dropping violet blooms to honour D-021 literally.                                                                                     |
| Neon/outer glow                                | Yes. `--glow-primary` box-shadow on `.btn-gradient`, `.glass-tile` coloured drops, 48rem blurred blooms.                                                                                                                                                                                                                                                                                                          | Permitted by D-002/D-010 as "reference governs". Keep, but cap to the hero and the primary CTA.                                                                                                                                                                         |
| Premium-consumer beige/brass palette           | No.                                                                                                                                                                                                                                                                                                                                                                                                               | Pass.                                                                                                                                                                                                                                                                   |
| Custom cursors                                 | No.                                                                                                                                                                                                                                                                                                                                                                                                               | Pass.                                                                                                                                                                                                                                                                   |

---

## 4. Improvements (prioritised)

Flags: **[OWNER]** needs an owner decision; **[CODE]** safe to do under existing decisions.

1. **[CODE] Build `/contact` and `/about`, or retarget the links.** (C1) `/contact` = the existing `InquiryForm` (general kind) + store card with the "awaiting owner confirmation" notice + WhatsApp link only when `whatsappNumberE164` exists (already supported by `ProductInquiry`). Until built, point header and mobile "Get a Quote" at `/products#enquiry` or `/services#request` and remove `/about` from nav. Expected effect: the main conversion path stops dead-ending.
2. **[CODE] Fix mobile menu clipping.** (C4) Portal the dialog to `body`; add focus trap and `inert` on page content; label it. Verify on a 375px viewport.
3. **[CODE] Add a readable warning text token and apply it to every placeholder/unverified label.** (C3) `--warning-text` in both themes in `globals.css`, then replace `text-warm` for text (not borders/fills) in the 12 files listed. Keep the labels exactly as they are.
4. **[CODE] Remove or repoint dead nav anchors.** (C2) Delete `/#new-arrivals`, `/#brands`, `/#offers` from `desktop-nav.tsx:21-23` and `mobile-nav.tsx:15-17`, or link to the real sections. **[OWNER]** if those three items should remain in the nav at all.
5. **[CODE] Unify CTA language.** (Section 3) One label per intent, applied in `en.json` and `gu.json`: products, services, quote. The landing page then has two real CTAs, not four.
6. **[CODE] Give the landing page real section headings and one more content section.** (C6) Make the pillar `h2` visible and translated (fix `pillars.tsx:37`); reuse `servicePages.steps` (4 steps) as a "How it works" strip, or promote the existing store strip with a heading. No new claims needed. Keeps density modest, adds scannable structure.
7. **[CODE] Motion budget.** (C9, C10) Measure first: Lighthouse mobile on `/`, and frame rate on a mid-range Android. Then: raise the `lite` threshold (swap `MeshTransmissionMaterial` for a cheaper physical material on devices under 6 cores or any touch device), drop `Sparkles` on lite, keep only one ambient loop (the 3D knot) plus the marquee, remove drift on pillars and the closing CTA, restrict Tilt to non-touch and to the pillars (remove it from product cards, where pointer 3D adds little). **[OWNER]** for removing Lenis (D-020).
8. **[CODE] Gujarati typography pass.** (C12, C7) In `globals.css` add `:lang(gu)` rules removing italic and capping the display weight, increase `line-height` for Gujarati headings, and translate the hard-coded aria labels and the logo tagline. Sample 20 strings at 375px for wrapping. Review stays blocked on a fluent reviewer (C5).
9. **[CODE] Form accessibility.** (C11) `inquiry-form.tsx:15`: border `--border-strong` darkened to about 3:1 against white (for example `#8a96ad`), placeholder at full `--muted`, keep helper text visible. Make the phone input's `+91` a prefix inside the field, not a placeholder. Check submit buttons are at least 44px tall (`size lg` is `h-13`, fine).
10. **[CODE] Header consistency and height.** (C8, C16) One Get a Quote style across both headers; landing header `lg:h-20`; remove the 9.6px logo tagline or enlarge it to 12px and translate it; shorten the hero pill to a single fact.

Further, lower priority:

11. **[CODE]** Group product specs into clusters and add a "representative photo" caption on cards (C14, C15).
12. **[OWNER]** Replace the "One-Stop IT Partner" headline and the unconfirmed trust claims with owner-approved wording; the layout does not need to change, only strings.
13. **[CODE]** Cut two of the three swooshes (hero underline, Gujarati swoosh) and the violet bloom (Section 3, hand-rolled SVG and AI-purple rows).
14. **[CODE]** Admin: enlarge `h-8` action buttons to 40px, replace `"—"` with `-` (`admin-ui.tsx:268`).
15. **[OWNER]** Real photography and SVG logo (already tracked in KNOWN-ISSUES 4); the interim raster "C" mark and raster landmark limit the premium feel more than any CSS change.

---

## 5. Pre-flight checklist results

Applied to the landing page and the public shell; inner and admin noted where different.

- [x] Brief inference declared: **pass** (Section 1).
- [x] Dial values explicit and reasoned: **pass**.
- [ ] Design system chosen or aesthetic labelled honestly: **pass**. Glass is labelled a web approximation in `globals.css` (comments at `.glass-tile`).
- [ ] Redesign mode and audit: **pass**. Treated as redesign-preserve (owner decisions D-001 to D-021 govern).
- [ ] ZERO em-dashes in visible copy: **pass** for the rendered public pages (0 hits in all eight routes); **fail** for admin (`admin-ui.tsx:268`) and code comments only.
- [ ] Page Theme Lock: **pass** on landing (light). Inner pages intentionally pair a dark band with a light body (D-016); owner-approved exception.
- [ ] Color Consistency Lock (one accent): **fail (minor)**. Blue primary plus cyan accent plus violet `--accent-soft` bloom plus amber `--warm` (swooshes, labels). Palette is controlled but exceeds "white + blue + one accent".
- [ ] Shape Consistency Lock: **fail (minor)**. Pills (`rounded-full`) for buttons and chips, `rounded-xl` inputs, `rounded-3xl` cards, `rounded-[2rem]` pillars, `rounded-[2.5rem]` closing CTA, `rounded-[1.6rem]` store strip. Documentable as "interactive = pill, containers = 24-40px", but 5 different container radii are in use.
- [ ] Button contrast: **pass** for primary and secondary (white on `#0759e8`, navy on white). Warm-text labels fail (C3).
- [ ] CTA wrap: **pass** at desktop by reading (`h-13 inline-flex`, short labels). Verify in `/gu`.
- [ ] Form contrast: **fail** (C11).
- [ ] Serif discipline: **n/a**, no serif.
- [ ] Premium-consumer palette check: **pass**, no beige/brass.
- [ ] Italic descender clearance: **pass** for English ("Sales & Service" has no descenders and uses `leading-[1.1] pb-2`); **fail/verify** for Gujarati (C12).
- [ ] Hero fits viewport: **pass** by `min-h-[calc(100dvh-6rem)]`, 2-line headline, 15-word subcopy, CTAs in view (verify on a 768px-tall laptop).
- [ ] Hero top padding: **pass** (`pt-10`, `lg:pt-6`).
- [ ] Hero stack discipline: **pass** (pill, headline, sentence, two CTAs; the pill holds two facts, C16).
- [ ] Eyebrow count: **pass** (4 uppercase-tracking uses, none above section headlines).
- [ ] Split-Header Ban: **pass**.
- [ ] Zigzag cap: **pass**.
- [ ] No duplicate CTA intent: **fail** (Section 3).
- [ ] Logo wall = logo only: **n/a**, no logo wall (and none may be invented, dealer claims are forbidden).
- [ ] Bento background diversity: **n/a** on landing; **verify** on `/services` (image cards mixed with icon cards).
- [ ] Trusted-by wall under hero with real logos: **n/a**.
- [ ] Copy self-audit: **fail (minor)**. Generic headline, mock-humble lines (Section 3).
- [ ] Motion motivated: **partial**. Knot (brand moment), reveals (pacing) and the services timeline (sequence) are motivated; drift on the closing CTA and every pillar, sheen on every CTA, and Lenis are not.
- [ ] Marquee max one: **pass**.
- [ ] Navigation on one line, height cap 80px: **fail** on landing (96px, `site-header.tsx:29`); **pass** inner (72px). One-line desktop nav not measured at 1024px (verify; `DesktopNav` has dropdowns plus 3 items plus search on inner).
- [ ] Section-layout repetition: **pass** on landing, **fail (by design)** on inner pages.
- [ ] Bento rhythm and cell count: **verify** `/services` (7 services in a 4-col grid with `spans[]`/`sizes[]`, `services/page.tsx:118`); check the last row has no empty cell at 1440px.
- [ ] Long lists use the right component: **pass** (marquee, rail, grids); spec table borderline (C14).
- [ ] Real images / no fake screenshots / no hand-rolled decorative SVG: **fail (minor)**: three SVG swooshes, interim raster art; no fake UI. Product photos are real Commons images (labelled representative).
- [ ] No pills overlaid on images: **partial**. Present, but they are mandatory honesty labels (kept).
- [ ] No photo-credit decoration: **pass** (credits are real and licence-required).
- [ ] No version footers: **pass**. The footer "This site is in development" notice is a deliberate honesty label.
- [ ] No micro-meta-sentences under eyebrows: **pass**.
- [ ] No hero bottom strip, no floating top-right text: **pass**.
- [ ] No filled-track progress bars: **pass**.
- [ ] No locale/time/weather strips: **pass** (real shop).
- [ ] No scroll cues: **pass**.
- [ ] No hero version labels: **pass**.
- [ ] No section-numbering eyebrows: **pass** (step numbers 1 to 3 appear on the process lists as real sequence).
- [ ] No decorative dots: **pass** (one status dot, `hero-local.tsx:151`).
- [ ] No `border-t`+`border-b` on every list row: **pass** (single `divide-y` on the spec list, C14).
- [ ] Content density sane: **pass** inner, **fail** landing (too sparse, C6).
- [ ] Quotes: **n/a**, no testimonials (and none may be invented).
- [ ] Motion claimed = motion shown: **pass** (dial 8, much motion), but never seen in a visible browser per D-020 and KNOWN-ISSUES; D-021 reports the hero seen at 1440px.
- [ ] GSAP sticky-stack / horizontal pan: **n/a**, GSAP not used (Motion + `scroll-timeline.tsx`).
- [ ] No `window.addEventListener('scroll')`: **pass** by grep of the animation components (uses Motion hooks, IntersectionObserver, Lenis).
- [ ] Reduced motion: **pass**. `globals.css` collapses animations; `Tilt`, `SmoothScroll`, `HeroScene` and the marquee all check it. Reduced transparency also handled.
- [ ] Dark mode tokens defined and tested: **n/a for landing** (light only by D-021); the dark `app` set exists and is used on inner headers and bands.
- [ ] Mobile collapse explicit: **pass** for the hero grid, pillars and rails; **fail/verify** for the mobile menu overlay (C4).
- [ ] Viewport stability (`100dvh`): **pass** (`hero.tsx` uses `100dvh`).
- [ ] `useEffect` cleanups: **pass** in `smooth-scroll.tsx`, `hero-scene.tsx`, `mobile-nav.tsx`.
- [ ] Empty / loading / error states: **pass** on public (empty category, no match, no offers, form error and success); admin has a gate fallback and form feedback. No skeletons; `loading: () => null` for the 3D scene with a still orb underneath (good).
- [ ] Cards omitted where possible: **fail (minor)**: inner pages are card-heavy (`surface-card` everywhere).
- [ ] Icons from an allowed library: **fail (minor)**: lucide-react (existing dependency), one family, no hand-rolled icon paths.
- [ ] Motion isolated in client leaves: **pass**.
- [ ] No AI tells from Section 9: **partial** (generic headline, duplicate CTAs, swooshes, violet bloom).
- [ ] Core Web Vitals plausible: **unverified**. No Lighthouse run exists; three.js and drei are code-split, and HTML is 100 to 170 KB with about 26 script tags per route. LCP is the text, not the canvas, which is good. Run Lighthouse mobile before claiming a pass.
- [ ] One design system: **pass** (own tokens, no mixed library).

---

## Appendix: what is working well

- Honesty labelling is thorough and consistent (price, specs, image, candidate services, store details). It is the right call; it only needs better contrast.
- The one-token-contract approach (`globals.css`) with `:lang(gu)`, reduced-motion and reduced-transparency handling is solid engineering.
- The hero has a clear split, a two-line headline, one concrete sentence and two CTAs, and the 3D scene degrades to a still orb.
- Inquiry form structure (label above, error below, honest privacy line, honeypot) follows the skill's form rules apart from the contrast.
- Products and services are given equal weight on the landing page through the two matching pillar panels.
