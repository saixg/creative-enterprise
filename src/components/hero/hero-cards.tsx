import Image from "next/image";
import { ArrowRight, Settings, ShoppingCart } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/motion/tilt";

/**
 * The two entry cards from reference 02 — Shop Products (deep navy) and
 * Get IT Services (light glass), side by side at equal size.
 *
 * Equal size is the point. Doc 01 §2 makes products and services equal
 * pillars, and this pair is the first place a visitor chooses between them.
 */
export async function HeroCards({ className }: { className?: string }) {
  const t = await getTranslations("entryPoints");

  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <li>
        <Tilt className="h-full rounded-[1.75rem]" max={5}>
          <Link
            href="/products"
            className="group from-primary-deep to-primary-deep-2 text-primary-foreground relative flex h-40 overflow-hidden rounded-[1.75rem] bg-linear-to-br p-6 shadow-[0_24px_50px_-24px_var(--primary-deep)] transition-transform duration-300 hover:-translate-y-0.5 lg:h-[9.75rem]"
          >
            {/* Product image bleeds in from the right and fades toward the copy. */}
            <Image
              src="/images/hero/card-products.png"
              alt=""
              width={248}
              height={200}
              sizes="200px"
              className="pointer-events-none absolute top-0 right-0 h-full w-[46%] [mask-image:linear-gradient(to_left,black_55%,transparent)] object-cover"
            />

            <span className="relative flex max-w-[62%] flex-col">
              <ShoppingCart aria-hidden className="size-7" strokeWidth={1.8} />
              <span className="mt-3 text-[1.4rem] leading-tight font-bold tracking-tight">
                {t("products.title")}
              </span>
              <span className="mt-1.5 text-[0.85rem] leading-snug opacity-80">
                {t("products.description")}
              </span>
            </span>

            <span
              aria-hidden
              className="text-primary-deep bg-surface absolute right-4 bottom-4 inline-flex size-11 items-center justify-center rounded-full shadow-lg transition-transform group-hover:translate-x-0.5"
            >
              <ArrowRight className="size-5" />
            </span>
          </Link>
        </Tilt>
      </li>

      <li>
        <Tilt className="h-full rounded-[1.75rem]" max={5}>
          <Link
            href="/services"
            className="group glass relative flex h-40 overflow-hidden rounded-[1.75rem] p-6 transition-transform duration-300 hover:-translate-y-0.5 lg:h-[9.75rem]"
          >
            <Image
              src="/images/hero/card-services.png"
              alt=""
              width={320}
              height={212}
              sizes="200px"
              className="pointer-events-none absolute top-0 right-0 h-full w-[46%] [mask-image:linear-gradient(to_left,black_55%,transparent)] object-cover"
            />

            <span className="relative flex max-w-[62%] flex-col">
              <Settings
                aria-hidden
                className="text-primary size-7"
                strokeWidth={1.8}
              />
              <span className="text-primary-deep mt-3 text-[1.4rem] leading-tight font-bold tracking-tight">
                {t("services.title")}
              </span>
              <span className="text-muted mt-1.5 text-[0.85rem] leading-snug">
                {t("services.description")}
              </span>
            </span>

            <span
              aria-hidden
              className="bg-surface text-primary-deep absolute right-4 bottom-4 inline-flex size-11 items-center justify-center rounded-full shadow-lg transition-transform group-hover:translate-x-0.5"
            >
              <ArrowRight className="size-5" />
            </span>
          </Link>
        </Tilt>
      </li>
    </ul>
  );
}
