import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { listProducts } from "@/lib/catalog";
import { Logo } from "@/components/marketing/logo";
import { MobileNav } from "@/components/marketing/mobile-nav";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { CatalogueSearch } from "@/components/storefront/catalogue-search";
import { StorefrontNav } from "@/components/storefront/storefront-nav";

/**
 * Inner-platform header (reference 01, D-016): dark, with logo, storefront
 * navigation, catalogue search and an outlined Get a Quote.
 *
 * It always renders in the dark `app` theme, whatever the page body uses, so
 * it reads as one piece with the dark storefront band beneath it.
 */
export async function StorefrontHeader() {
  const [t, products, catalogue] = await Promise.all([
    getTranslations("nav"),
    getTranslations("products"),
    listProducts(),
  ]);

  const searchItems = catalogue.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: products(`categories.${p.category}`),
    specs: p.summarySpecs.join(" · "),
    image: p.image?.src ?? null,
  }));

  return (
    <header
      data-theme="app"
      className="border-border/60 sticky top-0 z-50 border-b bg-[color-mix(in_oklab,var(--background)_82%,transparent)] backdrop-blur-xl"
    >
      <div className="text-foreground mx-auto flex h-18 w-full max-w-[90rem] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Creative Enterprise home"
          className="shrink-0"
        >
          <Logo />
        </Link>

        <StorefrontNav />

        <CatalogueSearch
          items={searchItems}
          className="hidden min-w-0 flex-1 md:block xl:max-w-md"
        />

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <LanguageSwitcher className="hidden lg:block" />
          <Link
            href="/contact"
            className="border-accent/60 text-foreground hover:bg-accent/15 hidden h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors sm:inline-flex"
          >
            <MessageCircle aria-hidden className="text-accent size-4" />
            {t("getQuote")}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
