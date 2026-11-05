import { Boxes, Plus } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { listAdminProducts } from "@/features/admin/queries";
import {
  EmptyState,
  formatWhen,
  PageHeader,
} from "@/components/admin/admin-ui";
import { RecordsTable, type RecordRow } from "@/components/admin/records-table";
import { buttonClasses } from "@/components/ui/button";

export default async function AdminProductsPage({
  params,
}: PageProps<"/[locale]/admin/products">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const products = await listAdminProducts();

  const rows: RecordRow[] = products.map((p) => {
    const primary =
      p.media.find((m) => m.is_primary && m.width) ??
      p.media.find((m) => m.width);
    const price = formatPrice(p.price_paise, "en");
    return {
      id: p.id,
      href: `/admin/products/${p.id}`,
      title: p.name,
      subtitle: [p.brand?.name, p.category?.name_en]
        .filter(Boolean)
        .join(" · "),
      image: primary ? mediaUrl(primary.storage_path) : null,
      status: p.status,
      badges: [
        ...(p.is_placeholder
          ? [{ label: "Placeholder", tone: "warning" as const }]
          : []),
        ...(p.is_featured
          ? [{ label: "Featured", tone: "primary" as const }]
          : []),
        ...(p.is_new ? [{ label: "New", tone: "primary" as const }] : []),
      ],
      meta: price
        ? `${price}${p.price_is_verified ? "" : " (unverified)"}`
        : "Price on request",
      updated: formatWhen(p.updated_at),
    };
  });

  const newButton = (
    <Link href="/admin/products/new" className={buttonClasses()}>
      <Plus aria-hidden className="size-4" />
      New product
    </Link>
  );

  return (
    <div className="grid max-w-6xl gap-8">
      <PageHeader
        title="Products"
        description="Everything in the catalogue. Live products are visible on the website; drafts are only visible here."
        actions={newButton}
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={<Boxes className="size-6" />}
          title="No products yet"
          body="Add your first product. It stays a draft until you publish it."
          action={newButton}
        />
      ) : (
        <RecordsTable rows={rows} noun="products" />
      )}
    </div>
  );
}
