import { setRequestLocale } from "next-intl/server";

import { SiteChrome } from "@/components/layout/site-chrome";

/** Interior pages — dark theme (docs/DECISIONS.md D-001, D-005). */
export default async function ShopLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SiteChrome theme="app">{children}</SiteChrome>;
}
