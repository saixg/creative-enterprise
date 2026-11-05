import { setRequestLocale } from "next-intl/server";

import { createClient } from "@/lib/supabase/server";
import {
  defaultStoredBusiness,
  storedBusinessSchema,
} from "@/lib/business-info";
import { announcementSchema, type Announcement } from "@/lib/site-content";
import { PageHeader, Panel } from "@/components/admin/admin-ui";
import {
  AnnouncementForm,
  BusinessForm,
} from "@/components/admin/content-forms";
import { saveAnnouncement, saveBusiness } from "./actions";

const emptyAnnouncement: Announcement = {
  enabled: false,
  text: "",
  href: null,
};

export default async function AdminContentPage({
  params,
}: PageProps<"/[locale]/admin/content">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, locale, value");
  if (error) throw new Error(`Content read failed: ${error.message}`);

  const businessRow = data.find(
    (r) => r.key === "business" && r.locale === "en",
  );
  const business = storedBusinessSchema.safeParse(businessRow?.value);
  const announcement = (loc: "en" | "gu") => {
    const parsed = announcementSchema.safeParse(
      data.find((r) => r.key === "announcement" && r.locale === loc)?.value,
    );
    return parsed.success ? parsed.data : emptyAnnouncement;
  };

  return (
    <div className="grid max-w-6xl gap-10">
      <PageHeader
        title="Website content"
        description="Store details, contact numbers and the announcement banner. Changes show on the website as soon as you save."
      />

      <section className="grid gap-4">
        <h2 className="text-xl font-bold">Store details</h2>
        <BusinessForm
          action={saveBusiness}
          initial={business.success ? business.data : defaultStoredBusiness()}
          saved={business.success}
        />
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="text-xl font-bold">Announcement banner</h2>
          <p className="text-muted mt-1 text-sm">
            A thin line above the site header, for news like new stock or
            holiday hours. Each language has its own text.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="English">
            <AnnouncementForm
              action={saveAnnouncement.bind(null, "en")}
              initial={announcement("en")}
              locale="en"
            />
          </Panel>
          <Panel title="Gujarati">
            <AnnouncementForm
              action={saveAnnouncement.bind(null, "gu")}
              initial={announcement("gu")}
              locale="gu"
            />
          </Panel>
        </div>
      </section>
    </div>
  );
}
