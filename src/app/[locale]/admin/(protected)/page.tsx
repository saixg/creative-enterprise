import { Boxes, ClipboardList, Inbox } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin dashboard: live counts straight from the database.
 *
 * Reads through the signed-in admin's own session, so RLS applies exactly as
 * it would to any other admin query. Rendered inside the layout's AdminGate,
 * so it never runs for a visitor.
 */
export default async function AdminDashboard({
  params,
}: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, supabase] = await Promise.all([
    getTranslations("admin.dashboard"),
    createClient(),
  ]);

  const count = async (
    table: "products" | "inquiries" | "service_requests",
    filter?: { column: string; value: string },
  ) => {
    let query = supabase
      .from(table)
      .select("id", { count: "exact", head: true });
    if (filter) query = query.eq(filter.column, filter.value);
    const { count: n } = await query;
    return n ?? 0;
  };

  const [products, published, inquiries, requests] = await Promise.all([
    count("products"),
    count("products", { column: "status", value: "published" }),
    count("inquiries", { column: "status", value: "new" }),
    count("service_requests", { column: "status", value: "new" }),
  ]);

  const stats = [
    {
      label: t("products"),
      value: products,
      note: t("published", { count: published }),
      Icon: Boxes,
      href: "/admin/products",
    },
    {
      label: t("inquiries"),
      value: inquiries,
      Icon: Inbox,
      href: "/admin/inquiries",
    },
    {
      label: t("requests"),
      value: requests,
      Icon: ClipboardList,
      href: "/admin/requests",
    },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
      <p className="text-muted mt-1.5">{t("subtitle")}</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, note, Icon, href }) => (
          <div
            key={label}
            className="surface-card hover:shadow-raised relative rounded-2xl p-6 transition-shadow"
          >
            <dt className="text-muted flex items-center gap-2 text-sm font-medium">
              <Icon aria-hidden className="size-4" />
              <Link
                href={href}
                className="after:absolute after:inset-0 hover:underline"
              >
                {label}
              </Link>
            </dt>
            <dd className="mt-3 text-4xl font-extrabold tabular-nums">
              {value}
            </dd>
            {note && <dd className="text-muted mt-1 text-sm">{note}</dd>}
          </div>
        ))}
      </dl>

      {products === 0 && (
        <p className="border-warm/40 bg-warm/10 text-warning mt-6 rounded-2xl border px-4 py-3 text-sm">
          {t("empty")}
        </p>
      )}
    </div>
  );
}
