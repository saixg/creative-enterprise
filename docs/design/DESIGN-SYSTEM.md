# Design system

The contract every component obeys. Derived in
[`REFERENCE-ANALYSIS.md`](REFERENCE-ANALYSIS.md), implemented in
[`src/app/globals.css`](../../src/app/globals.css).

**The one rule:** components reference _semantic tokens_, never raw colour
values. A grep for hex literals under `src/components` and `src/app` must come
back empty. That is what lets one component tree serve two themes.

---

## 1. Themes

One token contract, two value sets, selected by `data-theme`
(`docs/DECISIONS.md` D-005):

| Theme     | Where                                       | Character                          |
| --------- | ------------------------------------------- | ---------------------------------- |
| `landing` | Homepage upper half, light sections         | Near-white, cool wash, blue accent |
| `app`     | Homepage catalogue band, all interior pages | Near-black, violet/blue accent     |

Since D-009 the homepage carries both, so **theme scoping is per section**, not
per page. A section opts in by setting `data-theme` on its own wrapper; it must
also set its own background, or it will sit on the parent theme's.

---

## 2. Colour tokens

| Token               | `landing` | `app`     | Use                                         |
| ------------------- | --------- | --------- | ------------------------------------------- |
| `background`        | `#FFFFFF` | `#07080F` | Page field                                  |
| `background-subtle` | `#F6F8FC` | `#0B0D16` | Alternating bands                           |
| `surface`           | `#FFFFFF` | `#12141E` | Cards, panels                               |
| `surface-muted`     | `#F6F8FC` | `#1A1D29` | Image wells, insets                         |
| `surface-inverse`   | `#07152F` | `#FFFFFF` | Inverted cards                              |
| `foreground`        | `#07152F` | `#F6F8FC` | Primary text                                |
| `muted`             | `#667085` | `#9AA1B4` | Secondary text                              |
| `primary`           | `#0759E8` | `#2F73FF` | Primary action, emphasis                    |
| `primary-hover`     | `#0548C2` | `#4D87FF` | Hover                                       |
| `accent`            | `#25B8EF` | `#7650E8` | Secondary accent, badges                    |
| `accent-soft`       | `#7650E8` | `#25B8EF` | Tertiary accent                             |
| `warm`              | `#F0A34A` | `#F0A34A` | **Placeholder and unverified markers only** |
| `border`            | `#E4E9F2` | `#262A38` | Hairlines                                   |
| `border-strong`     | `#CDD6E6` | `#353B4D` | Emphasised edges                            |
| `focus-ring`        | `#0759E8` | `#25B8EF` | Focus outline                               |

`success` `warning` `destructive` exist for forms and admin.

**`warm` is reserved.** It means "this content is not verified". Never use it
decoratively — the moment it appears elsewhere, the placeholder signal dies.

---

## 3. Typography

Inter (English) and Noto Sans Gujarati (`:lang(gu)`), both via `next/font`.

| Role     | Size      | Weight  | Tracking         | Leading |
| -------- | --------- | ------- | ---------------- | ------- |
| Display  | 40 → 72px | 600     | −0.02em          | 1.05    |
| H1       | 36 → 60px | 600     | −0.02em          | 1.1     |
| H2       | 28 → 36px | 600     | −0.01em          | 1.2     |
| H3       | 20 → 24px | 600     | normal           | 1.3     |
| Body L   | 18px      | 400     | normal           | 1.6     |
| Body     | 16px      | 400     | normal           | 1.6     |
| Small    | 14px      | 400–500 | normal           | 1.5     |
| Label    | 12–13px   | 500     | 0.02em           | 1.4     |
| Overline | 11–12px   | 600     | 0.2em, uppercase | 1.4     |

**Emphasis headline:** the second line is italic, weight 600, in `primary`, with
the hand-drawn swoosh beneath. This is the brand's signature move — keep it.

Prose is capped at ~60 characters (`max-w-xl`). Headlines use `text-balance`,
paragraphs `text-pretty`.

---

## 4. Spacing and grid

4px base. Prefer 4 · 6 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96.

- Container `max-w-7xl` (1280px), gutters 16 / 24 / 32px by breakpoint.
- Section rhythm: 64px mobile, 80px tablet, 96–112px desktop.
- Grid gaps: 12px tight, 16px cards, 24–48px layout columns.

| Breakpoint | Width   | Hero                  | Categories        | Product grid |
| ---------- | ------- | --------------------- | ----------------- | ------------ |
| base       | <640px  | 1 col, portrait above | horizontal scroll | 1 col        |
| `sm`       | ≥640px  | 1 col                 | 2 col             | 2 col        |
| `md`       | ≥768px  | 1 col, reduced panels | 3 col             | 2 col        |
| `lg`       | ≥1024px | 2 col, full panels    | 5 col             | 4 col        |
| `xl`       | ≥1280px | 2 col, max container  | 5 col             | 4 col        |

---

## 5. Radius, borders, elevation

Radius: `full` for buttons, pills and badges; `3xl` (24px) for cards and panels;
`2xl` (16px) for tiles and inputs; `xl` (12px) for small chips.

Borders are 1px `border`, lifting to `border-strong` on hover or emphasis.

| Token                                | Use                          |
| ------------------------------------ | ---------------------------- |
| `shadow-card`                        | Resting cards                |
| `shadow-raised`                      | Hover, modals, raised panels |
| `shadow-glow` / `glow-primary`       | Primary accent bloom         |
| `shadow-glow-accent` / `glow-accent` | Secondary bloom              |

**On glow (D-002, reaffirmed D-010):** permitted, because the approved
references use it. It is applied through the `.glow-primary` / `.glow-accent`
utilities only — never as an ad-hoc `box-shadow` in a component. Budget: at most
two glowing elements per viewport. Glow is punctuation, not texture.

Glass surfaces: `surface` at 60–70% opacity plus `backdrop-blur-md` and a 1px
border. Used for floating product panels and the header only.

---

## 6. Components

**Buttons** — pill. `primary` filled with glow; `secondary` surface with border
and card shadow; `ghost` transparent; `inverse` for dark-on-light cards. Sizes
`sm` 36px, `md` 44px, `lg` 52px. Icons 16px, leading for descriptive, trailing
for directional. A navigating control is an `<a>`, never a `<button>`.

**Cards** — `surface-card` utility: `surface` background, 1px border,
`shadow-card`. Hover lifts to `shadow-raised` over 150ms. A card whose whole
area is a link uses one real anchor with `after:absolute after:inset-0`, so
there is exactly one tab stop.

**Product card** — 4:3 image well on `surface-muted`; badges top-start; brand
overline; name as the anchor; spec line in `muted`; price row with the action
right. Unverified price gets a `warm` label beneath; absent price reads "price
on request".

**Category tile** — wide, title start, image or icon end, arrow bottom-end,
whole tile is the link.

**Floating product panel** — glass, slight rotation (≤4°), contact shadow, slow
idle drift. Three depth levels via scale 1.0 / 0.92 / 0.84 and decreasing
opacity.

**Badges** — `New` uses `accent`; `Placeholder` uses `warm`. Both pill, 12px, 600.

**Empty state** — icon, one sentence saying what is missing, and who supplies
it. Required for Offers (D-011).

---

## 7. Motion

| Token           | Value                            |
| --------------- | -------------------------------- |
| Instant         | 120ms                            |
| Fast            | 180ms — hover, focus             |
| Base            | 240ms — most transitions         |
| Slow            | 400ms — entrances                |
| Ambient         | 6000ms — idle drift              |
| Standard easing | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Stagger         | 60ms                             |

Rules: animate `transform` and `opacity` only. Reveal once — never on every
scroll pass. Never delay interaction. No scroll-jacking, no parallax beyond
~20px, no looping animation in the reading path except the ambient panel drift.
Everything collapses to a static state under `prefers-reduced-motion`, enforced
globally in `globals.css`.

---

## 8. Accessibility

- Visible focus on every interactive element — `focus-ring`, 2px, 2px offset.
- Body text meets 4.5:1 in both themes; `muted` on `background` was checked in both.
- Tap targets ≥44px.
- One `<h1>` per page; heading levels never skip.
- Icons are `aria-hidden`; their meaning lives in adjacent text or `sr-only`.
- Decorative images get `alt=""`; the owner portrait gets a real description.
- Skip link first in the DOM.

---

## 9. Content integrity

Part of the design system, because it has visual consequences:

- Unverified business facts render behind a `warm` notice, or not at all.
- Placeholder records carry a visible `Placeholder` badge.
- A missing price reads "price on request" — never ₹0, never a guess.
- An action with no working destination is **disabled and explains why**, rather
  than silently doing nothing.
- No ratings, awards, dealer claims, turnaround times or warranty terms appear
  anywhere until the owner supplies them.
