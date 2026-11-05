import { formatDistanceToNowStrict } from "@/lib/relative-time";
import {
  listInbox,
  statusOptions,
  type InboxKind,
} from "@/features/admin/inbox";
import { formatWhen, PageHeader } from "@/components/admin/admin-ui";
import { InboxView } from "@/components/admin/inbox-view";
import { updateInboxItem } from "@/app/[locale]/admin/(protected)/inbox-actions";

const copy = {
  inquiries: {
    title: "Inquiries",
    description:
      "Product questions from the website. Reply by phone or WhatsApp, then record what happened.",
    subject: "Product",
  },
  requests: {
    title: "Service requests",
    description:
      "Repair and service requests from the website. Track each one from new to completed.",
    subject: "Service",
  },
} as const;

async function loadRows(kind: InboxKind) {
  const items = await listInbox(kind);
  const now = Date.now();
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email,
    message: item.message,
    status: item.status,
    notes: item.notes,
    locale: item.locale,
    subject: item.subject,
    subjectHref: item.subjectHref,
    source: item.source,
    created: formatWhen(item.createdAt),
    createdRelative: formatDistanceToNowStrict(new Date(item.createdAt), now),
  }));
}

/** Shared server page for both inboxes. */
export async function InboxPage({ kind }: { kind: InboxKind }) {
  const rows = await loadRows(kind);

  return (
    <div className="grid max-w-6xl gap-8">
      <PageHeader
        title={copy[kind].title}
        description={copy[kind].description}
      />
      <InboxView
        rows={rows}
        statuses={statusOptions[kind]}
        update={updateInboxItem.bind(null, kind)}
        subjectLabel={copy[kind].subject}
      />
    </div>
  );
}
