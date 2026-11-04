"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { buttonClasses } from "@/components/ui/button";

const items = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "brands", href: "/#brands" },
  { key: "offers", href: "/#offers" },
  { key: "newArrivals", href: "/#new-arrivals" },
  { key: "services", href: "/services" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  // Close on Escape, and stop the page scrolling behind the open panel.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openMenu")}
        aria-expanded={open}
        className="glass inline-flex size-11 items-center justify-center rounded-full lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="bg-background fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-18 items-center justify-end px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("closeMenu")}
                autoFocus
                className="border-border bg-surface inline-flex size-11 items-center justify-center rounded-full border"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="flex flex-col gap-1 px-4 pt-4 sm:px-6"
            >
              {items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="hover:bg-surface-muted rounded-2xl px-4 py-4 text-xl font-medium"
                >
                  {t(item.key)}
                </Link>
              ))}

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className={buttonClasses({ size: "lg", className: "mt-6" })}
              >
                {t("getQuote")}
              </Link>

              <LanguageSwitcher className="mt-6 self-start" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
