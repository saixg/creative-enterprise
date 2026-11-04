# Homepage implementation plan

Maps the reference sections to real components. Follows
[`REFERENCE-ANALYSIS.md`](REFERENCE-ANALYSIS.md) and
[`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

One page, two themed halves (`docs/DECISIONS.md` D-009). Everything lives in the
existing Next.js application — no second app, no separate admin.

---

## Section map

| #   | Section             | Theme     | Component                                       | Reference | Status            |
| --- | ------------------- | --------- | ----------------------------------------------- | --------- | ----------------- |
| 1   | Header + nav        | inherits  | `SiteHeader`, `MobileNav`                       | 02        | Extend            |
| 2   | Hero                | `landing` | `Hero`, `OwnerPortrait`, `FloatingProductPanel` | 02        | Rebuild           |
| 3   | Capability row      | `landing` | `CapabilityStrip`                               | 02        | Have              |
| 4   | Dual CTA cards      | `landing` | `EntryPoints`                                   | 02        | Have              |
| 5   | Local strip + store | `landing` | `LocalStrip`, `StoreStrip`                      | 02        | Extend            |
| 6   | Featured band       | `app`     | `FeaturedBand`, `TrustIndicators`               | 01        | New               |
| 7   | Categories          | `app`     | `CategoryTiles`, `ProductCategoryCard`          | 01        | New               |
| 8   | New Arrivals        | `app`     | `ProductGrid`, `ProductCard`                    | 01        | Have              |
| 9   | Offers              | `app`     | `OffersSection`                                 | 01        | New — empty state |
| 10  | Brands              | `app`     | `BrandStrip`                                    | 01        | New               |
| 11  | Promo trio          | `app`     | `PromoCard` ×3                                  | 01        | New               |
| 12  | Services showcase   | `app`     | `ServiceShowcase`                               | brief §7  | New               |
| 13  | Why choose us       | `app`     | `WhyChooseUs`                                   | 01        | New               |
| 14  | Final CTA           | `app`     | `CTASection`                                    | brief §10 | New               |
| 15  | Footer              | inherits  | `SiteFooter`                                    | both      | Have              |

The order is deliberate: **trust → desire → utility**. The light half
establishes who the business is; the dark half sells and lets people browse.

---

## The transition (section 5 → 6)

The single most important detail, and the thing that stops this reading as two
templates glued together.

- A `TransitionBand` component: ~140px tall, a vertical gradient from the
  `landing` background into the `app` background, with the section boundary
  crossing it rather than sitting at its edge.
- The dark half's first content starts _inside_ the gradient, so the eye reaches
  it before the colour has finished changing.
- The band is **static**. Animating it would read as a rendering glitch.

---

## Theme scoping change

Until now `data-theme` sat on the route-group wrapper (`SiteChrome`). The
homepage needs both themes, so:

- Add a `ThemeSection` component: a `<section data-theme>` that also sets its
  own `background` and `foreground`.
- `SiteChrome` keeps a page-level default for header and footer.
- The `html:has([data-theme="app"])` rule in `globals.css` currently lifts the
  dark base colour to the root. With a mixed page that becomes wrong, so it
  needs narrowing to a page-level marker rather than any descendant.

**This is a real regression risk** and is verified explicitly: the homepage must
keep a light root while `/products` keeps a dark one.

---

## Data and content

| Section        | Source                           | Gap                                             |
| -------------- | -------------------------------- | ----------------------------------------------- |
| Hero copy      | `i18n/messages`                  | —                                               |
| Owner portrait | `public/images/owner-portrait.*` | Low-res crop (D-012)                            |
| Product panels | none                             | No product imagery — labelled frames            |
| Categories     | static list                      | No category imagery                             |
| New Arrivals   | `lib/catalog.ts`                 | Placeholder rows (D-003)                        |
| Offers         | none                             | **Empty state** — nothing supplied (D-011)      |
| Brands         | product brand names              | No logos; no dealer claims (D-011)              |
| Services       | static list                      | No service photography, no prices or turnaround |
| Why choose us  | static list                      | Only claims doc 02 already permits              |
| Store info     | `lib/business-info.ts`           | Unverified — behind a notice                    |

---

## Navigation

Per D-011: Products, Brands, Offers, New Arrivals, Services, About.

Brands / Offers / New Arrivals point at homepage anchors, not routes, until they
earn their own pages — a nav item that 404s is worse than one that scrolls.
Search and the wishlist stay out (D-004).

---

## Motion plan

| Section          | Motion                                                 |
| ---------------- | ------------------------------------------------------ |
| Hero             | Stagger headline → copy → CTAs, 400ms, 60ms apart      |
| Panels           | Fade + rise staggered outward, then slow ambient drift |
| Capability tiles | Reveal on scroll, 40ms stagger                         |
| Category tiles   | Hover lift + arrow nudge                               |
| Product cards    | Hover shadow and lift                                  |
| Transition band  | None, deliberately                                     |

`motion/react` only. No Three.js in this pass: there is no GLB asset and no
product photography, so a 3D scene would be an invented object rather than the
owner's actual stock. Revisit when real assets exist — doc 02 §9 requires 3D to
be justified, not decorative.

---

## Build order

1. `ThemeSection` + narrow the `:has()` root rule
2. Rebuild hero with the real portrait and panels
3. `LocalStrip`, extend store section
4. `TransitionBand`
5. Featured band + trust indicators
6. Category tiles
7. Reuse product grid for New Arrivals
8. Offers empty state, brand strip
9. Promo trio, services showcase, why-choose-us, final CTA
10. Extend navigation
11. Inspect at four widths in both locales; fix what is visibly wrong
12. Typecheck, lint, format, tests, build; commit

---

## Acceptance

- One coherent page; the transition does not read as two templates.
- The real owner's likeness is used; no generated person.
- Products and services carry equal weight.
- No invented price, rating, offer, dealer claim, turnaround or warranty.
- Every placeholder is visibly labelled.
- No raw hex in components; both themes resolve from one contract.
- No horizontal overflow at 375 / 768 / 1024 / 1440px, both locales.
- Motion respects `prefers-reduced-motion`.
- The reference screenshots are never used as page backgrounds.
