# CREATIVE ENTERPRISE — Repository Instructions

Before making changes, read these mandatory project documents:

1. `docs/project-brief/01-PRODUCT-VISION.md`
2. `docs/project-brief/02-DESIGN-AND-TECHNICAL-SPECIFICATION.md`
3. `docs/project-brief/03-CLAUDE-WORKING-RULES.md`
4. `docs/DECISIONS.md` — owner decisions, including ones that override the briefs

## Architecture invariant

There is ONE application with TWO user roles: `admin` and `customer`.

The admin panel is a protected area inside the same website/application (for example, `/admin`). It is NOT a separate platform or separate frontend application. Use one shared codebase, backend and business data layer unless the owner explicitly approves a change.

Products and services have equal business importance. The website is inquiry-first; do not add checkout/payment functionality without approval.

## Operating rule

Do not assume, hallucinate, invent requirements or drift from the documented product direction. Inspect before changing, ask about material ambiguity, test meaningful changes and report only verified results.

Re-read the three project documents before every major development phase. If any instruction conflicts with them, stop and ask the owner.
