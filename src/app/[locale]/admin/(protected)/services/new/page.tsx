import { ChevronLeft } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/admin/admin-ui";
import { emptyService, ServiceForm } from "@/components/admin/service-form";
import { saveService } from "../actions";

export default async function NewServicePage({
  params,
}: PageProps<"/[locale]/admin/services/new">) {
  const { locale } = await params;
  setRequestLocale(locale);

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
        title="New service"
        description="Save first, then add an image. Nothing is visible on the website until you publish."
      />
      <ServiceForm
        action={saveService.bind(null, null)}
        initial={emptyService}
        isNew
        publicHref={null}
      />
    </div>
  );
}
