import { ArrowUpRight, ShoppingBag, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Tilt } from "@/components/motion/tilt";
import { Spotlight } from "@/components/motion/spotlight";
import { RevealItem } from "@/components/motion/reveal";

/**
 * The two pillars, at equal size (doc 01 §2). No product imagery: the owner
 * wants the landing page free of catalogue content (D-021). Each panel is a
 * glass surface over its own slow light field, with a cursor spotlight and a
 * small tilt, so the choice between them feels physical.
 */
const pillars = [
  {
    key: "products",
    href: "/products",
    Icon: ShoppingBag,
    field:
      "bg-[radial-gradient(70%_90%_at_85%_10%,color-mix(in_oklab,var(--primary)_32%,transparent),transparent_70%),radial-gradient(60%_80%_at_0%_100%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]",
  },
  {
    key: "services",
    href: "/services",
    Icon: Wrench,
    field:
      "bg-[radial-gradient(70%_90%_at_15%_10%,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_70%),radial-gradient(60%_80%_at_100%_100%,color-mix(in_oklab,var(--primary)_26%,transparent),transparent_70%)]",
  },
] as const;

export async function Pillars() {
  const t = await getTranslations("entryPoints");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <h2 className="sr-only">Products and services</h2>
      <ul className="grid gap-5 md:grid-cols-2">
        {pillars.map(({ key, href, Icon, field }, index) => (
          <li key={key}>
            <RevealItem index={index} className="h-full">
              <Tilt className="h-full rounded-[2rem]" max={4}>
                <Spotlight className="h-full rounded-[2rem]">
                  <Link
                    href={href}
                    className="group glass-tile relative flex min-h-[19rem] flex-col justify-between overflow-hidden rounded-[2rem] p-8 sm:p-10"
                  >
                    {/* A light travels the card's edge on hover: it marks
                        which of the two doors the pointer is on. */}
                    <span aria-hidden className="beam-ring" />
                    <span
                      aria-hidden
                      className={`animate-drift absolute -inset-1/4 -z-10 ${field}`}
                      style={{ ["--drift-delay" as string]: `${index * -7}s` }}
                    />
                    <span className="flex items-start justify-between gap-6">
                      <span className="flex size-14 items-center justify-center rounded-2xl bg-[linear-gradient(150deg,var(--surface),color-mix(in_oklab,var(--primary)_18%,var(--surface)))] shadow-[inset_0_1px_0_var(--surface),0_14px_28px_-14px_color-mix(in_oklab,var(--primary)_60%,transparent)]">
                        <Icon
                          aria-hidden
                          className="text-primary size-7"
                          strokeWidth={1.6}
                        />
                      </span>
                      <span className="bg-surface text-primary-deep flex size-12 items-center justify-center rounded-full shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--primary-deep)_50%,transparent)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight aria-hidden className="size-5" />
                      </span>
                    </span>
                    <span className="mt-12 block">
                      <span className="text-primary-deep block text-[clamp(1.9rem,3vw,2.6rem)] leading-tight font-extrabold tracking-tight">
                        {t(`${key}.title`)}
                      </span>
                      <span className="text-muted mt-3 block max-w-md text-base text-pretty">
                        {t(`${key}.description`)}
                      </span>
                    </span>
                  </Link>
                </Spotlight>
              </Tilt>
            </RevealItem>
          </li>
        ))}
      </ul>
    </section>
  );
}
