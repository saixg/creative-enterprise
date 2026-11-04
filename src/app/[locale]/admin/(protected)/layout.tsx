import { Suspense, type ReactNode } from "react";
import {
  Boxes,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Wrench,
  ClipboardList,
} from "lucide-react";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { Link, redirect } from "@/i18n/navigation";
import { getAdmin } from "@/lib/auth/admin";
import { Logo } from "@/components/marketing/logo";
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

  const items = [
    {
      href: "/admin",
      label: t("nav.dashboard"),
      Icon: LayoutDashboard,
      live: true,
    },
    {
      href: "/admin/products",
      label: t("nav.products"),
      Icon: Boxes,
      live: false,
    },
    {
      href: "/admin/services",
      label: t("nav.services"),
      Icon: Wrench,
      live: false,
    },
    {
      href: "/admin/inquiries",
      label: t("nav.inquiries"),
      Icon: Inbox,
      live: false,
    },
    {
      href: "/admin/requests",
      label: t("nav.requests"),
      Icon: ClipboardList,
      live: false,
    },
    {
      href: "/admin/content",
      label: t("nav.content"),
      Icon: FileText,
      live: false,
    },
  ];

  return (
    <div className="flex min-h-full flex-1">
      <aside className="border-border bg-surface hidden w-64 shrink-0 flex-col border-r p-5 lg:flex">
        <Logo />
        <nav aria-label="Admin" className="mt-8 grid gap-1">
          {items.map(({ href, label, Icon, live }) =>
            live ? (
              <Link
                key={href}
                href={href}
                className="bg-primary/10 text-primary flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold"
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </Link>
            ) : (
              // Not built yet: shown so the shape of the admin is visible, but
              // not a link, because a link to nothing is a dead end.
              <span
                key={href}
                aria-disabled="true"
                className="text-muted flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
              >
                <Icon aria-hidden className="size-4" />
                {label}
                <span className="bg-surface-muted ms-auto rounded-full px-2 py-0.5 text-[0.65rem] font-semibold">
                  {t("nav.soon")}
                </span>
              </span>
            ),
          )}
        </nav>
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
      <header className="border-border bg-surface flex h-16 items-center justify-between gap-4 border-b px-6">
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
      <main id="main" className="flex-1 p-6 lg:p-10">
        {children}
      </main>
    </>
  );
}
