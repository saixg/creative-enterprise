import { setRequestLocale } from "next-intl/server";

import { SiteChrome } from "@/components/layout/site-chrome";

/** Landing page — light theme (docs/DECISIONS.md D-001, D-005). */
export default async function LandingLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SiteChrome theme="landing">{children}</SiteChrome>;
}
