import {
  ArrowRight,
  Cpu,
  Headphones,
  Laptop,
  Monitor,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Tilt } from "@/components/motion/tilt";

/**
 * Category tiles — reference 01.
 *
 * Services sits in the same row as the product categories, at the same size.
 * Doc 01 §2 requires equal weight for the two business pillars, and demoting
 * services to a smaller tile here would be exactly the drift doc 03 §4 warns
 * about.
 *
 * On mobile the row scrolls horizontally rather than stacking into five full
 * -width blocks, which would push everything below it off the first screens.
 */
const categories = [
  { key: "laptops", href: "/products/category/laptops", Icon: Laptop },
  { key: "desktops", href: "/products/category/desktops", Icon: Monitor },
  { key: "components", href: "/products/category/components", Icon: Cpu },
  {
    key: "accessories",
    href: "/products/category/accessories",
    Icon: Headphones,
  },
  { key: "services", href: "/services", Icon: Wrench },
] as const;

export async function CategoryTiles() {
  const t = await getTranslations("products");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="sr-only">{t("categoriesHeading")}</h2>

      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
        {categories.map(({ key, href, Icon }) => (
          <li key={key} className="w-[62%] shrink-0 snap-start sm:w-auto">
            <Tilt className="h-full rounded-2xl" max={7}>
              <Link
                href={href}
                className="group surface-card hover:shadow-raised hover:border-border-strong flex h-full items-center justify-between gap-3 rounded-2xl px-5 py-6 transition-all"
              >
                <span className="flex flex-col gap-3">
                  <Icon aria-hidden className="text-accent size-6" />
                  <span className="font-medium">{t(`categories.${key}`)}</span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="text-muted size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Tilt>
          </li>
        ))}
      </ul>
    </div>
  );
}
