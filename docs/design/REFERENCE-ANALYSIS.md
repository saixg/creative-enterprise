# Reference analysis

Reverse-engineering of the two supplied design references into a single design
intent. Source files live in [`design-references/`](../../design-references).

| File                                              | Role                                                     |
| ------------------------------------------------- | -------------------------------------------------------- |
| `reference-02-owner-hero.jpg` (1600×900)          | Brand and identity direction — the homepage's upper half |
| `reference-01-product-storefront.jpg` (1536×1024) | Product discovery direction — the homepage's lower half  |
| `reference-03-brand-logo.jpg` (764×1024)          | Logo exploration — **not approved artwork**              |

Per `docs/DECISIONS.md` D-009 these become **one** homepage, not two designs.

---

## 1. Why each reference works

**Reference 02** works because it is a _person-first_ composition. The owner is
the focal point, placed on the optical right where the eye lands after reading
the headline. Products orbit him in glass panels at three depths, which reads as
"this man and his shop handle all of this" rather than as a product collage. The
background is a near-white field with a cool blue wash in the upper right —
light enough that dark type carries, tinted enough that the glass panels have
something to refract.

**Reference 01** works because it _inverts_ that. Dark, cinematic, product-first,
with a single hero product lit from beneath by a glowing ellipse. It then
transitions deliberately to a light catalogue surface where browsing is easy.
The dark band sells; the light band informs.

**The combined intent:** trust first (a real local person), then desire (the
cinematic product band), then utility (the light catalogue). That ordering is
the design argument, and it is what the homepage must reproduce.

---

## 2. Section-by-section breakdown

### Reference 02 — upper homepage

| Element        | Observation                                                                                                                         | What we reproduce                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Header         | Full-width, translucent over the hero wash. Logo + wordmark left, centred nav, utilities right. Pill-shaped active state on "Home". | Yes, with our own nav set                        |
| Trust badge    | Pill, two segments divided by a hairline: shield + "Rajkot's Trusted IT Partner", then pin + postal code                            | Yes — postal code only once verified             |
| Headline       | Two lines. Line 1 regular weight, line 2 heavy **and italic** in brand blue, with a hand-drawn underline swoosh                     | Yes, including the swoosh                        |
| Sub-copy       | Single line, bullet-separated verbs, ~55 characters per line                                                                        | Yes                                              |
| Capability row | Six icon tiles, 2 lines of label, evenly spaced, no cards                                                                           | Yes                                              |
| CTAs           | Filled primary + outlined secondary, both pill, both with leading icons                                                             | Yes                                              |
| Owner          | Real photograph, arms crossed, cut out, standing _in front of_ the product panels                                                   | Yes — cropped from this reference (D-012)        |
| Product panels | 6 glass tiles at 3 depth levels, soft blue glow, rotated slightly off-axis                                                          | Yes, as placeholder frames until imagery arrives |
| Dual CTA cards | Dark card + light card, side by side, arrow affordance bottom-right                                                                 | Yes                                              |
| Local strip    | Gujarati tagline + clock-tower line art, then store facts in three columns                                                          | Yes — facts gated on verification                |

### Reference 01 — lower homepage

| Element              | Observation                                                                            | What we reproduce                           |
| -------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| Dark hero band       | Near-black with violet/blue bloom, hero laptops on a glowing elliptical platform       | Yes, as the "featured" band                 |
| Carousel dots/arrows | Three dots, side arrows                                                                | **No** — carousels deferred (D-004)         |
| Trust row            | Four icon + label pairs under the CTAs                                                 | Yes                                         |
| Category tiles       | Five wide tiles, product image right, title left, arrow bottom-right, dark glass       | Yes                                         |
| Light transition     | Dark band fades into light catalogue over ~120px                                       | Yes — the key move                          |
| New Arrivals         | Four cards, white, image top, badge top-left, specs line, price, WhatsApp quote button | Yes                                         |
| Promo trio           | Custom PC Builds / Repair (with video play) / Why Choose Us                            | Yes — minus the video, which does not exist |

---

## 3. Colour system

Sampled from the references and reconciled with doc 02 §2's palette.

**Light environment (reference 02)**

- Page: `#FFFFFF` drifting to `#F6F8FC`, with a cool wash at upper-right
- Type: `#07152F` primary, `#667085` secondary
- Accent: `#0759E8`, lifting to `#25B8EF` in glows
- Glass panels: white at ~60% over the wash, 1px `#E4E9F2` border

**Dark environment (reference 01)**

- Page: `#07080F` to `#0B0D16`
- Surfaces: `#12141E`, raised `#1A1D29`
- Borders: `#262A38`
- Accent: violet `#7650E8` into blue `#2F73FF`; the hero bloom is violet-dominant
- Type: `#F6F8FC` primary, `#9AA1B4` secondary

Both already exist as the `landing` and `app` token sets. **No new colours are
introduced** — this analysis confirmed the existing tokens rather than expanding
them.

---

## 4. Typography

- Headlines are tight: roughly `-0.02em` tracking, ~1.05 line-height, weight 600–700.
- The emphasis line is _italic_ — unusual for a tech brand and a large part of
  the reference's character. Worth keeping.
- Body sits at 16–18px, ~1.6 line-height, measure capped around 60 characters.
- Nav and buttons are 14px, medium weight, generous horizontal padding, fully
  rounded.
- Labels under the capability icons are 12–13px across two lines — they must not
  be allowed to reflow to three.

Inter for English, Noto Sans Gujarati for Gujarati, both already wired.

---

## 5. Product image treatment

- Products are shot or composited on transparent/dark backgrounds, never in a
  photographic scene.
- Consistent three-quarter angles; laptops open ~105°.
- Every product sits above a soft contact shadow — this is what stops them
  looking pasted on.
- Card images use a 4:3 frame with the product inset, not bleeding to the edge.
- In the dark band, products are rim-lit from beneath by the accent colour.

**We have none of this imagery.** Until it arrives, product slots render as
labelled placeholder frames at the correct ratios, so swapping real images in is
a drop-in change and the layout does not shift.

---

## 6. Component inventory

Derived from both references:

`SiteHeader` · `DesktopNavigation` · `MobileNavigation` · `LanguageSwitcher` ·
`Logo` · `Button` · `TrustBadge` · `HeroHeadline` · `OwnerPortrait` ·
`FloatingProductPanel` · `CapabilityTile` · `DualCtaCards` · `LocalStrip` ·
`StoreInformation` · `FeaturedBand` · `TrustIndicators` · `ProductCategoryCard` ·
`ProductCard` · `ProductGrid` · `SectionHeading` · `PromoCard` · `ServiceShowcase` ·
`WhyChooseUs` · `CTASection` · `SiteFooter`

---

## 7. Animation opportunities

Where motion earns its place:

| Moment                | Treatment                                                               |
| --------------------- | ----------------------------------------------------------------------- |
| Hero entrance         | Headline, copy and CTAs stagger up ~16px over 400ms, 60ms apart         |
| Product panels        | Fade + 12px rise, staggered outward from the owner                      |
| Panel idle            | Very slow vertical drift (±4px, 6s), different phase per panel          |
| Section reveals       | Single 20px rise + fade on scroll, once, never repeating                |
| Cards                 | 150ms shadow and 2px lift on hover; arrow nudges 2px                    |
| Dark→light transition | Static gradient, **not** animated — motion there would read as a glitch |

All of it disabled under `prefers-reduced-motion`, which the global stylesheet
already enforces.

---

## 8. Responsive adaptation

The references are desktop compositions. The hero does not survive naive
shrinking — the owner and six panels cannot share a phone screen.

- **Desktop (≥1024px)** — full two-column hero, all six panels, five category tiles across.
- **Tablet (768–1023px)** — hero becomes a single column with the owner above the copy at reduced height; panels drop to three; categories to three across.
- **Mobile (<768px)** — owner portrait becomes a compact framed image above the headline; panels drop to a 2×2 of the most relevant products; capability tiles become a 2-column grid; categories scroll horizontally; product grid is single-column; CTAs stack full width.

---

## 9. Asset requirements

**Have:** the owner's likeness (cropped from reference 02, low resolution).

**Missing — must be supplied, never invented:**

1. Original owner photograph, ideally cut out on transparency
2. Product photography: laptop, desktop/gaming tower, GPU, headphones, printer, CCTV camera
3. Per-product catalogue images
4. Final logo artwork as SVG
5. The Rajkot clock-tower line art
6. Repair/technician photography for the services section
7. Real store address, hours and contact details
8. Real offers, if any
9. The source of any satisfaction rating

---

## 10. What to reproduce, improve, and not copy

**Reproduce:** the owner-first composition; the italic emphasis headline with
swoosh; the six-icon capability row; the glass product panels; the dark→light
transition; the category tile shape; the card anatomy.

**Improve:**

- The reference nav is crowded (9 items plus 5 utilities). Trim to what has a destination.
- Reference 01's card prices sit tight against the button; give that row breathing room.
- Contact shadows in reference 02 are inconsistent between panels; standardise.
- Neither reference shows a focus state. Ours must.
- Neither shows an empty state. Offers needs one.

**Do not copy:**

- The "4.9/5 Customer Satisfaction" figure — a ratings claim with no source.
- Store address and hours — unverified.
- Any brand logo implying an authorised-dealer relationship (D-011).
- The video play button — no video exists.
- The carousel arrows and dots, the wishlist heart, the ⌘K search (D-004).
- The reference screenshots themselves. They are references; they are never the page.
