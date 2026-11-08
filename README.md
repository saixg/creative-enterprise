# CREATIVE ENTERPRISE creative enterprise

A single integrated web platform for **Creative Enterprise**, a computer and
electronics **sales and service** business in Rajkot, Gujarat.

One application , two roles ;

- **customer** — the public visitor, who explores products and services and submits
  inquiries or service requests.
- **admin** — the owner or authorised staff, who signs in at `/admin` to manage
  products, services, content, inquiries and WhatsApp campaigns.

The admin area is a protected route group **inside this same application** — not a
separate frontend, not a separate deployment. One codebase, one backend, one data
layer.

The business model is **inquiry-first**: there is no cart, checkout, payment or
shipping. The conversion action is a quote request or WhatsApp inquiry.

## Documentation

Read these before changing anything:

| Document                                                                                                                     | What it covers                                                  |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`CLAUDE.md`](CLAUDE.md)                                                                                                     | Repository instructions and the architecture invariant          |
| [`docs/project-brief/01-PRODUCT-VISION.md`](docs/project-brief/01-PRODUCT-VISION.md)                                         | **What** we are building — scope, roles, workflows              |
| [`docs/project-brief/02-DESIGN-AND-TECHNICAL-SPECIFICATION.md`](docs/project-brief/02-DESIGN-AND-TECHNICAL-SPECIFICATION.md) | Design direction, components, stack, architecture               |
| [`docs/project-brief/03-CLAUDE-WORKING-RULES.md`](docs/project-brief/03-CLAUDE-WORKING-RULES.md)                             | Mandatory operating rules for any agent in this repo            |
| [`docs/DECISIONS.md`](docs/DECISIONS.md)                                                                                     | Owner decisions; where one overrides a brief, the decision wins |

## Status

Foundation in progress. Nothing is deployed.

| Area                                | Status                           |
| ----------------------------------- | -------------------------------- |
| Project briefs and decision record  | Complete                         |
| Application scaffold                | Complete                         |
| Design tokens and shared components | Complete                         |
| Landing page                        | Implemented, tested locally      |
| Products / interior pages           | Index + detail, placeholder data |
| Admin area and authentication       | Not started                      |
| Supabase backend                    | Data model documented, not built |
| WhatsApp Cloud API                  | Not started                      |

Design assets (owner photograph, logo artwork, product imagery) are pending from the
owner; placeholders are in use and are marked as such. Product prices currently in
the repo are **placeholder values**, not verified pricing.

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000. Locale-prefixed routes: `/en` (default) and
`/gu`.

## Scripts

| Command                | Does                         |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start the development server |
| `npm run build`        | Production build             |
| `npm run start`        | Serve the production build   |
| `npm run typecheck`    | TypeScript, no emit          |
| `npm run lint`         | ESLint                       |
| `npm run format`       | Prettier write               |
| `npm run format:check` | Prettier check               |
| `npm run test`         | Vitest unit tests            |
| `npm run test:e2e`     | Playwright end-to-end tests  |

## Environment

Copy `.env.example` to `.env.local` and fill it in. See
[`docs/ENVIRONMENT_VARIABLES.md`](docs/ENVIRONMENT_VARIABLES.md). Never commit
`.env*` files, secrets or customer data.

## Tech stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS · shadcn/ui +
Radix · Lucide · Motion for React · next-intl (`en` / `gu`).

Planned for later milestones: Supabase (Postgres, Auth, Storage, RLS) · React Hook
Form + Zod · WhatsApp Cloud API.

Dependencies are installed when the milestone that needs them begins, not up front.
