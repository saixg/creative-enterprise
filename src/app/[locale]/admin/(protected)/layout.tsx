import { Suspense, type ReactNode } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { Link, redirect } from "@/i18n/navigation";
import { getAdmin } from "@/lib/auth/admin";
import { Logo } from "@/components/marketing/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { signOut } from "../actions";

/**
 * Protected admin shell.
 *
 * The sidebar is static and prerenders. Everything that depends on WHO is
 * signed in sits inside <Suspense> in <AdminGate>, because reading the session
 * is request-time data (Next 16 Cache Components). The gate is the access
 * control: no admin, no content, redirect to sign-in. RLS enforces the same
 * rule again in the database, so a bypassed page still reads nothing.
 */
export default async function ProtectedAdminLayout({
  children,
  params,
}: LayoutProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <div className="flex min-h-full flex-1">
      <aside className="border-border bg-surface hidden w-64 shrink-0 flex-col border-r p-5 lg:flex">
        <Logo />
        <Suspense fallback={<div className="mt-8 h-72" />}>
          <AdminNav variant="sidebar" />
        </Suspense>
        <Link
          href="/"
          className="text-muted hover:text-foreground mt-auto inline-flex items-center gap-2 text-sm"
        >
          <ExternalLink aria-hidden className="size-4" />
          {t("viewSite")}
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense
          fallback={<p className="text-muted p-8 text-sm">{t("checking")}</p>}
        >
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </div>
    </div>
  );
}

async function AdminGate({ children }: { children: ReactNode }) {
  const admin = await getAdmin();
  if (!admin) {
    const locale = await getLocale();
    redirect({ href: "/admin/login", locale });
  }
  const t = await getTranslations("admin");

  return (
    <>
      <header className="border-border bg-surface flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-6">
        <p className="text-muted truncate text-sm">
          {t("signedInAs", { email: admin?.email ?? "" })}
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="border-border hover:border-border-strong inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium"
          >
            <LogOut aria-hidden className="size-4" />
            {t("signOut")}
          </button>
        </form>
      </header>
      <Suspense fallback={<div className="h-[3.3rem] lg:hidden" />}>
        <AdminNav variant="bar" />
      </Suspense>
      <main id="main" className="flex-1 p-4 sm:p-6 lg:p-10">
        {children}
      </main>
    </>
  );
}
