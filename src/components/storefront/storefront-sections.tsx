import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Tilt, TiltLayer } from "@/components/motion/tilt";

/**
 * Storefront sections for the inner platform (reference 01, D-016).
 *
 * Every page opens with a dark band that continues the dark header, then fades
 * into the light catalogue body. The fade is part of the band, so the category
 * rail can sit across the seam exactly as it does in the reference.
 */

function BandShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-theme="app"
      className={cn(
        "text-foreground relative isolate overflow-hidden",
        className,
      )}
    >
      {/* Dark field with a violet bloom behind the product, then a fade into
          the light body below. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[var(--theme-app-bg)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_75%_at_70%_30%,color-mix(in_oklab,var(--accent)_34%,transparent),transparent_70%),radial-gradient(40%_50%_at_12%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(to_bottom,transparent,var(--theme-landing-bg))]"
      />
      {children}
    </section>
  );
}

const trust = [
  { key: "genuine", Icon: ShieldCheck },
  { key: "warranty", Icon: BadgeCheck },
  { key: "expert", Icon: Wrench },
  { key: "response", Icon: Zap },
] as const;

/** Products page band: copy, trust row, and the laptops on a lit platform. */
export async function FeaturedBand() {
  const [t, f] = await Promise.all([
    getTranslations("products"),
    getTranslations("featured"),
  ]);

  return (
    <BandShell>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pt-12 pb-40 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pt-16 lg:pb-44">
        <div>
          <p className="border-accent/40 bg-accent/15 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
            <Sparkles aria-hidden className="text-accent size-3.5" />
            {f("badge")}
          </p>
          <h1 className="mt-5 text-[clamp(2.2rem,3.6vw,3.3rem)] leading-[1.05] font-extrabold tracking-tight text-balance">
            {t("heroHeadline")}
          </h1>
          <p className="text-muted mt-5 max-w-lg text-lg text-pretty">
            {t("heroSubheadline")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products/category/laptops"
              className="bg-surface-inverse text-foreground-inverse inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {t("heroPrimaryCta")}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="border-accent/60 hover:bg-accent/15 inline-flex h-12 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors"
            >
              <MessageCircle aria-hidden className="text-accent size-4" />
              {t("getQuote")}
            </Link>
          </div>

          <ul className="mt-9 grid grid-cols-2 gap-x-5 gap-y-3 sm:flex sm:flex-wrap lg:flex-nowrap">
            {trust.map(({ key, Icon }) => (
              <li
                key={key}
                className="text-muted flex items-center gap-2 text-sm"
              >
                <Icon
                  aria-hidden
                  className="text-foreground size-4"
                  strokeWidth={1.6}
                />
                {f(`trust.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Laptops on the lit platform, cut from reference 01 (interim). The
            mask dissolves the crop's edges into the band. */}
        <div className="relative">
          <Image
            src="/images/storefront/band-laptops.webp"
            alt=""
            width={1292}
            height={652}
            priority
            sizes="(min-width: 1024px) 640px, 92vw"
            className="h-auto w-full [mask-image:radial-gradient(58%_62%_at_52%_52%,black_45%,transparent_92%)]"
          />
        </div>
      </div>
    </BandShell>
  );
}

/** Compact band for category and product pages: breadcrumb and title. */
export function CompactBand({
  crumbs,
  title,
  intro,
  label,
}: {
  crumbs: { href?: string; label: string }[];
  /** Omit on product pages, where the product name is the page's h1. */
  title?: string;
  intro?: string;
  label: string;
}) {
  return (
    <BandShell>
      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8",
          title ? "pb-28" : "pb-32",
        )}
      >
        <nav aria-label={label} className="text-muted text-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight aria-hidden className="size-3.5" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-foreground">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {title && (
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
        )}
        {intro && (
          <p className="text-muted mt-3 max-w-xl text-pretty">{intro}</p>
        )}
      </div>
    </BandShell>
  );
}

const rail = [
  {
    key: "laptops",
    href: "/products/category/laptops",
    src: "/images/products/asus-tuf-gaming-a15.webp",
  },
  {
    key: "desktops",
    href: "/products/category/desktops",
    src: "/images/storefront/cat-desktops.png",
  },
  {
    key: "components",
    href: "/products/category/components",
    src: "/images/storefront/cat-components.png",
  },
  {
    key: "accessories",
    href: "/products/category/accessories",
    src: "/images/storefront/cat-accessories.png",
  },
  {
    key: "services",
    href: "/services",
    src: "/images/storefront/cat-services.png",
  },
] as const;

/**
 * Category rail across the band's lower seam (reference 01). Services sits in
 * the same row at the same size: equal pillars (doc 01 §2).
 */
export async function CategoryRail({ current }: { current?: string }) {
  const t = await getTranslations("products");

  return (
    <div className="relative z-10 mx-auto -mt-28 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="sr-only">{t("categoriesHeading")}</h2>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
        {rail.map(({ key, href, src }) => (
          <li key={key} className="w-[62%] shrink-0 snap-start sm:w-auto">
            <Tilt className="h-full rounded-2xl" max={7}>
              <Link
                href={href}
                data-theme="app"
                aria-current={current === key ? "page" : undefined}
                className={cn(
                  "group text-foreground relative flex h-28 overflow-hidden rounded-2xl border p-5 transition-colors [transform-style:preserve-3d]",
                  "bg-[linear-gradient(140deg,color-mix(in_oklab,var(--surface-muted)_92%,transparent),color-mix(in_oklab,var(--surface)_96%,transparent))]",
                  current === key
                    ? "border-accent"
                    : "border-border hover:border-border-strong",
                )}
              >
                <span className="relative z-10 self-center text-lg font-semibold">
                  {key === "services"
                    ? t("categories.services")
                    : t(`categories.${key}`)}
                </span>
                <TiltLayer
                  depth={28}
                  className="absolute inset-y-2 right-2 w-[52%]"
                >
                  <span className="relative block h-full w-full">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="140px"
                      className="object-contain object-right"
                    />
                  </span>
                </TiltLayer>
                <span
                  aria-hidden
                  className="bg-surface-inverse/10 text-foreground absolute right-3 bottom-3 z-10 inline-flex size-7 items-center justify-center rounded-full backdrop-blur transition-transform group-hover:translate-x-0.5"
                >
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </Tilt>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Promo row: custom builds, repair, why choose us (reference 01). */
export async function StorefrontPromos() {
  const [promo, why] = await Promise.all([
    getTranslations("promo"),
    getTranslations("why"),
  ]);
  const reasons = ["genuine", "expert", "guidance", "local"] as const;

  const card =
    "text-foreground relative flex min-h-60 overflow-hidden rounded-3xl border border-border p-7";

  return (
    <section
      data-theme="app"
      className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr_1fr] lg:px-8"
    >
      <h2 className="sr-only">{promo("heading")}</h2>

      <article className={cn(card, "bg-background")}>
        <Image
          src="/images/storefront/promo-builds.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 420px, 92vw"
          className="[mask-image:linear-gradient(to_right,transparent_42%,black_78%)] object-cover object-right opacity-90"
        />
        <div className="relative max-w-[16rem]">
          <h3 className="text-2xl font-bold tracking-tight">
            {promo("builds.title")}
          </h3>
          <p className="text-muted mt-2 text-sm text-pretty">
            {promo("builds.short")}
          </p>
          <Link
            href="/contact"
            className="bg-surface-inverse text-foreground-inverse mt-6 inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold"
          >
            {promo("builds.cta")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </article>

      <article className={cn(card, "bg-background")}>
        <Image
          src="/images/storefront/promo-repair.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, 92vw"
          className="[mask-image:linear-gradient(to_right,transparent_45%,black_80%)] object-cover object-right opacity-90"
        />
        <div className="relative max-w-[15rem]">
          <h3 className="text-2xl font-bold tracking-tight">
            {promo("repair.title")}
          </h3>
          <p className="text-muted mt-2 text-sm text-pretty">
            {promo("repair.short")}
          </p>
          <Link
            href="/services"
            className="bg-surface-inverse text-foreground-inverse mt-6 inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold"
          >
            {promo("repair.cta")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </article>

      <article className={cn(card, "bg-background flex-col")}>
        <ShieldCheck
          aria-hidden
          className="text-accent/30 absolute -right-6 -bottom-6 size-48"
          strokeWidth={1}
        />
        <h3 className="relative text-2xl font-bold tracking-tight">
          {why("headingShort")}
        </h3>
        <ul className="relative mt-5 space-y-3">
          {reasons.map((key) => (
            <li key={key} className="flex items-center gap-2.5 text-sm">
              <CheckCircle2
                aria-hidden
                className="text-accent size-4.5 shrink-0"
              />
              {why(`reasons.${key}.title`)}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
