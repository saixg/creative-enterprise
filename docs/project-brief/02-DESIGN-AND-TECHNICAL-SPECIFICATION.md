# CREATIVE ENTERPRISE — Design & Technical Specification

**Document:** Visual design, components, motion and engineering baseline  
**Status:** Proposed baseline; approved references and owner decisions take precedence.

## 1. Design philosophy

Create a premium digital experience for a Rajkot technology sales and service business. The quality should feel as considered as a leading premium technology brand, without copying another company's website.

Principles:
- Strong visual hierarchy and typography.
- Generous, deliberate spacing.
- Beautiful, accurate product presentation.
- Services receive equal visual prominence to products.
- Purposeful motion and interaction.
- Distinctive local identity.
- Excellent responsive behaviour and accessibility.

Every visual element must serve a purpose. Do not add gradients, 3D objects, floating cards, glow or animation simply to make the page look busy.

## 2. Visual direction

> **Override — see `docs/DECISIONS.md` D-005.** The owner has approved two theme
> value sets: a light treatment on the landing page and a dark treatment on interior
> pages. The light-first guidance below describes the landing theme.

**Proposed palette — not final brand approval**

| Token | Value | Intended use |
|---|---|---|
| Midnight | `#07152F` | Dark text and selected dark sections |
| Electric blue | `#0759E8` | Primary accent |
| Cyan | `#25B8EF` | Secondary technology accent |
| Violet | `#7650E8` | Rare supporting accent |
| Warm accent | `#F0A34A` | Restrained highlights |
| Cloud | `#F6F8FC` | Light backgrounds |
| White | `#FFFFFF` | Main surfaces |
| Slate | `#667085` | Secondary text |

Use semantic design tokens such as `background`, `foreground`, `surface`, `primary`, `muted`, `border`, `success`, `warning`, `destructive` and `focus-ring`. Do not scatter arbitrary colour values across components.

A mostly neutral light interface with controlled blue accents is the initial direction. Use dark sections selectively.

## 3. Typography

Proposed:
- English: Inter or Plus Jakarta Sans.
- Gujarati: Noto Sans Gujarati.

Suggested desktop scale:
- Display: 64–88px.
- H1: 48–64px.
- H2: 36–48px.
- H3: 24–32px.
- Body: 16–18px.
- Supporting: 13–15px.

Adapt for mobile. Do not force oversized headings where they damage composition. Use `next/font` where suitable.

## 4. Customer website experience

The homepage should immediately communicate that CREATIVE ENTERPRISE is a trusted Rajkot partner for technology products **and** technical services.

Proposed homepage sequence:
1. Premium hero.
2. Two equally visible entry points: Explore Products and Explore Services.
3. Featured products.
4. Services showcase.
5. Why choose the business (only verified claims).
6. Repair/support call to action.
7. Approved new arrivals or offers.
8. Local store/contact information.
9. Footer.

### Hero direction
- Premium clean light background.
- Clear headline and short supporting copy.
- Strong primary and secondary CTAs.
- Carefully composed owner portrait if the approved reference is available.
- Product imagery integrated with a deliberate visual hierarchy.
- Subtle motion or 3D only if it improves the composition.

Potential copy direction (not final approved copy):  
**“Technology, Products & Support. All in One Place.”**

Supporting direction:  
“Your trusted technology partner in Rajkot — from the right equipment to reliable technical support.”

Do not invent claims such as years in business, authorised dealer status, awards, guarantees or customer counts.

### Owner portrait
A real owner photograph was used in earlier visual exploration. Preserve the person's likeness if that reference is available. Do not substitute a generated person. Do not materially alter identity, body or clothing. Use tasteful compositing only.

### Product imagery
Potential hero visuals include a laptop, desktop/gaming tower, headphones, GPU or accessories. Use real, properly licensed assets where possible. Avoid random floating product cutouts that obscure copy.

### Avoid

> **Override — see `docs/DECISIONS.md` D-002.** Where the approved visual reference
> and this list disagree, the reference governs. The glow and depth treatments shown
> in the approved references are permitted; the remaining items below still apply.
- Decorative glowing rings around the owner's head or waist.
- Unrelated logo-like symbols.
- Excessive glow and glassmorphism.
- Random floating UI panels.
- Overloaded gradients.
- Generic template layouts.
- Animation that competes with the message.

## 5. Product experience

Product cards may include:
- Product image.
- Brand and product name.
- Short description.
- Key verified specifications.
- Price, only when supplied and current.
- Availability, only when verified.
- Inquiry action.

Product detail pages should include clear media, specifications, useful details, related products where appropriate and a direct inquiry action.

This is inquiry-first. Do not add checkout, cart, payment or shipping features without approval.

Never invent prices, stock levels, ratings, discounts or specifications.

## 6. Service experience

Services must have dedicated, high-quality visual treatment and clear paths to inquiry.

Potential service categories (verify with owner):
- Laptop repair.
- Desktop repair.
- Screen replacement.
- Hardware diagnostics/upgrades.
- CCTV installation and repair.
- Printer repair.
- Maintenance and AMC.

A service detail page should explain the service, the problem it addresses, the request process and how to contact the business. Do not invent prices, turnaround times, warranty terms or service guarantees.

## 7. Admin experience — same application

**Critical architecture constraint:** The admin panel is a protected section of the same website/application, not a separate platform and not a separate frontend application.

Recommended route model:
- Customer routes: `/`, `/products`, `/services`, `/contact`, etc.
- Admin sign-in: `/admin/login`.
- Protected admin routes: `/admin`, `/admin/products`, `/admin/inquiries`, `/admin/services`, `/admin/content`, `/admin/campaigns`.

Use one Next.js application, shared UI/design system, shared backend and shared data model. Admin pages can have a distinct dashboard layout and navigation, but they remain part of the same application.

There are only two application roles in scope:
- `admin`
- `customer`

Do not create additional roles without approval. Multiple authorised staff may initially share the admin role if needed. Customer authentication is not confirmed; do not create customer accounts or dashboards unless the owner asks for them.

Admin UI should be clear, efficient and consistent:
- Dashboard overview.
- Product table and editor.
- Media uploader.
- Service request list and detail.
- Inquiry list and detail.
- Website content controls.
- Campaign and consent views.
- Settings where required.

The admin experience may prioritise operational clarity over marketing-page theatrics. Keep it visually consistent with the brand.

## 8. Reusable component system

Create reusable components when they provide consistency and real value.

### Global
- Site header and navigation.
- Mobile navigation.
- Language selector.
- WhatsApp contact action.
- Buttons and links.
- Footer.
- Section heading.
- Breadcrumbs.

### Marketing
- Hero.
- Product showcase.
- Service showcase.
- Feature grid.
- CTA banner.
- Store information.
- Testimonials only when genuine and approved.

### Products
- Product card and grid.
- Product gallery.
- Specification list/table.
- Product inquiry form.
- Verified availability indicator.

### Services
- Service card.
- Service detail layout.
- Service request form.
- Request status display if implemented.

### Admin
- Admin shell/sidebar.
- Dashboard metrics.
- Data tables.
- Search/filter controls.
- Product editor.
- Media uploader.
- Inquiry/request status controls.
- Campaign builder.
- Consent/opt-out management.
- Dialogs and confirmation flows.
- Toast notifications.
- Loading, empty and error states.

Use shadcn/ui and Radix primitives as a foundation where appropriate. Customise them; do not leave the result looking like an untouched component-library demo. Use Lucide icons consistently.

## 9. Motion and animation

Animation should improve understanding, hierarchy or perceived quality. It must never obstruct navigation or hide essential information.

### Motion for React
Package: `motion`, import from `motion/react`.

Use for:
- Section reveals.
- Small entrance transitions.
- Hover and focus feedback.
- Product card interactions.
- Navigation and drawer transitions.
- Layout changes.
- Restrained parallax.
- Button micro-interactions.

Use restrained durations and consistent easing. Avoid excessive bounce, long blocking sequences and scroll-jacking.

### Three.js / React Three Fiber
Potential packages:
- `three`
- `@react-three/fiber`
- `@react-three/drei`

Use selectively for:
- One carefully composed hero visual.
- Approved logo animation.
- Selected product visualisation.

Do not make every section 3D. Do not turn the website into a 3D showcase.

Use GLB/GLTF assets, optimised textures, controlled lighting and appropriate camera composition. Lazy-load scenes and avoid multiple heavy scenes at once. Stop or reduce rendering when idle where possible.

Provide a high-quality static or lightweight fallback for low-power/mobile devices. Respect `prefers-reduced-motion`. Essential content must never depend on animation.

### Logo
Previous exploration included a pixel-dissolving C, an infinity ribbon and Rajkot heritage/technology references. These are concepts, not approved final artwork.

Do not select a final logo without owner approval. Rebuild the approved mark as clean SVG and reusable React component. Generate favicon and social variants. Avoid using an AI-generated raster screenshot as the final logo. Validate Gujarati text with a fluent speaker.

## 10. Bilingual support

Use `next-intl` or a suitable maintained internationalisation solution.

Locales:
- `en` — English, default.
- `gu` — Gujarati.

Use translation dictionaries and locale-aware routing. Do not hardcode interface text throughout components. Check Gujarati typography, wrapping, navigation, forms and mobile layouts. Machine translation must be reviewed before publication.

## 11. Technical stack — proposed baseline

Verify current stable versions and peer compatibility before installation.

### Application
- Next.js App Router.
- React.
- TypeScript strict mode.
- Tailwind CSS.
- shadcn/ui and Radix primitives.
- Lucide React.

### Visuals
- Motion for React.
- Three.js.
- React Three Fiber.
- Drei.

### Backend
- Supabase PostgreSQL.
- Supabase Auth.
- Supabase Storage.
- Supabase SSR integration.
- Row Level Security.

### Forms and validation
- React Hook Form.
- Zod.
- `@hookform/resolvers`.

### Client/server state
- TanStack Query where server-state caching is useful.
- Zustand only if a genuine shared client-state requirement exists.

### Utilities
- date-fns.
- Sonner.

### Internationalisation
- next-intl.

### Testing and quality
- TypeScript strict checks.
- ESLint.
- Prettier.
- Vitest.
- React Testing Library.
- Playwright.

### Automation
- Official WhatsApp Cloud API.
- Server-side webhook processing.
- Queue-based campaign sending.
- BullMQ and Redis only if a dedicated worker/queue is justified by the actual deployment architecture.

Do not install every package immediately. Add dependencies when their implementation phase requires them.

## 12. Application architecture

Recommended starting point:

```text
creative-enterprise/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (customer)/
│   │   │   └── admin/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── marketing/
│   │   ├── products/
│   │   ├── services/
│   │   └── admin/
│   ├── features/
│   │   ├── products/
│   │   ├── inquiries/
│   │   ├── service-requests/
│   │   ├── content/
│   │   └── whatsapp/
│   ├── lib/
│   ├── types/
│   └── i18n/
├── supabase/
│   └── migrations/
├── public/
├── design-references/
├── docs/
├── CLAUDE.md
├── package.json
└── README.md
```

This is a suggested structure, not a rigid mandate. Inspect the existing repository before changing it. Keep one deployable Next.js application unless the owner explicitly approves a different architecture.

## 13. Authentication and authorisation

Use Supabase Auth or another explicitly approved authentication provider.

- Admin signs in through `/admin/login`.
- Admin routes require authenticated admin role.
- Customer is the public/customer-facing role.
- Do not expose admin functions to unauthorised users.
- Enforce permissions on the server and in database policies; hiding UI is not security.
- Use secure session handling and appropriate middleware/server checks.
- Do not assume a customer login/dashboard is required.

Do not allow users to self-assign the admin role. Admin provisioning must be controlled and documented.

## 14. Data architecture

Likely entities:
- Products.
- Product categories.
- Brands.
- Product media.
- Inventory/availability records.
- Services.
- Service requests.
- Customers or inquiry contact records.
- Inquiries.
- Campaigns.
- Campaign recipients.
- Consent records.
- Message templates.
- Conversations and messages.
- Admin users / role metadata.
- Audit logs.

Design the schema from confirmed workflows. Use migrations, foreign keys, server-side validation, appropriate indexes, RLS and audit history for sensitive operations. Avoid collecting customer data that is not needed.

## 15. WhatsApp integration

Use the official WhatsApp Cloud API. Do not claim a mock is a live integration.

Implement:
- Webhook verification and signature/validity checks as required.
- Inbound message processing.
- Outbound message sending.
- Approved templates where required.
- Delivery status updates.
- Retry and failure handling.
- Campaign queueing.
- Consent and opt-out enforcement.
- Human escalation.

Keep secrets server-side. Never expose tokens in client bundles, Git, browser logs or user-facing error messages. Never send real campaigns without explicit owner approval.

## 16. Media and performance

Images:
- Use WebP/AVIF where appropriate.
- Use responsive image sizing and Next.js image optimisation.
- Avoid unnecessarily large assets.
- Use consistent image ratios.

Video:
- Compress MP4/WebM.
- Provide poster images.
- Lazy-load.
- Never autoplay sound.
- Make mobile playback intentional.

3D:
- Lazy-load.
- Compress models and textures.
- Provide static fallbacks.
- Avoid loading several expensive scenes simultaneously.

## 17. Responsive design and accessibility

Design mobile-first and test phone, tablet, laptop and large desktop sizes.

Check:
- No horizontal overflow.
- No clipped text.
- Usable mobile navigation.
- Appropriate tap targets.
- Product grid behaviour.
- Responsive Gujarati text.
- Form usability.
- Loading and error states.

Use semantic HTML, keyboard navigation, labels, visible focus states, sufficient contrast, meaningful alt text and reduced-motion support.

Performance targets: aim for Lighthouse 90+ performance and 95+ accessibility/SEO, then measure actual production behaviour. These are goals, not guarantees.

## 18. Development sequence

1. Inspect repository and establish environment.
2. Confirm design references and brand direction.
3. Build design tokens and shared components.
4. Build customer-facing website.
5. Build admin area inside the same application.
6. Implement authentication and server-side role checks.
7. Connect shared database and storage.
8. Implement product publishing and service requests.
9. Integrate WhatsApp and consent controls.
10. Implement automation, human escalation and analytics.
11. Test, optimise and deploy.

Do not build advanced 3D before the basic responsive experience and design system are stable.

---

This document defines the proposed **DESIGN AND ENGINEERING DIRECTION**. Product scope is in `01-PRODUCT-VISION.md`. Mandatory agent rules are in `03-CLAUDE-WORKING-RULES.md`.
