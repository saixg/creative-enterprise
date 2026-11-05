import { ArrowRight, Megaphone } from "lucide-react";
import { getLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getAnnouncement } from "@/lib/site-content";

/**
 * The optional banner above the header, written by the owner in
 * /admin/content. Renders nothing when switched off, so there is never an
 * empty strip.
 */
export async function AnnouncementBar() {
  const locale = await getLocale();
  const announcement = await getAnnouncement(locale);
  if (!announcement) return null;

  const body = (
    <>
      <Megaphone aria-hidden className="size-4 shrink-0" />
      <span className="truncate">{announcement.text}</span>
      {announcement.href && (
        <ArrowRight aria-hidden className="size-4 shrink-0" />
      )}
    </>
  );

  return (
    <div
      data-theme="app"
      className="bg-[linear-gradient(90deg,var(--primary-deep),var(--primary)_55%,var(--accent))] text-white"
    >
      <div className="mx-auto flex h-10 max-w-[90rem] items-center justify-center px-4 text-sm font-medium">
        {announcement.href ? (
          <Link
            href={announcement.href}
            className="inline-flex min-w-0 items-center gap-2 hover:underline"
          >
            {body}
          </Link>
        ) : (
          <p className="inline-flex min-w-0 items-center gap-2">{body}</p>
        )}
      </div>
    </div>
  );
}
