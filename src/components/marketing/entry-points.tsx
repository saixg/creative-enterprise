import { ArrowRight, Settings, ShoppingBag } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/**
 * The two equal entry points: products and services.
 *
 * Doc 01 §2 and doc 02 §4 require the two business pillars to carry equal
 * visual weight, so these are a symmetric pair — same size, same treatment,
 * same prominence. Do not shrink the services card.
 */
const entries = [
  { key: "products", href: "/products", Icon: ShoppingBag },
  { key: "services", href: "/services", Icon: Settings },
] as const;

export async function EntryPoints() {
  const t = await getTranslations("entryPoints");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <ul className="grid gap-4 md:grid-cols-2">
        {entries.map(({ key, href, Icon }) => (
          <li key={key}>
            <Link
              href={href}
              className="group surface-card hover:shadow-raised flex h-full items-start justify-between gap-6 rounded-3xl p-8 transition-shadow"
            >
              <span className="flex flex-col gap-3">
                <Icon aria-hidden className="text-primary size-7" />
                <span className="text-2xl font-semibold tracking-tight">
                  {t(`${key}.title`)}
                </span>
                <span className="text-muted max-w-xs text-pretty">
                  {t(`${key}.description`)}
                </span>
              </span>

              <span
                aria-hidden
                className="bg-primary text-primary-foreground mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
              >
                <ArrowRight className="size-5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
