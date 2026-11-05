import { setRequestLocale } from "next-intl/server";

import { InboxPage } from "@/components/admin/inbox-page";

export default async function AdminRequestsPage({
  params,
}: PageProps<"/[locale]/admin/requests">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InboxPage kind="requests" />;
}
