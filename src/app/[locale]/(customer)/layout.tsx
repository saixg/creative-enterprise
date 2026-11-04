import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export default async function CustomerLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("common");

  return (
    <>
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:px-5 focus:py-3"
      >
        {t("skipToContent")}
      </a>

      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
