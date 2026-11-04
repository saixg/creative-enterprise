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
 * The six capability tiles from the image-1 reference.
 *
 * These are capability labels, not service offerings with prices or
 * guarantees — doc 01 §2.2 requires the exact service list, pricing, warranty
 * and turnaround to be confirmed with the owner before publication. Nothing
 * here claims any of that.
 */
const capabilities = [
  { key: "laptops", Icon: Laptop },
  { key: "repair", Icon: Wrench },
  { key: "cctv", Icon: Camera },
  { key: "printer", Icon: Printer },
  { key: "onsite", Icon: Headset },
  { key: "network", Icon: Network },
] as const;

export async function CapabilityStrip() {
  const t = await getTranslations("capabilities");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <h2 className="sr-only">{t("heading")}</h2>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {capabilities.map(({ key, Icon }) => (
          <li
            key={key}
            className="surface-card flex flex-col items-center gap-3 rounded-2xl px-3 py-6 text-center"
          >
            <Icon aria-hidden className="text-primary size-7" />
            <span className="text-sm font-medium text-balance">{t(key)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
