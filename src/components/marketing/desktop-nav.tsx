"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import {
  DisclosureMenu,
  menuItemClasses,
} from "@/components/ui/disclosure-menu";
import { cn } from "@/lib/utils";

const productLinks = [
  { key: "categories.laptops", href: "/products" },
  { key: "categories.desktops", href: "/products" },
  { key: "categories.components", href: "/products" },
  { key: "categories.accessories", href: "/products" },
] as const;

const productExtras = [
  { key: "newArrivals", href: "/#new-arrivals" },
  { key: "brands", href: "/#brands" },
  { key: "offers", href: "/#offers" },
] as const;

const serviceLinks = ["repair", "upgrades", "cctv", "printer", "amc"] as const;

const itemBase =
  "inline-flex h-10 items-center rounded-full px-4 text-[0.95rem] font-semibold transition-colors";

/**
 * Desktop navigation — Home, Products ▾, Services ▾, About, as in reference 02.
 *
 * Brands, Offers and New Arrivals (D-011) live inside the Products menu rather
 * than as top-level items: the reference keeps the bar to five entries, and
 * nine items plus utilities would crowd it.
 *
 * "Solutions" from the reference is still omitted — no brief defines it, and a
 * nav item with no destination is worse than none.
 */
export function DesktopNav() {
  const nav = useTranslations("nav");
  const products = useTranslations("products");
  const services = useTranslations("services");
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
      <Link
        href="/"
        aria-current={isActive("/") ? "page" : undefined}
        className={cn(
          itemBase,
          isActive("/")
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:text-primary",
        )}
      >
        {nav("home")}
      </Link>

      <DisclosureMenu
        label={nav("products")}
        buttonClassName={cn(
          itemBase,
          "pe-3",
          isActive("/products")
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:text-primary",
        )}
        panelClassName="min-w-60"
      >
        {productLinks.map((item) => (
          <Link key={item.key} href={item.href} className={menuItemClasses}>
            {products(item.key)}
          </Link>
        ))}
        <div className="border-border my-1.5 border-t" />
        {productExtras.map((item) => (
          <Link key={item.key} href={item.href} className={menuItemClasses}>
            {nav(item.key)}
          </Link>
        ))}
        <Link href="/products" className={cn(menuItemClasses, "text-primary")}>
          {products("viewAll")}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </DisclosureMenu>

      <DisclosureMenu
        label={nav("services")}
        buttonClassName={cn(
          itemBase,
          "pe-3",
          isActive("/services")
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:text-primary",
        )}
        panelClassName="min-w-64"
      >
        {serviceLinks.map((key) => (
          <Link key={key} href="/services" className={menuItemClasses}>
            {services(`items.${key}.title`)}
          </Link>
        ))}
      </DisclosureMenu>

      <Link
        href="/about"
        aria-current={isActive("/about") ? "page" : undefined}
        className={cn(
          itemBase,
          isActive("/about")
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:text-primary",
        )}
      >
        {nav("about")}
      </Link>
    </nav>
  );
}
