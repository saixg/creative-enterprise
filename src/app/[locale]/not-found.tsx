import { ArrowRight, Home, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * Branded 404 (visual review N1): the site's own header and footer, the
 * light theme, and a way onward to each pillar, in the visitor's language.
 * Replaces Next.js's default black page.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <SiteChrome theme="landing">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--background),#eef2ff_40%,var(--background))]">
        <div
          aria-hidden
          className="animate-drift absolute top-1/4 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_24%,transparent),transparent_65%)] blur-2xl"
        />
        <div className="mx-auto flex min-h-[70dvh] w-full max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
          <p
            aria-hidden
            className="bg-[linear-gradient(135deg,var(--primary-deep),var(--primary)_55%,var(--accent))] bg-clip-text text-[clamp(6rem,18vw,11rem)] leading-none font-extrabold tracking-tighter text-transparent"
          >
            404
          </p>
          <h1 className="text-primary-deep mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-muted mt-4 max-w-md text-lg text-pretty">
            {t("body")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="btn-gradient text-primary-foreground inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Home aria-hidden className="size-4" />
              {t("home")}
            </Link>
            <Link
              href="/products"
              className="glass text-foreground inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t("products")}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              href="/services"
              className="glass text-foreground inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Wrench aria-hidden className="size-4" />
              {t("services")}
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
