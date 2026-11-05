import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { mediaUrl } from "@/lib/media";
import { isServiceIcon } from "@/lib/services-map";
import { getAdminService } from "@/features/admin/queries";
import { Badge, Panel, PageHeader } from "@/components/admin/admin-ui";
import { ServiceForm } from "@/components/admin/service-form";
import { SingleImage } from "@/components/admin/single-image";
import { DangerButton } from "@/components/admin/danger-button";
import { deleteService, saveService, setServiceImage } from "../actions";

const UUID = /^[0-9a-f-]{36}$/i;

export default async function EditServicePage({
  params,
}: PageProps<"/[locale]/admin/services/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  if (!UUID.test(id)) notFound();

  const service = await getAdminService(id);
  if (!service) notFound();

  return (
    <div className="grid max-w-6xl gap-8">
      <PageHeader
        eyebrow={
          <Link
            href="/admin/services"
            className="text-muted hover:text-foreground inline-flex items-center gap-1 text-sm"
          >
            <ChevronLeft aria-hidden className="size-4" />
            Services
          </Link>
        }
        title={service.name_en}
        description={
          service.is_candidate ? (
            <Badge tone="warning">
              Candidate service from the brief: confirm what it covers before
              ticking “Confirmed”
            </Badge>
          ) : undefined
        }
      />

      <ServiceForm
        key={service.updated_at}
        action={saveService.bind(null, service.id)}
        initial={{
          nameEn: service.name_en,
          nameGu: service.name_gu ?? "",
          slug: service.slug,
          icon: isServiceIcon(service.icon) ? service.icon : "repair",
          summaryEn: service.summary_en ?? "",
          summaryGu: service.summary_gu ?? "",
          problemEn: service.problem_en ?? "",
          problemGu: service.problem_gu ?? "",
          coversEn: service.covers_en,
          coversGu: service.covers_gu,
          signsEn: service.signs_en,
          signsGu: service.signs_gu,
          sortOrder: service.sort_order,
          imageIsPhoto: service.image_is_photo,
          isConfirmed: !service.is_candidate,
          status: service.status,
        }}
        isNew={false}
        publicHref={`/${locale}/services/${service.slug}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Image"
          description="A photo or a cut-out render for this service."
        >
          <SingleImage
            folder={`services/${service.id}`}
            current={service.image_path ? mediaUrl(service.image_path) : null}
            onSet={setServiceImage.bind(null, service.id)}
          />
        </Panel>
        <Panel
          title="Delete service"
          description="Removes the service and its page. Requests that mention it are kept, without the link."
        >
          <DangerButton
            action={deleteService.bind(null, service.id)}
            title={`Delete service “${service.name_en}”?`}
            body="Its page and image are removed permanently. Requests that mention it are kept, without the link."
            confirmLabel="Delete service"
          >
            Delete service
          </DangerButton>
        </Panel>
      </div>
    </div>
  );
}
