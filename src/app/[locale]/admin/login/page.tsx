import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/marketing/logo";
import { SignInForm } from "@/components/admin/sign-in-form";

/**
 * Admin sign-in. Static: it reads no cookies, so it prerenders. The session is
 * created by the server action and checked by the protected layout.
 * There is no sign-up anywhere: admins are provisioned (ADMIN-PROVISIONING.md).
 */
export default async function AdminSignInPage({
  params,
}: PageProps<"/[locale]/admin/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.signIn");

  return (
    <main
      id="main"
      className="flex flex-1 items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-sm">
        <Logo className="justify-center" />
        <div className="surface-card mt-8 rounded-3xl p-8">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted mt-1.5 text-sm">{t("subtitle")}</p>
          <div className="mt-7">
            <SignInForm />
          </div>
        </div>
        <Link
          href="/"
          className="text-muted hover:text-foreground mt-6 inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
