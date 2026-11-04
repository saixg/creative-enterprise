"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  en: "English",
  gu: "ગુજરાતી",
};

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
      // Preserve the current route and its dynamic segments across the switch,
      // so a visitor on a product page stays on that product page.
      router.replace(
        // @ts-expect-error -- params shape is route-dependent and validated by
        // the router at runtime; next-intl's typed routes cannot narrow it here.
        { pathname, params },
        { locale: next },
      );
    });
  }

  return (
    <div
      className={cn(
        "border-border bg-surface shadow-card flex items-center gap-1 rounded-full border p-1",
        isPending && "opacity-60",
        className,
      )}
      role="group"
      aria-label={t("language")}
    >
      <Globe aria-hidden className="text-muted ml-2 size-4" />
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => switchTo(code)}
          aria-current={code === locale ? "true" : undefined}
          disabled={isPending}
          className={cn(
            "rounded-full px-3 py-1 text-sm transition-colors",
            "focus-visible:outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
            code === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:text-foreground",
          )}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
