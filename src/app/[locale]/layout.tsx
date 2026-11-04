import type { Metadata } from "next";
import { Inter, Noto_Sans_Gujarati } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoGujarati = Noto_Sans_Gujarati({
  variable: "--font-noto-gujarati",
  subsets: ["gujarati"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required in every layout and page for static rendering: without it
  // next-intl resolves the locale from request headers, which is runtime data
  // and opts the route out of prerendering under Cache Components.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      // Default theme. Interior route groups override it with data-theme="app".
      data-theme="landing"
      className={`${inter.variable} ${notoGujarati.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
