# CREATIVE ENTERPRISE — Product Vision & Requirements

**Document:** Foundational product specification  
**Business:** CREATIVE ENTERPRISE  
**Location:** Rajkot, Gujarat, India  
**Status:** Working source of truth; owner confirmation is required for items marked proposed or open.

## 1. What we are building

We are building one integrated digital platform for CREATIVE ENTERPRISE: a premium customer-facing website with a secure administrator area inside the **same application**.

There are two user roles:

1. **Admin** — the business owner or authorised staff member who signs in to manage the website and business operations.
2. **Customer** — the public-facing user who visits the website to explore products and services, contact the business, and submit inquiries or service requests.

**The admin panel is not a separate platform, separate product, or separate application.** It is a protected area of the same website, reached through an admin login and role-based access control. The customer experience and admin experience share the same application, backend and business data.

Do not create separate storefront and admin Next.js applications unless the owner explicitly changes this decision.

## 2. Business understanding

CREATIVE ENTERPRISE is a computer and electronics sales and service business in Rajkot.

Its two business pillars are equally important.

### 2.1 Product sales

The business deals with products such as laptops, desktops, computer components, graphics cards, processors, monitors, keyboards, mice, accessories, printers, CCTV equipment and other IT/electronics products.

Customers should be able to discover products, review available information and contact the business to enquire.

**Business model: inquiry-first.** This is not currently an e-commerce checkout project. Do not add cart, payment, shipping or checkout functionality without explicit approval.

### 2.2 Services and technical support

Services deserve equal prominence with product sales. Do not treat services as a small footer link or secondary afterthought.

Potential service categories include:
- Laptop and desktop repair
- Laptop screen replacement
- Hardware diagnostics and upgrades
- Software troubleshooting
- CCTV installation, repair and maintenance
- Printer repair
- Computer maintenance
- Annual maintenance contracts (AMC)
- Ongoing technical support

These are candidate categories. Confirm the exact services, pricing, warranty terms, turnaround promises and coverage with the owner before publishing them as facts.

## 3. The two experiences inside one platform

### 3.1 Customer experience

> **Settled — see `docs/DECISIONS.md` D-006.** Customer authentication is out of
> scope. No customer accounts, sign-in or dashboard.

The public-facing website should:
- Establish trust and communicate the business identity.
- Present products and services with equal importance.
- Support product discovery and product inquiries.
- Explain services and accept service requests.
- Showcase selected products, new arrivals and approved offers.
- Make contact and WhatsApp inquiry easy.
- Display accurate business and store information.
- Support English and Gujarati.

Potential public sections:
1. Home
2. Products and product detail
3. Services and service detail
4. About
5. Contact / store information
6. Product inquiry and service request flows
7. Privacy and relevant legal pages

The customer role means the public customer experience. Do not assume customer accounts, passwords, order history or a customer dashboard are required. Ask before adding customer authentication or account features.

### 3.2 Admin experience — inside the same application

The admin signs in through an admin login and accesses protected admin routes, for example `/admin`.

Admin capabilities may include:

**Products**
- Create, edit, publish and unpublish products.
- Upload product images and videos.
- Manage categories and brands.
- Maintain product details, specifications and prices where supplied.
- Manually update inventory/availability.
- Feature selected products.

**Services and requests**
- Manage service descriptions and categories.
- View customer service requests.
- Update request status.
- Record relevant follow-up information.

**Website content**
- Manage homepage content, banners and announcements.
- Feature products and services.
- Update approved business information.
- Manage selected content without editing source code.

**Inquiries and customer communication**
- View product inquiries.
- View service inquiries.
- Review customer details submitted for those inquiries.
- Track inquiry status.
- Escalate conversations to a human.

**WhatsApp**
- Create and review campaigns.
- Select eligible recipients.
- Manage approved templates.
- View delivery and response status.
- Handle opt-outs and consent records.

**Overview**
- View useful product inquiry, service request and campaign metrics.

Build only the necessary MVP workflows first. Avoid turning the admin area into an oversized ERP or generic CRM.

## 4. One application, two roles — mandatory architecture decision

The application has one shared codebase and one shared business data layer.

Recommended direction:
- One Next.js application using the App Router.
- Public/customer routes for the website.
- Protected `/admin` route group or equivalent admin section.
- One authentication system with role-based authorisation.
- One shared database and storage layer.
- Server-side checks for every privileged operation.

Suggested route shape (illustrative, refine as needed):
- `/` — customer homepage
- `/products` — product catalogue
- `/products/[slug]` — product detail
- `/services` — services
- `/services/[slug]` — service detail
- `/contact` — contact
- `/admin/login` — admin sign-in
- `/admin` — protected admin dashboard
- `/admin/products` — product management
- `/admin/services` — service and request management
- `/admin/inquiries` — inquiries
- `/admin/content` — website content
- `/admin/campaigns` — WhatsApp campaign management

These are proposed route names, not a demand to implement every route immediately.

Only two application roles are in scope:
- `admin`
- `customer`

Do not invent additional roles such as super-admin, vendor, technician, manager or editor without owner approval. If multiple staff accounts are needed, they can initially share the admin role, with more granular permissions considered later.

A public visitor can use customer-facing functionality without necessarily creating an account. Whether customers need sign-in is an open product decision.

## 5. Automation engine

The automation is part of the same business platform and backend. It is not another customer-facing platform.

The goal is to connect website data, admin workflows and WhatsApp.

### 5.1 WhatsApp capabilities
- Official WhatsApp Cloud API integration.
- Approved templates where required.
- Campaign orchestration and queueing.
- Consent and eligibility checks.
- Inbound webhook processing.
- Delivery status tracking.
- Product/service information responses.
- Human escalation.
- Inquiry creation from conversations.

### 5.2 Consent and privacy

The business has an existing WhatsApp customer list of 2,000+ contacts. Having a phone number does **not** establish marketing consent.

The system must support:
- Recorded consent and its source/time where available.
- Marketing eligibility checks.
- Opt-out processing and suppression.
- Approved templates and applicable Meta policies.

Never send bulk marketing messages simply because contacts exist. Use authorised test recipients during development. Real campaigns require explicit owner approval.

## 6. Key end-to-end workflow: Publish & Promote

1. Admin signs in to the same website.
2. Admin creates or edits a product.
3. Admin uploads product media and enters verified details.
4. Admin saves and chooses **Publish & Promote**.
5. The product becomes visible on the customer-facing website.
6. The system separately creates a campaign draft or send job.
7. The system checks recipient consent and eligibility.
8. Eligible test recipients are queued.
9. WhatsApp sends an appropriate approved message.
10. A customer asks a question.
11. The system retrieves current product information from the shared database.
12. It responds only with verified information.
13. If uncertain or asked for a human, it creates/escalates an inquiry.
14. Admin sees the inquiry in the same admin area.

**Failure isolation:** Website publication must not fail just because WhatsApp is unavailable. Publish the product independently; show campaign status and errors separately.

## 7. Service request workflow

1. Customer opens a service page.
2. Customer selects a service and submits a request.
3. The request is stored in the shared backend.
4. Admin sees it in the protected admin area.
5. Admin reviews and updates its status.
6. The customer can be contacted through an appropriate channel.
7. The request history remains available to authorised admins.

## 8. Brand and local identity

The brand should feel premium and technologically capable while remaining approachable and locally relevant to Rajkot.

Language:
- English default.
- Gujarati alternative.
- Use professionally reviewed Gujarati translations.
- Use Noto Sans Gujarati or a suitable Gujarati typeface.
- Do not publish unreviewed machine translations.

Use verified business address, opening hours, contact details and service claims only. Confirm details with the owner before publishing.

## 9. Five-day client demonstration target

> **Withdrawn — see `docs/DECISIONS.md` D-007.** The five-day deadline no longer
> applies. The ordering below remains useful; the calendar target does not.

- **Day 1:** Present landing-page visual concept and direction.
- **Day 2:** Deliver a responsive, interactive customer homepage.
- **Day 3:** Present the branding system and reusable creative assets.
- **Day 4:** Demonstrate admin login within the same application, product creation/editing and publication to the customer website.
- **Day 5:** Demonstrate the Publish & Promote workflow, authorised WhatsApp test messaging, inbound response and inquiry appearing in admin.

This is a demonstration target, not permission to fake integrations or skip security. WhatsApp production onboarding and template approvals may take longer; use a legitimate test environment if necessary.

## 10. Priorities

1. Correct business understanding.
2. Premium brand and customer website.
3. Equal prominence for sales and services.
4. Responsive customer inquiry and service request flows.
5. Secure admin login inside the same application.
6. Admin product/content management.
7. Shared database and publishing workflow.
8. WhatsApp integration and consent controls.
9. Automation, human escalation and analytics.

## 11. Explicitly out of scope unless approved

- Separate admin application/platform.
- Multi-vendor marketplace.
- E-commerce cart and payment checkout.
- Shipping and fulfilment platform.
- Generic CRM SaaS.
- Customer account dashboard or order history by assumption.
- Unrelated AI features.
- Complex ERP functionality.

## 12. Success criteria

- One application serves customers and admins.
- Admin access is securely protected by authentication and server-side authorisation.
- Customers can discover products and services.
- Sales and services are equally visible.
- Admin can manage products and publish them to the same website.
- Service requests and inquiries reach admin.
- Shared data is consistent.
- WhatsApp uses legitimate APIs and respects consent.
- Automated answers use verified business data.
- Human escalation works.
- Failures are visible and recoverable.
- The complete workflow can be demonstrated reliably.

---

This document defines **WHAT** we are building. Read `02-DESIGN-AND-TECHNICAL-SPECIFICATION.md` for the design and engineering direction, and `03-CLAUDE-WORKING-RULES.md` for mandatory agent behaviour.
