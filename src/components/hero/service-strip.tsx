import {
  Camera,
  Headset,
  Laptop,
  Network,
  Printer,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { RevealItem } from "@/components/motion/reveal";

/**
 * What we do: reference 02's six capability tiles, as glass (D-020).
 *
 * They are labels, not links, so hover gives only a small lift and a light
 * pass, never a pointer cursor that promises a destination.
 */
const capabilities = [
  { key: "laptops", Icon: Laptop },
  { key: "repair", Icon: Wrench },
  { key: "cctv", Icon: Camera },
  { key: "printer", Icon: Printer },
  { key: "onsite", Icon: Headset },
  { key: "network", Icon: Network },
] as const;

export async function ServiceStrip() {
  const t = await getTranslations("capabilities");

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="sr-only">{t("heading")}</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {capabilities.map(({ key, Icon }, index) => (
          <li key={key}>
            <RevealItem index={index} className="h-full">
              <div className="glass-tile group flex h-full flex-col items-center gap-3 rounded-[1.4rem] px-4 py-5 text-center transition-transform duration-300 ease-[var(--ease-out)] hover:-translate-y-1">
                <span className="relative flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(150deg,#ffffff,color-mix(in_oklab,var(--primary)_14%,#ffffff))] shadow-[inset_0_1px_0_white,0_10px_20px_-10px_color-mix(in_oklab,var(--primary)_55%,transparent)]">
                  <Icon
                    aria-hidden
                    className="text-primary size-6 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.6}
                  />
                </span>
                <span className="text-primary-deep text-sm leading-tight font-semibold text-balance">
                  {t(key)}
                </span>
              </div>
            </RevealItem>
          </li>
        ))}
      </ul>
    </section>
  );
}
