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
 * What we do, as one slow flowing ribbon of glass chips (the page's only
 * marquee). It pauses on hover and focus; under reduced motion it is a
 * plain wrapped list. The list is rendered twice for a seamless loop, and the
 * copy is hidden from assistive tech so each item is announced once.
 */
const capabilities = [
  { key: "laptops", Icon: Laptop },
  { key: "repair", Icon: Wrench },
  { key: "cctv", Icon: Camera },
  { key: "printer", Icon: Printer },
  { key: "onsite", Icon: Headset },
  { key: "network", Icon: Network },
] as const;

export async function CapabilityFlow() {
  const t = await getTranslations("capabilities");

  const list = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-4 pe-4 motion-reduce:flex-wrap motion-reduce:justify-center"
    >
      {capabilities.map(({ key, Icon }) => (
        <li
          key={key}
          className="glass-tile flex items-center gap-3 rounded-full py-3 ps-3 pe-6"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(150deg,#ffffff,color-mix(in_oklab,var(--primary)_14%,#ffffff))]">
            <Icon
              aria-hidden
              className="text-primary size-5"
              strokeWidth={1.7}
            />
          </span>
          <span className="text-primary-deep text-base font-semibold whitespace-nowrap">
            {t(key)}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="relative py-6">
      <h2 className="sr-only">{t("heading")}</h2>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex w-max motion-reduce:w-full motion-reduce:justify-center">
          {list(false)}
          <span className="contents motion-reduce:hidden">{list(true)}</span>
        </div>
      </div>
    </section>
  );
}
