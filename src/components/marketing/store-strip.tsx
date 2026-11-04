import { Clock, Store } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { businessInfo } from "@/lib/business-info";

/**
 * Store information.
 *
 * Address and hours were read off the image-1 reference and are NOT confirmed
 * by the owner. Doc 03 §3 forbids presenting unverified business details as
 * fact, so unverified values render behind an explicit notice. When the owner
 * confirms them, flip `verified` in lib/business-info.ts and the notice
 * disappears on its own.
 *
 * The "4.9/5" satisfaction figure from the reference is a ratings claim with no
 * source, and is deliberately not rendered at all.
 */
export async function StoreStrip() {
  const t = await getTranslations("store");
  const { addressLines, hours } = businessInfo;
  const unverified = !addressLines.verified || !hours.verified;

  return (
    <section className="border-border bg-background-subtle border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("heading")}
        </h2>

        {unverified && (
          <p className="border-warm/40 bg-warm/10 text-warm mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            {t("unverifiedNotice")}
          </p>
        )}

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="surface-card rounded-2xl p-6">
            <dt className="text-muted flex items-center gap-2 text-sm font-medium">
              <Store aria-hidden className="size-4" />
              {t("addressLabel")}
            </dt>
            <dd className="mt-3 space-y-1 text-pretty">
              {addressLines.value.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </dd>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <dt className="text-muted flex items-center gap-2 text-sm font-medium">
              <Clock aria-hidden className="size-4" />
              {t("hoursLabel")}
            </dt>
            <dd className="mt-3 space-y-1">
              {hours.value.map((entry) => (
                <p key={entry.days}>
                  <span className="font-medium">{entry.days}</span>{" "}
                  <span className="text-muted">
                    {entry.opens} – {entry.closes}
                  </span>
                </p>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
