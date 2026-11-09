# Visual review, 2026-11-09

Scope: every public page named in the brief, at 1440x900 desktop and 375x812 mobile, in the built-in browser against the running dev server (`http://localhost:3000`). Lens: `design-taste-frontend`. This builds on `DESIGN-REVIEW-2026-11-09.md` (the code-only review, cited below as "DR"). It does not repeat that review. It confirms or refutes DR's visual guesses and adds what only shows up in a browser. No source was changed and no form was submitted.

## How this was observed, and its limits

- **The browser pane was hidden for the whole session.** `tabs_context` reported it hidden from the start. In a hidden pane `requestAnimationFrame` is throttled: a 1-second rAF probe on `/` counted **1 frame**. So all motion was seen at roughly 1 fps, as a series of stills.
  - **Seen as stills, not as motion:** knot rotation and orb orbits (successive screenshots show different poses), the knot reacting to the pointer (pose changed after hovering), the pillar tilt on hover, the marquee position moving, the products grid layout animation (caught mid-flight), Lenis inertia (the page kept travelling after a wheel scroll).
  - **Not observable at all:** frame rate and smoothness, easing quality, how the knot surges with pointer speed, the hero load and reveal sequence, `HeroReveal` timing, scroll-reveal staggers, sheen sweeps, and whether Lenis feels laggy. Every judgement about these below is marked **(not observed)**. They need a re-run with the pane visible, and a test on a real mid-range Android phone.
- Screenshots in a hidden pane were also unreliable after scrolling: some came back as zoomed crops or timed out. Full-page inner views were therefore taken by making the viewport as tall as the page (1440 x page height, and 375 x page height). Hero sizes depend on `dvh`, so those tall views were used only for inner pages, never for the landing hero.
- Evidence below is cited as _page / viewport / what the screenshot shows_. Numeric facts (element rects, font sizes, computed styles) were measured with DOM queries in the same tab.

---

## 1. Verdict

The platform is about two-thirds of the way to premium, and the gap is in three places: the finish of the 3D hero, the photography, and broken edges.

The landing page at 1440 has a confident first impression. The split hero, the typography, the white-and-blue palette and a real refractive glass knot read as a modern brand, a clear step above a typical local-shop site. Close up, the hero breaks its own spell:

- the three "light" orbs render as flat, unlit discs;
- the knot and the orbs are cut by hard vertical and horizontal edges of the canvas and the hero section;
- on mobile the scene sits below the fold with jagged, un-antialiased edges.

Below the hero, the page goes thin and airy. Two large pillar panels hold one line of text each, and the store strip shows a raster landmark inside a visible box.

The inner pages are stronger in structure and weaker in material. The dark band to light body (D-016) works on `/services`, which is the best page on the site. On products, the four "representative" photos are mismatched snapshots: brown and grey backgrounds, phone-camera angles, a dim lid close-up as the product detail hero. They pull every product surface down to classified-ad quality, whatever the glass around them does.

Broken basics would undercut any premium polish today:

- the mobile menu is clipped (DR C4: **confirmed**);
- "Get a Quote" lands on Next's bare black 404 page;
- the decorative product cut-outs on `/services` cover card titles;
- the Gujarati headline is in fake italic (DR C12: **confirmed**).

The gap to premium is fixable: a short list of defects, one hero-material pass, and consistent product imagery. It does not need a redesign.

---

## 2. Page-by-page review

Severity: **H** = visibly broken or brand-damaging, **M** = noticeably below premium, **L** = polish.

### 2.1 Landing `/`, desktop 1440x900

**Works**

- The split hero is well proportioned. The two-line headline with "Sales & Service" in bold italic fits in the viewport, the 17-word subcopy is concrete, and both CTAs are visible without scrolling.
- The glass knot is genuinely refractive: chromatic fringing, a clearcoat highlight, and the orbs tinting it from behind. When an orb sits _behind_ the knot it looks right, a soft cyan glow seen through glass.
- The palette holds (white field, navy text, one saturated blue). Plus Jakarta Sans at display weight looks premium.
- The marquee chips have a soft edge fade, and the chip glass is tasteful.
- The closing CTA band (deep blue to cyan gradient, white plus ghost buttons) is the most finished block on the page.

**Doesn't work**

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                          | Evidence                                                                                                                                  | Sev   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| L1  | **Orbs render as flat 2D discs.** When an orb passes _in front of_ the knot it is a solid, unshaded circle: a white disc, a cyan disc, a saturated blue disc, with no glow, no falloff and no depth. It reads as a rendering bug, not as light. Cause: `LightOrb` uses `meshStandardMaterial` with `emissive` and `toneMapped={false}`, but there is no bloom pass, so emissive is flat colour (`src/components/hero3d/flow-scene.tsx:90-98`). | `/` 1440: three successive stills show a flat white disc covering the knot centre, then a flat blue disc at front-left, then a cyan disc. | **H** |
| L2  | **Scene is hard-clipped by the canvas edge.** The canvas is 565x736 CSS px at x=755. The knot, plus orbs orbiting outside it, extends past the canvas's left edge, so you see straight vertical cuts through the knot and through a blue orb (half-disc). On `/gu` the same happens at the right edge.                                                                                                                                         | `/` 1440 (two stills: vertical cut at x≈755 through knot and orb); `/gu` 1440 (cut at the right). Canvas rect measured.                   | **H** |
| L3  | **Knot is sliced by the hero's bottom edge when scrolling.** At scrollY 700 a fragment of the knot remains under the header, cut by a horizontal line. Through the translucent header glass it shows as a blue smudge behind the wordmark. The scroll-out (`g.position.y = -scroll*1.4`) moves the knot _down_, toward the clip, instead of fading or exiting cleanly.                                                                         | `/` 1440 scrolled 700 (knot fragment with a flat bottom edge); earlier still at ~800 (blue blob behind "Creative Enterprise").            | **H** |
| L4  | Header 96.7px tall (measured), over the 80px cap. DR C8: confirmed.                                                                                                                                                                                                                                                                                                                                                                            | DOM height                                                                                                                                | M     |
| L5  | **Thin middle.** The pillars are two 330px-tall glass panels with only an icon, an arrow, a title and one 12px grey line. About 60% of each panel is empty gradient. Large blank bands sit above and below the marquee (about 90px of nothing). Nothing tells the visitor _how_ buying or servicing works. DR C6: confirmed visually.                                                                                                          | `/` 1440 scrolled 700                                                                                                                     | M     |
| L6  | **Store strip landmark is a visible rectangle.** The raster `rajkot-landmark.png` sits in a pale-blue box with straight top and right edges, not blended into the field. It reads as a pasted image. The amber "Store details are awaiting owner confirmation" line is about 11px and very low contrast (DR C3).                                                                                                                               | `/` 1440 scrolled 1400, zoom on the strip                                                                                                 | M     |
| L7  | **Footer is sparse and duplicates the tagline.** "SALES · SERVICE · SOLUTIONS" (logo) sits directly above "Sales · Service · Solutions" (footer tagline). One "Explore" column sits on the far right with a 900px gap. The amber dev notice is pale.                                                                                                                                                                                           | `/` 1440 footer                                                                                                                           | L     |
| L8  | Language popover is a plain white list. The Gujarati label renders small, and there is no flag or "A" glyph as in reference 02. The chevron stayed "up" after Escape closed the menu (seen once; verify).                                                                                                                                                                                                                                      | `/` 1440, language menu open                                                                                                              | L     |
| L9  | Products dropdown is a plain text list, while the inner pages and reference 01 promise imagery.                                                                                                                                                                                                                                                                                                                                                | `/` 1440, Products menu open                                                                                                              | L     |
| L10 | Logo focus ring is a sharp rectangle around a soft, pill-heavy UI. The other focus rings (language button: navy 2px pill outline) are good.                                                                                                                                                                                                                                                                                                    | Tab focus stills                                                                                                                          | L     |

### 2.2 Landing `/`, mobile 375x812

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                        | Evidence                                                                                                                                                                              | Sev   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| M1  | **Mobile menu overlay is clipped to the header. DR C4 confirmed.** The `fixed inset-0` overlay measures **375x80**, because its containing block is the `header` with `backdrop-filter: blur(24px)`. Menu links (Home, Products, Brands, Offers, New Arrivals, Services, About, Contact) spill out with no background, printed on top of the hero headline, pill and CTAs. They are unreadable and partly unclickable. Escape does close it. | `/` 375, menu open: link text overlapping "Your One-Stop IT Partner", "Explore products" and "Book a service". DOM: overlay rect 375x80, parent HEADER `backdrop-filter: blur(24px)`. | **H** |
| M2  | **3D hero sits below the fold.** The canvas starts at y=627, so on first load you see only the top 185px of it. The signature visual of D-021 is invisible on the device most customers use.                                                                                                                                                                                                                                                 | Canvas rect measured; `/` 375 first screen                                                                                                                                            | **H** |
| M3  | **Jagged knot edges on mobile.** `lite` turns `antialias` off (`flow-scene.tsx:203`) and caps DPR at 1.25, so the glass outline is visibly stair-stepped. Orbs also clip at the canvas edge here.                                                                                                                                                                                                                                            | `/` 375 bottom of first screen                                                                                                                                                        | M     |
| M4  | The eyebrow pill wraps to two lines and becomes a rounded card ("Rajkot's Trusted IT Partner" / "Rajkot, Gujarat"). Rajkot appears twice above the H1 (DR C16).                                                                                                                                                                                                                                                                              | `/` 375                                                                                                                                                                               | M     |
| M5  | CTAs are different widths, stacked, and neither is full width, so they look accidental.                                                                                                                                                                                                                                                                                                                                                      | `/` 375                                                                                                                                                                               | L     |
| M6  | The knot is cut flat at the hero's bottom edge while scrolling (same as L3).                                                                                                                                                                                                                                                                                                                                                                 | `/` 375 scrolled 800                                                                                                                                                                  | M     |

### 2.3 Landing `/gu`, desktop and mobile

| #   | Issue                                                                                                                                                                                                              | Evidence           | Sev      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | -------- |
| G1  | **Fake italic on the Gujarati headline. DR C12 confirmed.** "વેચાણ અને સર્વિસ" is visibly sheared (synthetic oblique), and the matras lean off their bases. This is the most visible typographic flaw on the site. | `/gu` 1440 and 375 | **H**    |
| G2  | "Rajkot, Gujarat" in the hero pill stays in English. The logo tagline stays in English.                                                                                                                            | `/gu` 1440         | M        |
| G3  | On mobile the headline lead breaks with "સ્થળ:" orphaned on its own line.                                                                                                                                          | `/gu` 375          | L        |
| G4  | Gujarati nav labels render small and heavy at 1440. Their visual weight is lower than the English labels.                                                                                                          | `/gu` 1440 header  | L        |
| G5  | The scene is clipped at the canvas's right edge (L2).                                                                                                                                                              | `/gu` 1440         | (see L2) |
| G6  | Locale is sticky: after visiting `/gu`, `/`, `/contact` and `/about` all redirect to `/gu/...`. This is correct behaviour, but it means the 404s in 2.10 show in English on a Gujarati session.                    | Navigation         | L        |

### 2.4 `/products`, desktop and mobile

**Works**

- At 1440 the dark hero band with the two-laptop render on a lit platform is close to reference 01 and looks premium.
- The filter chips are clean.
- The amber placeholder banner is present and honest.
- The Custom PC / Repair / Why-choose-us promo row has strong dark imagery.
- At 375 the hero restacks well (copy, CTAs, trust row, then the render).

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Evidence                                                                                                     | Sev   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----- |
| P1  | **Product photos are mismatched.** The HP Victus is a dim lid close-up on a brown backdrop. The Lenovo is shot from a tilted phone angle on off-white. The ASUS is top-down on white. The MacBook is a grey lid. There is no shared background, angle, crop or lighting. Inside identical white card stages this is the single biggest reason the catalogue does not feel premium.                                                                       | `/products` 1440 grid; `/products/hp-victus-15` 1440 hero image                                              | **H** |
| P2  | **Search placeholder is truncated in the header at 1440.** "Search laptc…" is cut mid-word, and the `Ctrl K` hint crowds it. The search pill is too narrow for its own placeholder.                                                                                                                                                                                                                                                                      | `/products` 1440 header                                                                                      | M     |
| P3  | **Category tile rail straddles the dark-to-white seam.** The dark-glass tiles sit half on the dark band and half on white, so their lower half washes out to grey and the white labels ("Laptops", "Desktops") sit on a light-grey area. Heavy grey drop shadows under each tile look muddy on white. On first paint the tiles showed with **no images** for about 3 seconds, then images popped in (seen in a throttled pane; verify on a normal load). | `/products` 1440 first and second stills; `/gu/services` 1440 tiles with white Gujarati labels on light grey | M     |
| P4  | Inner header turns flat charcoal grey (not navy) once it is over the white body, because the dark glass is translucent over white. It looks muddy against the navy band above.                                                                                                                                                                                                                                                                           | `/products` 1440 scrolled 750                                                                                | M     |
| P5  | Filter chips show "Desktops 0", "Components 0", "Accessories 0". The zeros advertise emptiness. The active brand chip ("Apple") is only a pale cyan fill, weakly distinct from "All brands".                                                                                                                                                                                                                                                             | `/products` 1440                                                                                             | L     |
| P6  | Catalogue search (Ctrl+K) focuses the inline header field. Results show in a narrow dark popover with the spec line truncated ("HP · i5-13420H · RT…"). It is functional, but it is not a command-palette moment. The empty state ("No products match … Ask us, as not everything we stock is listed") has no link to act on.                                                                                                                            | `/products` 1440 typing "victus" and "victuszzz"                                                             | M     |
| P7  | At 375 the cards are full-width, single-column and about 600px tall each, so four products take four screens. Images loaded late (blank stages first, then pop-in).                                                                                                                                                                                                                                                                                      | `/products` 375 full-height capture                                                                          | M     |
| P8  | Large dead gap above the promo row (about 120px), and the brand chips are bare text pills.                                                                                                                                                                                                                                                                                                                                                               | `/products` 1440 scrolled 1500                                                                               | L     |

### 2.5 `/products/category/laptops` and `/desktops` (empty state), 1440

| #   | Issue                                                                                                                                                                                                                                                                                                                        | Evidence                                          | Sev              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------- |
| C1  | **The tile rail collides with the band copy.** The second line of the subtitle ("as we can often source it.") ends at about y=140, and the tiles begin at about y=148, with no breathing room. The band is too short for title, subtitle and rail. The active tile ("Laptops" or "Desktops") has only a faint lilac outline. | `/products/category/laptops` and `/desktops` 1440 | M                |
| C2  | The desktops empty state is well composed (outlined icon, honest headline, three actions). But its primary "Ask what's available" and the header "Get a Quote" both go to `/contact`, which is a 404 (2.10).                                                                                                                 | href measured                                     | **H** (dead end) |
| C3  | The empty-state icon is a small thin-line box. It is fine, but for a premium feel the empty state could reuse the category tile's desktop render, softly lit.                                                                                                                                                                | `/desktops` 1440                                  | L                |

### 2.6 `/products/hp-victus-15`, desktop and mobile

| #   | Issue                                                                                                                                                                                                                        | Evidence                         | Sev     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------- |
| D1  | **Hero image is a dim, low-contrast lid photo** in a white frame with a lilac glow. It is the opposite of the reference 01 product stage. (Same root cause as P1.)                                                           | 1440 and 375                     | **H**   |
| D2  | **Large dead left column.** The image column is not sticky, so from about y=460 to y=1060 the left half is empty while the form and specs run down the right.                                                                | 1440 full-height capture         | M       |
| D3  | **Name and phone fields are misaligned.** The name input is at y=678, the phone input at y=667 (measured), so they are 11px out. The phone label's helper text causes it. The same happens on the service-detail form.       | DOM rects                        | M       |
| D4  | **No inline validation.** Name left empty, phone "12" and email "abc", then tabbing on: no error, no colour change, nothing. Errors appear only on submit (not tested, per the rules). For a premium form, validate on blur. | 1440 still after tabbing through | M       |
| D5  | Mobile inputs compute to **15.2px** font size. iOS Safari zooms the page on focus below 16px.                                                                                                                                | 375 computed style               | M       |
| D6  | The dark band at the top is a vestigial 90px strip with breadcrumbs and a white fog fade. It reads as a rendering artefact rather than a band.                                                                               | 1440                             | L       |
| D7  | Related products: three cards in a four-column grid leave an empty fourth column. The spec list has a divider under every row (DR C14).                                                                                      | 1440 full capture                | L       |
| D8  | Focus ring on the textarea (blue double ring) is good. The Send button is the right height.                                                                                                                                  | 1440                             | (works) |

### 2.7 `/services`, desktop and mobile

**Works**

- Best page on the site. The dark hero with the repair photo, floating glass tiles (tools, CCTV camera, printer) and a violet glow is close to the brand promise.
- The bento of seven services has rhythm (one large image cell, four small, two wide) and no empty cell. DR's "verify" is resolved: **pass**.
- The four-step "How a service request works" timeline is clear.

| #   | Issue                                                                                                                                                                                                                                          | Evidence                                                               | Sev      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------- |
| S1  | **Decorative cut-outs overlap card titles.** The CCTV camera render covers the end of "CCTV installation & re…", truncating the title. The laptop render sits on top of "Laptop screen replacement". The GPU sits against "Hardware upgrades". | `/services` 1440 full capture, zoom on the bento                       | **H**    |
| S2  | **The Software troubleshooting card has a pale blue square with a terminal icon** where the other cards have a render. It reads as a missing image.                                                                                            | `/services` 1440, `/gu/services` 1440, service detail "Other services" | M        |
| S3  | The amber "being confirmed" banner and the grey note "Requests are not set up yet…" are very low contrast (DR C3).                                                                                                                             | 1440                                                                   | M        |
| S4  | The "Need new hardware instead?" dark band has an empty right 60%.                                                                                                                                                                             | 1440                                                                   | L        |
| S5  | At 375 the floating wrench tile is cut by the left viewport edge. The hero photo is soft (upscaled).                                                                                                                                           | `/services` 375                                                        | L        |
| S6  | Same tile-rail washout as P3.                                                                                                                                                                                                                  | 1440                                                                   | (see P3) |

### 2.8 `/services/laptop-desktop-repair`, 1440

| #   | Issue                                                                                                                                                                | Evidence          | Sev                                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------- |
| SD1 | **The "Being confirmed" label on the image is unreadable.** It is amber text on a busy blue photo with no backing. The honesty label is present but invisible.       | 1440 full capture | **H** (honesty label must be legible) |
| SD2 | The hero photo is visibly soft (low resolution, upscaled).                                                                                                           | 1440              | M                                     |
| SD3 | The dark form card on a light page is a nice contrast moment. Its input borders are near-invisible, dark on dark, and the name and phone fields are misaligned (D3). | 1440              | M                                     |
| SD4 | Dead left column below the image (same as D2).                                                                                                                       | 1440              | M                                     |

### 2.9 `/gu/services`, 1440

Layout holds in Gujarati: no overflow, and the CTAs stay on one line. The tile labels (white Gujarati on washed grey, P3) are the weakest point. The H1 and H2 at heavy weight are fine because there is no italic here.

### 2.10 404 behind `/contact` and `/about`

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                 | Evidence                                | Sev   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----- |
| N1  | **Next.js default 404.** It is pure black (#000), English only ("This page could not be found."), with no header, no footer and no way back. This is where "Get a Quote" (every page), "Ask what's available" (empty category), and About and Contact (footer, nav) all land. On a light, premium, inquiry-first site this is the most jarring screen a customer can reach. DR C1 confirmed visually. | `/gu/contact`, `/gu/about` (status 404) | **H** |

### 2.11 `/admin`

Redirects to `/admin/login` as expected. Not reviewed further.

---

## 3. Interaction and motion review

| Element                              | What was observed                                                                                                                                                                                                              | Live?                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| Primary buttons                      | Hover lifts by 2px (`hover:-translate-y-0.5`). Pressed state is `active:scale-[0.98]` with a 200ms transform (computed). The sheen class is present. **Pressed and hover states exist and are correctly scoped to transform.** | CSS verified; the sheen sweep was not observed |
| Focus rings                          | The language button shows a clear navy pill outline. The logo shows a sharp rectangle (L10). The textarea shows a blue double ring. Tab order: skip link, logo, Home, Products, Services, About, language, CTA. Logical.       | Yes (stills)                                   |
| Products dropdown                    | Opens on click as a plain white list. The open animation could not be judged.                                                                                                                                                  | Stills                                         |
| Language switcher                    | Works both ways (`/gu` to `/` and back). It does a full navigation with no transition. Locale is sticky by cookie.                                                                                                             | Yes                                            |
| Mobile menu                          | **Broken: clipped to 80px, links overlay the page (M1).** Escape closes it.                                                                                                                                                    | Yes                                            |
| Ctrl+K search                        | Focuses the inline header search. Results and the empty state work. The popover is narrow and truncates (P6).                                                                                                                  | Yes                                            |
| Filters                              | A brand chip filters the grid. The grid has a layout animation: the single Apple card was caught mid-move in column 2, then settled in column 1. Sort is a native select, which is fine but unstyled against the glass chips.  | Stills                                         |
| Inquiry form                         | Focus styling is good. There is **no on-blur validation** (D4). Field misalignment (D3). Not submitted.                                                                                                                        | Yes                                            |
| Header on scroll                     | Landing: stays white glass, and the knot shows through it as a blue smudge (L3). Inner: dark glass turns grey over white (P4). There is no condense or shrink on scroll.                                                       | Stills                                         |
| Lenis smooth scroll                  | Active (`html.lenis`). The page kept travelling after a wheel input. Whether it feels laggy was **not observed** at 1 fps.                                                                                                     | Partly                                         |
| Marquee                              | `animate-marquee`, 38s linear, with an edge fade. Position changed between stills.                                                                                                                                             | Stills                                         |
| Pillar tilt                          | Hover tilts the panel slightly; the top edge was visibly skewed.                                                                                                                                                               | Still                                          |
| 3D hero, pointer                     | The knot pose changed after hovering in the hero. The "surge with pointer speed" effect could **not** be judged at 1 fps.                                                                                                      | Stills only                                    |
| 3D hero, scroll                      | The knot moves down and stays clipped by the hero bottom (L3). There is no fade or exit choreography.                                                                                                                          | Stills                                         |
| 3D hero, render quality              | Refraction is good. Orbs are flat discs (L1). Canvas-edge clipping (L2). No antialiasing on mobile (M3).                                                                                                                       | Stills                                         |
| 3D hero, load moment                 | **Not observed** (the pane was hidden during load). The code path is: still CSS orb, then a code-split Canvas. Needs a visible-pane check for a pop or flash when the canvas replaces the orb.                                 | No                                             |
| Scroll reveals, HeroReveal, staggers | **Not observed** (throttled).                                                                                                                                                                                                  | No                                             |
| Image loading                        | Category tile images and mobile product images appeared seconds after the layout, a visible pop-in. It may be worse than real because of throttling; verify.                                                                   | Stills                                         |
| Page transitions                     | None. Every route change is a hard cut, including the language switch.                                                                                                                                                         | Yes                                            |

---

## 4. Creative solutions, ranked by impact

Each idea respects D-021 (landing: light, white and blue plus one accent, no products, no owner photo), inquiry-first, equal weight for products and services, and the placeholder labels.

### 1. Hero scene v2: "Light through glass", finished properly (impact: highest)

- **Idea:** Keep the knot, which is the right idea, and finish the material and the stage:
  - **Orbs become real light.** Add `@react-three/postprocessing` `Bloom` with a luminance threshold, so emissive orbs glow. On lite devices, use a cheap fallback: replace the orb meshes with additive-blended radial sprite billboards. Either way, no more flat discs (L1).
  - **Stage the scene inside a larger, unclipped canvas.** Make the canvas span the full hero width behind the copy (pointer-events none), with the knot positioned right. Then nothing is ever cut by a canvas edge (L2). Fade the canvas with a CSS mask at the hero bottom instead of a hard overflow cut (L3).
  - **Scroll exit choreography.** As the hero scrolls, the knot rises, scales down and dissolves (opacity plus a transmission ramp to clear), instead of sinking into the clip.
  - **Settle-in on load.** The orbs fly in from off-frame and "ignite" the knot over about 1.2s, timed to the end of `HeroReveal`.
- **Where:** `/` hero (`src/components/hero3d/flow-scene.tsx`, `hero-scene.tsx`, `hero.tsx`).
- **Why:** The owner cares most about this moment, and it is currently undermined by three render bugs that a visitor notices.
- **Effort:** M.
- **Owner decision:** whether to add `@react-three/postprocessing` (a new pinned dependency).

### 2. Mobile hero composition: the knot behind the headline

- **Idea:** On viewports under 768px, place the canvas _behind_ the headline, top-right, partly bleeding off-screen, at about 60% opacity with the text over it. The 3D is then part of the first screen instead of 627px down (M2). Turn antialiasing back on and use DPR 1.5. The geometry, not the AA, is what costs frames.
- **Where:** `/` 375.
- **Why:** Most customers will see the site on a phone. Today they never see the signature visual without scrolling.
- **Effort:** S-M.
- **Owner decision:** none (a layout change within D-021).

### 3. A consistent product photography system ("the lit stage")

- **Idea:** One treatment for every product image:
  - background removed, sitting on the same soft blue-white gradient plinth with a contact shadow, matching the `/products` hero platform;
  - same three-quarter angle and the same crop box;
  - consistently applied via an admin "stage" preset: upload a cut-out and the site composites it.
  - Until the owner photographs stock, apply the treatment to the representative Commons photos (already licence-credited). Keep the "Representative photo" caption, and add a small caption under the card image (DR C15).
- **Where:** product cards, product detail, related, search results.
- **Why:** Imagery quality is the biggest gap between the site and reference 01 (P1, D1). No amount of glass fixes mismatched snapshots.
- **Effort:** M (pipeline plus admin preset). L if the owner shoots real stock.
- **Owner decision:** whether to commission or shoot real product photos, and approve the stage look.

### 4. Branded 404, plus Contact as a real destination

- **Idea:**
  - Replace the default 404 with an on-brand page: light field, a small static frame of the knot, translated copy, search, and the two equal paths (Browse products / Book a service).
  - Build `/contact` as a first-class page: the inquiry form, plus a store card with the existing "awaiting owner confirmation" labelling, plus a soft map placeholder (no invented address beyond what admin holds).
- **Where:** `app/[locale]/not-found.tsx`, `/contact`.
- **Why:** The most-clicked CTA currently lands on a black screen (N1).
- **Effort:** S (404), M (contact).
- **Owner decision:** contact page content. No new facts may be invented.

### 5. Signature motion system: one easing, one choreography

- **Idea:** Define three motion tokens (enter 420ms `cubic-bezier(.16,1,.3,1)`, exit 240ms, micro 160ms) and one choreography: _things arrive by rising 12px out of a soft blur_ (`filter: blur(6px)` to 0 with opacity). Apply it to section heads, cards and menus, and retire ad-hoc drift and float loops on the pillars and the closing CTA (DR C9). The brand gets one recognisable "settle" motion.
- **Where:** global (`globals.css` tokens plus a single `<Reveal>` primitive).
- **Why:** Premium sites feel premium because motion is consistent, not abundant.
- **Effort:** M.
- **Owner decision:** none, though removing ambient loops revises the D-020 exception.

### 6. Page transitions with a shared-element "glass handoff"

- **Idea:** Use the View Transitions API (Next supports it via `next/navigation` with `document.startViewTransition`; progressive, no dependency):
  - a product card's image morphs into the product detail hero;
  - a category tile expands into the category band;
  - the language switch cross-fades instead of hard-cutting;
  - under reduced motion, an instant swap.
- **Where:** cards to detail, tiles to category, the language switcher.
- **Why:** Hard cuts (section 3) are the main thing separating "nice website" from "app-grade".
- **Effort:** M.
- **Owner decision:** none.

### 7. Services scroll story: "What happens to your laptop"

- **Idea:** Turn the four-step process on `/services` into a pinned, scroll-scrubbed sequence. The left column stays pinned with a single large glass "device card" whose state changes per step: a problem note, then a diagnosis glow, then a checklist ticking, then a handover. The step list scrolls on the right with the active step highlighted. The current timeline content is reused verbatim, so no new claims are needed.
- **Where:** `/services` "How a service request works"; a lighter version on service detail.
- **Why:** Services are half the business and currently have the least storytelling. This makes "tell us the problem, we take it from there" tangible.
- **Effort:** M-L.
- **Owner decision:** none (existing copy).

### 8. Landing "two doors" pillars, rebuilt as living panels

- **Idea:** Keep the two equal pillars (business rule), but give each a purpose-built abstract motif in the hero's language, with no product imagery (D-021):
  - Products: a slowly turning stack of frosted glass slabs;
  - Services: a glass ring with a light pulse travelling round it, like a diagnostic loop.
  - On hover, the motif's light swells and the arrow travels.
  - Add the three-to-four short category names as small text inside each panel, which fills the empty 60% (L5).
- **Where:** `/` pillars.
- **Why:** The middle of the landing page is currently empty glass. This makes it the second wow moment after the hero.
- **Effort:** M (CSS 3D or a tiny shared R3F canvas).
- **Owner decision:** none.

### 9. Landing "How it works" strip with kinetic numerals

- **Idea:** A visible section reusing `servicePages.steps` (Tell us, We look, We agree, Collect or on-site). Large outline numerals fill with blue as the strip scrolls into view (CSS `animation-timeline: view()`), each with one line of copy. It adds the missing structure DR C6 asked for. Kept to one row; not three equal cards.
- **Where:** `/`, between the marquee and the pillars, or after the pillars.
- **Why:** It answers "how does this work" on the landing page, and adds a third layout family.
- **Effort:** S-M.
- **Owner decision:** none (existing copy).

### 10. Command-palette search

- **Idea:** Ctrl+K (and a tap on the search icon on mobile) opens a centred glass palette:
  - large input;
  - grouped results (Products with thumbnails on the lit stage, Services with their icons, Pages);
  - keyboard navigation;
  - an empty state with "Ask the store" linking to `/contact` with the query prefilled in the message (no auto-submit).
- **Where:** global header.
- **Why:** Fixes the truncation (P2, P6) and makes search feel like a premium tool.
- **Effort:** M.
- **Owner decision:** none.

### 11. Typography moves for Gujarati and display

- **Idea:**
  - Under `:lang(gu)`, replace the italic emphasis with a colour and weight shift plus a subtle gradient underline, cap weight at 700, and raise line-height to about 1.25 for display (G1).
  - For English, try optical tightening on the H1 (`tracking-[-0.03em]`).
  - Translate the remaining English strings (G2), and show the logo tagline at 11-12px or remove it from the footer duplicate (L7).
- **Where:** `globals.css`, `hero.tsx`.
- **Why:** Gujarati is the local trust signal, so it must look _better_ than the English, not distorted.
- **Effort:** S.
- **Owner decision:** fluent reviewer sign-off (DR C5).

### 12. Header that condenses and changes material on scroll

- **Idea:** At the top, the 80px landing header. After 40px of scroll, it condenses to a 64px floating glass pill with a soft border, detached from the edges by 12px.
- **Where:** both headers.
- **Why:** It fixes the 96px height (L4), stops the grey-over-white muddiness (P4) and the knot smudge (L3), and is a signature premium-header behaviour.
- **Effort:** S-M. The inner header should switch to an opaque navy (not translucent) when it is over a light body.
- **Owner decision:** none.

### 13. Category tiles that sit fully on the band

- **Idea:** Move the tile rail fully inside the dark band, or give tiles an opaque dark-glass base that does not wash out on white. Add a cursor-spotlight rim (already in the code for the dark tiles), and a lit "active" state: a blue under-glow and a raised plinth, instead of the faint lilac outline.
- **Where:** `/products`, categories, `/services`.
- **Why:** Fixes P3 and C1, and makes the rail a premium navigation object as in reference 01.
- **Effort:** S.
- **Owner decision:** none.

### 14. Micro-interactions with intent

- **Idea:**
  - The Send button morphs into a progress ring and then a check on submit (feedback).
  - Fields validate on blur with a soft amber or red underline and inline message (D4).
  - The arrow in CTAs slides 3px on hover.
  - "Copied" feedback if a phone number is ever shown.
  - Chips depress (`scale .97`) on tap.
  - All of it is sound-free and collapses under reduced motion.
- **Where:** forms, CTAs, chips.
- **Why:** Small, felt quality.
- **Effort:** S.
- **Owner decision:** none.

### 15. Honesty labels as a designed component

- **Idea:** One "Status tag" component: an amber-tinted glass chip with a readable dark-amber text token (DR C3 `--warning-text`) and a small info icon that opens a popover explaining _why_ ("Prices are confirmed by the store when you ask"). Always on an opaque backing, never bare text on a photo (SD1).
- **Where:** every placeholder or unverified label.
- **Why:** It turns a compliance requirement into a trust signal that looks intentional. **The labels stay; only their presentation improves.**
- **Effort:** S.
- **Owner decision:** none.

---

## 5. Quick wins (smallest changes, biggest visual payoff)

1. **Portal the mobile menu** to `document.body`, or move the header blur to a `::before` (M1). This is the difference between a working and a broken mobile site.
2. **Add bloom to the orbs, or swap them for additive glow sprites,** and widen or mask the canvas so the knot is never cut (L1-L3). Most of the hero's premium gap is these three render bugs.
3. **Ship a branded `not-found.tsx`,** and temporarily point "Get a Quote" and "Ask what's available" at the on-page inquiry forms until `/contact` exists (N1, C2).
4. **Kill the Gujarati faux-italic** with a `:lang(gu)` override in `globals.css` (G1).
5. **Fix the `/services` card overlaps:** constrain the decorative renders to a top-right box with `max-width` and reserve title padding, and give Software troubleshooting a real render or drop its placeholder square (S1, S2).
6. **Put a solid backing behind on-image honesty labels** and add a darker amber text token (SD1, DR C3).
7. **Make the product-detail image column sticky** (`lg:sticky lg:top-24`) to remove the dead half-page (D2, SD4).
8. **Align the form grid** (`items-start` plus a reserved helper-text row, or helper text spanning both columns) and set inputs to 16px on mobile (D3, D5).
9. **Widen the header search,** or shorten its placeholder to "Search", so it never truncates (P2).
10. **Turn antialiasing back on in the lite 3D path** (M3). It is a one-line change and the jagged edge is very visible on phones.

---

_Not verified in this review:_ real frame rates, reveal timing, the hero load sequence and Lenis feel (the pane was hidden, at about 1 fps). Re-run sections 2.1-2.2 and 3 with the browser pane visible, and on a mid-range Android device, before signing off motion.
