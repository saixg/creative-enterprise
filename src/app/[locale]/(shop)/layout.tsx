import { setRequestLocale } from "next-intl/server";

import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * Inner platform (D-016): a light page whose top is a dark storefront band.
 * The header is always dark; each page opens with its own dark band.
 */
export default async function ShopLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SiteChrome theme="landing" header="storefront">
      {children}
    </SiteChrome>
  );
}
