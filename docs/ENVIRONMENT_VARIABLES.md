# Environment variables

Copy `.env.example` to `.env.local` and fill in the values you need. `.env*` is
git-ignored; never commit real keys, tokens or customer data
(`docs/project-brief/03-CLAUDE-WORKING-RULES.md` §11).

A variable prefixed `NEXT_PUBLIC_` is **inlined into the browser bundle**. Anything
secret must not carry that prefix.

## In use now

| Variable               | Scope  | Required                   | Purpose                                          |
| ---------------------- | ------ | -------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | client | no (defaults to localhost) | Canonical origin for metadata and absolute links |
| `PLAYWRIGHT_BASE_URL`  | test   | no                         | Overrides the end-to-end target                  |

## Reserved — backend milestone (Supabase)

| Variable                               | Scope  | Purpose                                                                 |
| -------------------------------------- | ------ | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | client | Project URL (set in .env.local, D-018)                                  |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client | Publishable key; safe in the browser **only** because RLS constrains it |
| `SUPABASE_SECRET_KEY`                  | server | Bypasses RLS. Server-only, never logged, never in a client component    |

## Reserved — automation milestone (WhatsApp Cloud API)

| Variable                        | Scope  | Purpose                                 |
| ------------------------------- | ------ | --------------------------------------- |
| `WHATSAPP_PHONE_NUMBER_ID`      | server | Sending number identifier               |
| `WHATSAPP_ACCESS_TOKEN`         | server | Cloud API token                         |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | server | Verifies Meta's webhook handshake       |
| `WHATSAPP_APP_SECRET`           | server | Validates inbound webhook signatures    |
| `WHATSAPP_TEST_RECIPIENTS`      | server | Comma-separated authorised test numbers |

**Messaging rules apply regardless of configuration.** During development, send only
to authorised test recipients. Real campaigns need explicit owner approval each
time, and possession of a phone number is never marketing consent
(`docs/project-brief/01-PRODUCT-VISION.md` §5.2).

## If a secret leaks

Rotate it at the provider first, then remove it from the repository history. Ask the
owner before rotating credentials on anything shared or in production
(`docs/project-brief/03-CLAUDE-WORKING-RULES.md` §13).
