import { setRequestLocale } from "next-intl/server";

import { InboxPage } from "@/components/admin/inbox-page";

export default async function AdminInquiriesPage({
  params,
}: PageProps<"/[locale]/admin/inquiries">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InboxPage kind="inquiries" />;
}
