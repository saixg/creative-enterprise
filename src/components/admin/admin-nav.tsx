"use client";

import {
  Boxes,
  ClipboardList,
  FileText,
  Inbox,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", Icon: Boxes },
  { href: "/admin/services", label: "Services", Icon: Wrench },
  { href: "/admin/inquiries", label: "Inquiries", Icon: Inbox },
  { href: "/admin/requests", label: "Service requests", Icon: ClipboardList },
  { href: "/admin/content", label: "Website content", Icon: FileText },
] as const;

/**
 * Admin navigation: a sidebar list on large screens and a scrollable tab row
 * on small ones. The current section is marked with aria-current.
 */
export function AdminNav({ variant }: { variant: "sidebar" | "bar" }) {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  if (variant === "bar") {
    return (
      <nav
        aria-label="Admin"
        className="border-border bg-surface overflow-x-auto border-b lg:hidden"
      >
        <ul className="flex gap-1 px-3 py-2">
          {items.map(({ href, label, Icon, ...rest }) => {
            const on = active(href, "exact" in rest);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold whitespace-nowrap",
                    on
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Admin" className="mt-8 grid gap-1">
      {items.map(({ href, label, Icon, ...rest }) => {
        const on = active(href, "exact" in rest);
        return (
          <Link
            key={href}
            href={href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              on
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
