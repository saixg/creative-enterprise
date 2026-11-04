"use client";

import {
  Camera,
  Cpu,
  Laptop,
  MonitorSpeaker,
  Printer,
  Wrench,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The glass product panels that orbit the owner in reference 02.
 *
 * No product photography has been supplied, so each panel currently frames an
 * icon rather than a product image. The frames sit at the reference's ratios
 * and depths, so dropping real images in later does not move the layout.
 *
 * Depth is expressed as three tiers (scale + opacity), which is what makes the
 * cluster read as a composition rather than a row of tiles.
 */
type Panel = {
  key: string;
  Icon: LucideIcon;
  /** Tailwind positioning, relative to the hero stage. */
  /** Translation key under the `products` namespace. */
  label: string;
  position: string;
  tier: 1 | 2 | 3;
  /** Degrees, kept under 4 per the design system. */
  rotate: number;
};

/**
 * Panels ring the stage and the owner stands in the middle of it, so each one
 * must stay clear of the centre column. Widths are deliberately small — large
 * empty frames read as missing content rather than as product tiles.
 */
const panels: Panel[] = [
  {
    key: "laptop",
    label: "categories.laptops",
    Icon: Laptop,
    position: "left-0 top-[6%] w-[25%]",
    tier: 1,
    rotate: -3,
  },
  {
    key: "tower",
    label: "categories.desktops",
    Icon: MonitorSpeaker,
    position: "right-0 top-[2%] w-[25%]",
    tier: 1,
    rotate: 3,
  },
  {
    key: "cctv",
    label: "panels.cctv",
    Icon: Camera,
    position: "right-0 top-[40%] w-[22%]",
    tier: 2,
    rotate: 2,
  },
  {
    key: "printer",
    label: "panels.printer",
    Icon: Printer,
    position: "right-[3%] bottom-[6%] w-[23%]",
    tier: 2,
    rotate: -2,
  },
  {
    key: "tools",
    label: "panels.repair",
    Icon: Wrench,
    position: "left-0 top-[42%] w-[22%]",
    tier: 3,
    rotate: 2,
  },
  {
    key: "gpu",
    label: "categories.components",
    Icon: Cpu,
    position: "left-[3%] bottom-[4%] w-[23%]",
    tier: 3,
    rotate: -2,
  },
];

const tierStyles: Record<Panel["tier"], string> = {
  1: "opacity-100",
  2: "opacity-90",
  3: "opacity-80",
};

const tierScale: Record<Panel["tier"], number> = { 1: 1, 2: 0.94, 3: 0.88 };

export function FloatingPanels({ label }: { label: string }) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("products");

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {panels.map(
        ({ key, Icon, label: labelKey, position, tier, rotate }, index) => (
          <motion.div
            key={key}
            className={cn("absolute", position, tierStyles[tier])}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 16, scale: tierScale[tier] }
            }
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: tier === 1 ? 1 : tier === 2 ? 0.9 : 0.8,
                    y: 0,
                    scale: tierScale[tier],
                  }
            }
            transition={{
              duration: 0.5,
              delay: 0.15 + index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ rotate: `${rotate}deg` }}
          >
            {/* Ambient drift. Slow, small and out of phase so the cluster
              breathes instead of pulsing in unison. */}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={{
                duration: 6 + index * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              // Solid-ish surface with a cool tint. A 60%-opacity white panel is
              // invisible on a near-white page — the reference gets away with
              // glass because its background carries a strong blue wash.
              className="border-border bg-surface shadow-card flex aspect-4/3 items-center justify-center rounded-2xl border bg-[linear-gradient(145deg,var(--surface),var(--background-subtle))]"
            >
              <span className="flex flex-col items-center gap-1.5 px-2 text-center">
                <Icon className="text-primary size-5 opacity-80 sm:size-6" />
                <span className="text-muted text-[0.6rem] leading-tight font-medium sm:text-[0.7rem]">
                  {t(labelKey)}
                </span>
              </span>
            </motion.div>
          </motion.div>
        ),
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}
