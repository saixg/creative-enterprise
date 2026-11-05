import { Plus, Wrench } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { mediaUrl } from "@/lib/media";
import { listAdminServices } from "@/features/admin/queries";
import {
  EmptyState,
  formatWhen,
  PageHeader,
} from "@/components/admin/admin-ui";
import { RecordsTable, type RecordRow } from "@/components/admin/records-table";
import { buttonClasses } from "@/components/ui/button";

export default async function AdminServicesPage({
  params,
}: PageProps<"/[locale]/admin/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const services = await listAdminServices();

  const rows: RecordRow[] = services.map((s) => ({
    id: s.id,
    href: `/admin/services/${s.id}`,
    title: s.name_en,
    subtitle: s.name_gu ?? "No Gujarati name yet",
    image: s.image_path ? mediaUrl(s.image_path) : null,
    status: s.status,
    badges: s.is_candidate
      ? [{ label: "Being confirmed", tone: "warning" as const }]
      : [],
    meta: `Order ${s.sort_order}`,
    updated: formatWhen(s.updated_at),
  }));

  const newButton = (
    <Link href="/admin/services/new" className={buttonClasses()}>
      <Plus aria-hidden className="size-4" />
      New service
    </Link>
  );

  return (
    <div className="grid max-w-6xl gap-8">
      <PageHeader
        title="Services"
        description="The services pillar of the website, with equal weight to products. Confirm each one to remove its “being confirmed” label."
        actions={newButton}
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={<Wrench className="size-6" />}
          title="No services yet"
          body="Add the services you offer. Each stays a draft until you publish it."
          action={newButton}
        />
      ) : (
        <RecordsTable rows={rows} noun="services" />
      )}
    </div>
  );
}
