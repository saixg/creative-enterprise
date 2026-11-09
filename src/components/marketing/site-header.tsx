import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/marketing/logo";
import { DesktopNav } from "@/components/marketing/desktop-nav";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { MobileNav } from "@/components/marketing/mobile-nav";

/** Footer link set. The header's own items live in DesktopNav and MobileNav. */
export const footerNavItems = [
  { key: "products", href: "/products" },
  { key: "services", href: "/services" },
  { key: "contact", href: "/contact" },
] as const;

/**
 * Site header — reference 02.
 *
 * It floats over the hero's lavender field rather than sitting on a white bar:
 * a light glass wash that only gains contrast as content scrolls beneath it.
 */
export async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="bg-background/55 sticky top-0 z-50 border-b border-transparent backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-[90rem] items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-10">
        <Link
          href="/"
          aria-label="Creative Enterprise home"
          className="shrink-0"
        >
          <Logo />
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:block" />
          <Link
            href="/contact"
            className="bg-primary-deep text-primary-foreground hover:bg-primary-deep-2 hidden h-12 items-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold shadow-[0_14px_30px_-14px_var(--primary-deep)] transition-colors sm:inline-flex"
          >
            {t("getQuote")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
