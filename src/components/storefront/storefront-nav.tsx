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
  "laptops",
  "desktops",
  "components",
  "accessories",
] as const;
const serviceLinks = ["repair", "upgrades", "cctv", "printer", "amc"] as const;

const serviceSlugs: Record<(typeof serviceLinks)[number], string> = {
  repair: "laptop-desktop-repair",
  upgrades: "hardware-upgrades",
  cctv: "cctv-installation",
  printer: "printer-repair",
  amc: "maintenance-amc",
};

const item =
  "inline-flex h-10 items-center rounded-full px-3.5 text-sm font-medium transition-colors";

/**
 * Storefront navigation (reference 01): Products ▾, Brands, Offers,
 * New Arrivals, Services ▾. Brands, Offers and New Arrivals point at real
 * destinations: the brand and new-arrival sections of the catalogue, and the
 * offers section, whose empty state says honestly that none are published.
 */
export function StorefrontNav() {
  const nav = useTranslations("nav");
  const products = useTranslations("products");
  const services = useTranslations("services");
  const pathname = usePathname();
  const onProducts = pathname.startsWith("/products");

  const tone = (active: boolean) =>
    active
      ? "bg-primary/15 text-foreground"
      : "text-muted hover:text-foreground";

  return (
    <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
      <DisclosureMenu
        label={nav("products")}
        buttonClassName={cn(item, "pe-2.5", tone(onProducts))}
        panelClassName="min-w-56"
      >
        {productLinks.map((slug) => (
          <Link
            key={slug}
            href={`/products/category/${slug}`}
            className={menuItemClasses}
          >
            {products(`categories.${slug}`)}
          </Link>
        ))}
        <Link href="/products" className={cn(menuItemClasses, "text-primary")}>
          {products("viewAll")}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </DisclosureMenu>

      <Link href="/products#brands" className={cn(item, tone(false))}>
        {nav("brands")}
      </Link>
      <Link href="/products#offers" className={cn(item, tone(false))}>
        {nav("offers")}
      </Link>
      <Link href="/products#catalogue" className={cn(item, tone(false))}>
        {nav("newArrivals")}
      </Link>

      <DisclosureMenu
        label={nav("services")}
        buttonClassName={cn(
          item,
          "pe-2.5",
          tone(pathname.startsWith("/services")),
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
    </nav>
  );
}
