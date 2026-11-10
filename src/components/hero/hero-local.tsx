import Image from "next/image";
import { Clock, Store } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { getBusinessInfo } from "@/lib/site-content";

/**
 * The hero's lower band (reference 02): Rajkot landmark, Gujarati tagline,
 * business name — and the store strip.
 *
 * STORE FACTS ARE UNVERIFIED. The address and hours were read off the reference
 * and have not been confirmed by the owner (doc 03 §3). They are shown with a
 * small, explicit marker rather than a loud banner: visible and honest, without
 * shouting over the composition. The reference's "4.9/5 Customer Satisfaction"
 * column is deliberately absent — a rating with no source is never invented.
 */
export async function HeroLocal() {
  const [hero, store, locale] = await Promise.all([
    getTranslations("hero"),
    getTranslations("store"),
    getLocale(),
  ]);

  // Hours are stored as 24h "HH:MM" and shown as the reference does —
  // "10:00 AM" — in the visitor's locale. A fixed date keeps this
  // deterministic: only the time of day is read, never the current clock.
  const timeFormat = new Intl.DateTimeFormat(
    locale === "gu" ? "gu-IN" : "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    },
  );
  const formatTime = (hhmm: string) => {
    const [h = 0, m = 0] = hhmm.split(":").map(Number);
    return timeFormat.format(new Date(Date.UTC(2000, 0, 1, h, m)));
  };
  const { addressLines, hours } = await getBusinessInfo();
  const unverified = !addressLines.verified || !hours.verified;

  return (
    <div className="mx-auto grid w-full max-w-7xl items-end gap-8 px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pt-4 lg:pb-10 xl:grid-cols-[auto_1fr] xl:gap-10">
      {/* Local identity */}
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end">
        <Image
          src="/images/hero/rajkot-landmark.png"
          alt=""
          width={700}
          height={420}
          sizes="320px"
          // Keyed artwork with its own wave. The crop ends in hard edges on
          // every side; two crossed fades dissolve all four into the field.
          className="h-28 w-auto [mask-image:linear-gradient(to_right,transparent,black_20%,black_76%,transparent),linear-gradient(to_bottom,transparent,black_24%,black_78%,transparent)] [mask-composite:intersect] sm:h-36 lg:h-40"
        />

        <div className="flex items-center gap-6 pb-1">
          <div>
            <p
              lang="gu"
              className="text-primary-deep max-w-[15rem] text-[1.45rem] leading-[1.15] font-bold text-balance"
            >
              {hero("localTagline")}
            </p>
            {/* Warm swoosh beneath the Gujarati line, as in the reference. */}
            <svg
              aria-hidden
              viewBox="0 0 200 14"
              className="text-warning mt-1 h-3 w-40"
            >
              <path
                d="M4 10 C 60 2, 130 2, 196 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Store strip */}
      <div className="xl:justify-self-end">
        <dl className="glass-tile grid gap-5 rounded-[1.6rem] px-6 py-5 sm:grid-cols-[1fr_auto] sm:gap-0 sm:divide-x sm:divide-[var(--border)]">
          <div className="flex gap-4 sm:pe-6">
            <Store
              aria-hidden
              className="text-primary mt-0.5 size-7 shrink-0"
              strokeWidth={1.6}
            />
            <div>
              <dt className="text-foreground font-semibold">
                {store("addressLabel")}
              </dt>
              <dd className="text-muted mt-1 text-sm leading-snug">
                {addressLines.value.slice(0, 2).join(", ")}
              </dd>
            </div>
          </div>

          <div className="flex gap-4 sm:ps-6">
            <Clock
              aria-hidden
              className="text-primary mt-0.5 size-7 shrink-0"
              strokeWidth={1.6}
            />
            <div>
              <dt className="text-foreground font-semibold">
                {store("hoursLabel")}
              </dt>
              <dd className="text-muted mt-1 space-y-0.5 text-sm leading-snug">
                {hours.value.map((entry) => (
                  <p key={entry.days} className="whitespace-nowrap">
                    <span className="inline-block min-w-[5.5rem]">
                      {entry.days}
                    </span>
                    {formatTime(entry.opens)} - {formatTime(entry.closes)}
                  </p>
                ))}
              </dd>
            </div>
          </div>
        </dl>

        {unverified && (
          <p className="text-muted mt-2 flex items-center gap-2 px-2 text-xs">
            <span aria-hidden className="bg-warm size-1.5 rounded-full" />
            {store("unverifiedNotice")}
          </p>
        )}
      </div>
    </div>
  );
}
