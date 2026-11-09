import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getBusinessInfo } from "@/lib/site-content";
import { whatsappLink } from "@/lib/business-info";
import { submitInquiry } from "@/features/inquiries/actions";
import { InquiryForm } from "@/components/inquiries/inquiry-form";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("metaTitle"), description: t("lead") };
}

/**
 * Contact: where "Get a Quote" lands (D-022). A general enquiry form stored
 * in the same inbox as product enquiries, plus the store details.
 *
 * Contact numbers render only when the owner has entered them in
 * /admin/content; until then the page says so plainly instead of showing
 * an invented number. Unconfirmed address and hours carry their notice.
 */
export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, store, info] = await Promise.all([
    getTranslations("contactPage"),
    getTranslations("store"),
    getBusinessInfo(),
  ]);

  const timeFormat = new Intl.DateTimeFormat(
    locale === "gu" ? "gu-IN" : "en-IN",
    { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" },
  );
  const formatTime = (hhmm: string) => {
    const [h = 0, m = 0] = hhmm.split(":").map(Number);
    return timeFormat.format(new Date(Date.UTC(2000, 0, 1, h, m)));
  };
  const wa = whatsappLink(info.whatsappNumberE164);
  const hasContact = Boolean(wa || info.phone || info.email);
  const unverified = !info.addressLines.verified || !info.hours.verified;

  return (
    <div className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--background),#eef2ff_30%,#f3f6ff_70%,var(--background))]">
      <div
        aria-hidden
        className="animate-drift absolute -top-40 -right-40 -z-10 size-[42rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_65%)] blur-2xl"
      />
      <div className="mx-auto w-full max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-8 lg:pt-20">
        <h1 className="text-primary-deep max-w-2xl text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] font-extrabold tracking-tight text-balance">
          {t("title")}
        </h1>
        <p className="text-muted mt-5 max-w-xl text-lg text-pretty">
          {t("lead")}
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <section className="glass-tile rounded-[2rem] p-6 sm:p-9">
            <h2 className="text-primary-deep text-xl font-bold">
              {t("formHeading")}
            </h2>
            <div className="mt-6">
              <InquiryForm
                kind="product"
                action={submitInquiry.bind(null, null)}
                subject={t("subject")}
                whatsappHref={wa}
              />
            </div>
          </section>

          <aside className="glass-tile grid content-start gap-7 rounded-[2rem] p-6 sm:p-9">
            <h2 className="text-primary-deep text-xl font-bold">
              {t("storeHeading")}
            </h2>

            {hasContact ? (
              <ul className="grid gap-3">
                {info.phone && (
                  <li>
                    <a
                      href={`tel:${info.phone}`}
                      className="hover:text-primary inline-flex items-center gap-3 font-semibold"
                    >
                      <Phone aria-hidden className="text-primary size-5" />
                      {info.phone}
                    </a>
                  </li>
                )}
                {wa && (
                  <li>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary inline-flex items-center gap-3 font-semibold"
                    >
                      <MessageCircle
                        aria-hidden
                        className="text-primary size-5"
                      />
                      {t("whatsapp")}
                    </a>
                  </li>
                )}
                {info.email && (
                  <li>
                    <a
                      href={`mailto:${info.email}`}
                      className="hover:text-primary inline-flex items-center gap-3 font-semibold"
                    >
                      <Mail aria-hidden className="text-primary size-5" />
                      {info.email}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-muted text-sm text-pretty">{t("noContact")}</p>
            )}

            <div className="flex gap-3">
              <MapPin
                aria-hidden
                className="text-primary mt-0.5 size-5 shrink-0"
              />
              <div>
                <p className="font-semibold">{store("addressLabel")}</p>
                <p className="text-muted mt-1 text-sm leading-relaxed">
                  {info.addressLines.value.join(", ")}
                  {info.postalCode.value ? ` ${info.postalCode.value}` : ""}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock
                aria-hidden
                className="text-primary mt-0.5 size-5 shrink-0"
              />
              <div>
                <p className="font-semibold">{t("hours")}</p>
                <dl className="text-muted mt-1 grid gap-0.5 text-sm">
                  {info.hours.value.map((h) => (
                    <div key={h.days} className="flex gap-3">
                      <dt className="min-w-24">{h.days}</dt>
                      <dd>
                        {formatTime(h.opens)} - {formatTime(h.closes)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {unverified && (
              <p className="border-warm/40 bg-warm/10 text-warning rounded-xl border px-3 py-2 text-xs font-medium">
                {store("unverifiedNotice")}
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
