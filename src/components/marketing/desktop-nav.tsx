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
  { key: "categories.laptops", href: "/products/category/laptops" },
  { key: "categories.desktops", href: "/products/category/desktops" },
  { key: "categories.components", href: "/products/category/components" },
  { key: "categories.accessories", href: "/products/category/accessories" },
] as const;

const serviceLinks = ["repair", "upgrades", "cctv", "printer", "amc"] as const;

const serviceSlugs: Record<(typeof serviceLinks)[number], string> = {
  repair: "laptop-desktop-repair",
  upgrades: "hardware-upgrades",
  cctv: "cctv-installation",
  printer: "printer-repair",
  amc: "maintenance-amc",
};

const itemBase =
  "inline-flex h-10 items-center rounded-full px-4 text-[0.95rem] font-semibold transition-colors";

/**
 * Desktop navigation: Home, Products ▾, Services ▾, Contact.
 *
 * About is left out until the owner supplies About content (D-022): a nav
 * item that leads to a 404 is worse than none. The landing-page anchors for
 * Brands, Offers and New Arrivals went with those sections (D-021).
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
          <Link
            key={key}
            href={`/services/${serviceSlugs[key]}`}
            className={menuItemClasses}
          >
            {services(`items.${key}.title`)}
          </Link>
        ))}
      </DisclosureMenu>

      <Link
        href="/contact"
        aria-current={isActive("/contact") ? "page" : undefined}
        className={cn(
          itemBase,
          isActive("/contact")
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:text-primary",
        )}
      >
        {nav("contact")}
      </Link>
    </nav>
  );
}
