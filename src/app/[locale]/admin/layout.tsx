import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";

/**
 * Admin area root: inside the same application, NOT a separate app
 * (CLAUDE.md, one-app-two-roles). It only opts out of the public site chrome
 * and keeps admin pages out of search engines.
 */
export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]/admin">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminRootLayout({
  children,
  params,
}: LayoutProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div
      data-theme="landing"
      data-page-theme="landing"
      className="bg-background-subtle text-foreground flex min-h-full flex-1 flex-col"
    >
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
