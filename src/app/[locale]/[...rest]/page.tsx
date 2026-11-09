import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";

/**
 * Any unknown path under a locale renders the branded, localised 404
 * (`[locale]/not-found.tsx`) instead of Next.js's default page.
 *
 * Under Cache Components a catch-all must prerender at least one path, or
 * reading its params counts as request-time data. One known path per locale
 * is prerendered; every other unknown path renders on demand.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, rest: ["not-found"] }));
}

export default async function CatchAll({
  params,
}: PageProps<"/[locale]/[...rest]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
