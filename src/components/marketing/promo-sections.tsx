import {
  ArrowRight,
  Camera,
  CircuitBoard,
  CheckCircle2,
  Cpu,
  HardDrive,
  MapPin,
  Printer,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";

/**
 * Custom PC builds and repair — reference 01's promo pair.
 *
 * The reference's third tile carries a video play button. No video exists, so
 * it is not rendered: a play button that plays nothing is a false affordance.
 * "Why choose us" is given its own section below instead.
 */
export async function PromoPair() {
  const t = await getTranslations("promo");

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
      <article className="surface-card relative overflow-hidden rounded-3xl p-8">
        <div
          aria-hidden
          className="bg-accent/20 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-3xl"
        />
        <Cpu aria-hidden className="text-accent size-8" />
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">
          {t("builds.title")}
        </h3>
        <p className="text-muted mt-3 max-w-sm text-pretty">
          {t("builds.body")}
        </p>
        <Link href="/contact" className={buttonClasses({ className: "mt-7" })}>
          {t("builds.cta")}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </article>

      <article className="surface-card relative overflow-hidden rounded-3xl p-8">
        <div
          aria-hidden
          className="bg-primary/20 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-3xl"
        />
        <CircuitBoard aria-hidden className="text-primary size-8" />
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">
          {t("repair.title")}
        </h3>
        <p className="text-muted mt-3 max-w-sm text-pretty">
          {t("repair.body")}
        </p>
        <Link
          href="/services"
          className={buttonClasses({ variant: "secondary", className: "mt-7" })}
        >
          {t("repair.cta")}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </article>
    </div>
  );
}

/**
 * Services showcase.
 *
 * Doc 01 §2.2 lists these as *candidate* categories to confirm with the owner,
 * so each card describes the work only. No price, turnaround, warranty or
 * guarantee appears — doc 03 §3 forbids inventing any of them.
 */
const services = [
  { key: "repair", Icon: Wrench },
  { key: "upgrades", Icon: HardDrive },
  { key: "cctv", Icon: Camera },
  { key: "printer", Icon: Printer },
  { key: "amc", Icon: ShieldCheck },
] as const;

export async function ServiceShowcase() {
  const t = await getTranslations("services");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-accent text-sm font-medium">{t("eyebrow")}</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            {t("heading")}
          </h2>
          <p className="text-muted mt-2 max-w-xl text-pretty">
            {t("subtitle")}
          </p>
        </div>

        <Link href="/services" className={buttonClasses({ size: "lg" })}>
          {t("cta")}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ key, Icon }) => (
          <li key={key}>
            <article className="surface-card hover:shadow-raised flex h-full flex-col gap-3 rounded-3xl p-7 transition-shadow">
              <Icon aria-hidden className="text-accent size-7" />
              <h3 className="text-lg font-semibold">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-muted text-sm text-pretty">
                {t(`items.${key}.body`)}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <p className="text-warm mt-6 text-sm">{t("notice")}</p>
    </div>
  );
}

/**
 * Why choose us.
 *
 * Only claims the business documents already support: genuine products, expert
 * technical support, guidance, and a local Rajkot presence. No awards, no years
 * in business, no customer counts, no ratings (doc 03 §3).
 */
const reasons = ["genuine", "expert", "guidance", "local"] as const;

export async function WhyChooseUs() {
  const t = await getTranslations("why");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="surface-card rounded-3xl p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              {t("heading")}
            </h2>
            <p className="text-muted mt-3 max-w-sm text-pretty">
              {t("subtitle")}
            </p>
            <p className="text-muted mt-6 inline-flex items-center gap-2 text-sm">
              <MapPin aria-hidden className="text-accent size-4" />
              {t("location")}
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {reasons.map((key) => (
              <li key={key} className="flex gap-3">
                <CheckCircle2
                  aria-hidden
                  className="text-accent mt-0.5 size-5 shrink-0"
                />
                <div>
                  <p className="font-medium">{t(`reasons.${key}.title`)}</p>
                  <p className="text-muted mt-1 text-sm text-pretty">
                    {t(`reasons.${key}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Closing call to action — one route for products, one for services. */
export async function CtaSection() {
  const t = await getTranslations("finalCta");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="border-border bg-background-subtle rounded-3xl border p-10 text-center lg:p-16">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t("heading")}
        </h2>
        <p className="text-muted mx-auto mt-4 max-w-xl text-pretty">
          {t("subtitle")}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/products" className={buttonClasses({ size: "lg" })}>
            {t("productCta")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <Link
            href="/services"
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            <Wrench aria-hidden className="size-4" />
            {t("serviceCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
