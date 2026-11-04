import Image from "next/image";
import { Clock, MapPin, Store } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { businessInfo } from "@/lib/business-info";

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
  const { addressLines, hours } = businessInfo;
  const unverified = !addressLines.verified || !hours.verified;

  return (
    <div className="mx-auto grid w-full max-w-[90rem] items-end gap-8 px-4 pt-6 pb-10 sm:px-6 lg:grid-cols-[auto_1fr] lg:gap-10 lg:px-10 lg:pt-4 lg:pb-10">
      {/* Local identity */}
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end">
        <Image
          src="/images/hero/rajkot-landmark.png"
          alt=""
          width={700}
          height={420}
          sizes="320px"
          // Keyed artwork with its own wave. The crop ends in hard edges at the
          // top and right; the mask dissolves them into the hero field.
          className="h-28 w-auto [mask-image:radial-gradient(115%_105%_at_32%_72%,black_58%,transparent_88%)] sm:h-36 lg:-mb-4 lg:-ml-6 lg:h-48"
        />

        <div className="flex items-center gap-6 pb-1">
          <div>
            <p
              lang="gu"
              className="text-primary-deep max-w-[13rem] text-[1.6rem] leading-[1.15] font-bold text-balance"
            >
              {hero("localTagline")}
            </p>
            {/* Warm swoosh beneath the Gujarati line, as in the reference. */}
            <svg
              aria-hidden
              viewBox="0 0 200 14"
              className="text-warm mt-1 h-3 w-40"
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

          <span
            aria-hidden
            className="bg-border-strong hidden h-16 w-px sm:block"
          />

          <p className="hidden items-center gap-3 sm:flex">
            <MapPin
              aria-hidden
              className="text-primary size-7"
              strokeWidth={1.8}
            />
            <span className="leading-tight">
              <span className="text-foreground block text-lg font-semibold">
                {businessInfo.legalName.value}
              </span>
              <span className="text-primary block text-lg font-bold">
                {businessInfo.city.value}
              </span>
            </span>
          </p>
        </div>
      </div>

      {/* Store strip */}
      <div className="lg:justify-self-end">
        <dl className="glass grid gap-5 rounded-[1.6rem] px-6 py-5 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-[var(--border)] lg:min-w-[40rem]">
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
                    {formatTime(entry.opens)} – {formatTime(entry.closes)}
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
