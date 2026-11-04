import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/marketing/logo";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { navItems } from "@/components/marketing/site-header";

export async function SiteFooter() {
  const [t, nav] = await Promise.all([
    getTranslations("footer"),
    getTranslations("nav"),
  ]);

  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <Logo />
            <p className="text-muted mt-4 max-w-xs text-sm">{t("tagline")}</p>
            <WhatsAppCta className="mt-6" />
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold">{t("sections.explore")}</h2>
            <ul className="mt-4 space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-muted hover:text-foreground text-sm transition-colors"
                  >
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Development notice. Remove once placeholder content is replaced. */}
        <p className="border-warm/40 bg-warm/10 text-warm mt-10 rounded-2xl border px-4 py-3 text-sm">
          {t("buildNotice")}
        </p>

        {/* No `new Date()` here: with `cacheComponents` enabled it is a dynamic
            API and would opt this whole footer out of prerendering. A year in a
            copyright line is not worth that. */}
        <p className="text-muted mt-6 text-sm">
          © Creative Enterprise. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
