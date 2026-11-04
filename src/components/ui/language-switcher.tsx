"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Check, Globe } from "lucide-react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  DisclosureMenu,
  menuItemClasses,
} from "@/components/ui/disclosure-menu";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  en: "English",
  gu: "ગુજરાતી",
};

/**
 * Language picker — the "🌐 English ▾" pill from reference 02.
 *
 * Preserves the current route and its dynamic segments across the switch, so
 * a visitor on a product page stays on that product page.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- params shape is route-dependent and validated by
        // the router at runtime; next-intl's typed routes cannot narrow it here.
        { pathname, params },
        { locale: next },
      );
    });
  }

  return (
    <div className={cn(isPending && "opacity-60", className)}>
      <DisclosureMenu
        align="end"
        icon={<Globe aria-hidden className="text-muted size-4" />}
        label={
          <>
            <span className="sr-only">{t("language")}: </span>
            <span lang={locale}>{labels[locale]}</span>
          </>
        }
        buttonClassName="glass h-11 px-4 text-sm font-medium"
        panelClassName="min-w-44"
      >
        {routing.locales.map((code) => (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => switchTo(code)}
            aria-current={code === locale ? "true" : undefined}
            className={cn(menuItemClasses, "w-full")}
          >
            {labels[code]}
            {code === locale && (
              <Check aria-hidden className="text-primary size-4" />
            )}
          </button>
        ))}
      </DisclosureMenu>
    </div>
  );
}
