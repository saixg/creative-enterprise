import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/marketing/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { MobileNav } from "@/components/marketing/mobile-nav";
import { buttonClasses } from "@/components/ui/button";

/**
 * Navigation follows the route set defined in doc 01 §3.1. The image-1
 * reference also shows a "Solutions" item, which has no defined destination in
 * any brief — omitted rather than shipped as a link to nowhere.
 */
export const navItems = [
  { key: "products", href: "/products" },
  { key: "brands", href: "/#brands" },
  { key: "offers", href: "/#offers" },
  { key: "newArrivals", href: "/#new-arrivals" },
  { key: "services", href: "/services" },
  { key: "about", href: "/about" },
] as const;

/** Footer keeps Contact; the header dropped it for the Get a Quote button. */
export const footerNavItems = [
  ...navItems.filter((item) => !item.href.startsWith("/#")),
  { key: "contact", href: "/contact" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Creative Enterprise — home">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-muted hover:bg-surface-muted hover:text-foreground rounded-full px-4 py-2 text-sm font-medium transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:flex" />
          <Link
            href="/contact"
            className={buttonClasses({ className: "hidden sm:inline-flex" })}
          >
            {t("getQuote")}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
