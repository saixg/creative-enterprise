import Image from "next/image";
import {
  ArrowRight,
  Camera,
  Cpu,
  MonitorSmartphone,
  Printer,
  ShieldCheck,
  TerminalSquare,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { ServiceKey, ServiceRecord } from "@/lib/services";
import { cn } from "@/lib/utils";
import { Tilt, TiltLayer } from "@/components/motion/tilt";

export const serviceIcons: Record<ServiceKey, typeof Wrench> = {
  repair: Wrench,
  screen: MonitorSmartphone,
  upgrades: Cpu,
  software: TerminalSquare,
  cctv: Camera,
  printer: Printer,
  amc: ShieldCheck,
};

/**
 * A service in the grid. `size` drives the bento cell: the lead service gets a
 * large cell with its photo filling it; the rest get a render or icon lifted
 * off the card by the tilt (D-014).
 */
export async function ServiceCard({
  service,
  size = "sm",
  className,
}: {
  service: ServiceRecord;
  size?: "lg" | "md" | "sm";
  className?: string;
}) {
  const [t, pages] = await Promise.all([
    getTranslations(`serviceCatalogue.${service.key}`),
    getTranslations("servicePages"),
  ]);
  const Icon = serviceIcons[service.key];
  const isLead = size === "lg";

  return (
    <Tilt className={cn("h-full rounded-3xl", className)} max={isLead ? 4 : 6}>
      <article
        className={cn(
          "group surface-card hover:shadow-raised relative flex h-full flex-col rounded-3xl transition-shadow [transform-style:preserve-3d]",
          isLead ? "min-h-[26rem] overflow-hidden" : "min-h-[15rem]",
        )}
      >
        {/* Media */}
        {isLead && service.image ? (
          <>
            <Image
              src={service.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 640px, 92vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,var(--theme-app-bg)_8%,color-mix(in_oklab,var(--theme-app-bg)_40%,transparent)_55%,transparent)]"
            />
          </>
        ) : (
          <TiltLayer
            depth={30}
            className="pointer-events-none absolute top-5 right-5 size-24"
          >
            {service.image ? (
              <span className="relative block size-full">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain drop-shadow-[0_14px_18px_color-mix(in_oklab,var(--primary-deep)_30%,transparent)]"
                />
              </span>
            ) : (
              <span className="bg-primary/10 text-primary flex size-full items-center justify-center rounded-2xl">
                <Icon aria-hidden className="size-10" strokeWidth={1.4} />
              </span>
            )}
          </TiltLayer>
        )}

        <div
          data-theme={isLead ? "app" : undefined}
          className={cn(
            "relative mt-auto flex flex-col gap-2 p-6",
            isLead && "text-foreground p-8",
          )}
        >
          <span
            className={cn(
              "bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-xl",
              isLead && "bg-accent/20 text-foreground",
            )}
          >
            <Icon aria-hidden className="size-5" strokeWidth={1.7} />
          </span>
          <h3
            className={cn(
              "mt-2 font-bold tracking-tight text-balance",
              isLead ? "text-3xl" : "text-lg",
            )}
          >
            <Link
              href={`/services/${service.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {t("title")}
            </Link>
          </h3>
          <p
            className={cn(
              "text-muted text-sm text-pretty",
              isLead && "max-w-md text-base",
            )}
          >
            {t("summary")}
          </p>
          <span className="text-primary mt-2 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-0.5">
            {pages("learnMore")}
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </div>
      </article>
    </Tilt>
  );
}
