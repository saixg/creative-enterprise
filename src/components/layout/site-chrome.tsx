import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

type Theme = "landing" | "app";

/**
 * Shared page chrome, scoped to a theme.
 *
 * `data-theme` sits on this wrapper rather than on <html> so that the landing
 * page and the interior pages can use different value sets of the SAME token
 * contract (docs/DECISIONS.md D-005). Header and footer live inside the wrapper
 * and therefore re-skin with the page — which is why they must only ever use
 * semantic tokens, never fixed colours.
 *
 * Adding a theme here is a value-set change. It is never a reason to fork a
 * component into light and dark variants.
 */
export async function SiteChrome({
  theme,
  header = "default",
  children,
}: {
  theme: Theme;
  /** `storefront`: the dark inner-platform header with search (D-016). */
  header?: "default" | "storefront";
  children: ReactNode;
}) {
  const t = await getTranslations("common");

  return (
    <div
      data-theme={theme}
      // `data-page-theme` is what the root `:has()` rule in globals.css looks
      // for, so the overscroll colour follows the PAGE, not whichever themed
      // section happens to be nested inside it. The homepage carries dark
      // sections (D-009) while staying a light page.
      data-page-theme={theme}
      className="bg-background text-foreground flex min-h-full flex-1 flex-col"
    >
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:px-5 focus:py-3"
      >
        {t("skipToContent")}
      </a>

      {header === "storefront" ? <StorefrontHeader /> : <SiteHeader />}
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
