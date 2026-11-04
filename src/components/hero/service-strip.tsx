import {
  Camera,
  Headset,
  Laptop,
  Network,
  Printer,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

/**
 * What we do: the six capabilities from reference 02, moved out of the hero
 * so they get room instead of competing with the headline.
 *
 * Flat on purpose. These are labels, not interactive cards, so they carry no
 * glass, border or shadow; a hairline grid separates them.
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
    <section className="border-border border-y">
      <h2 className="sr-only">{t("heading")}</h2>
      <ul className="bg-border mx-auto grid w-full max-w-7xl grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
        {capabilities.map(({ key, Icon }) => (
          <li
            key={key}
            className="bg-background flex items-center gap-3 px-5 py-6 lg:flex-col lg:gap-3 lg:py-8 lg:text-center"
          >
            <Icon
              aria-hidden
              className="text-primary size-6 shrink-0"
              strokeWidth={1.6}
            />
            <span className="text-foreground text-sm font-semibold text-balance">
              {t(key)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
