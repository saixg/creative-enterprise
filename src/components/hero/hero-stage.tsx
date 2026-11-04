"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { ParallaxStage, useParallax } from "@/components/motion/tilt";

/**
 * Hero stage: the owner on a deep-blue brand plate, with three product chips.
 *
 * Redesign notes (design audit, 2026-11-04):
 * - The previous stage floated a soft cut-out among five small glass boxes on
 *   a lavender field. It read as a collage of blurry fragments. The plate now
 *   gives the owner a deliberate frame, and its colour hides the soft edge of
 *   the low-resolution cut-out (D-012).
 * - His head breaks the plate's top edge. That one overlap is what gives the
 *   composition depth; everything else stays clean.
 * - Three labelled chips replace five unlabelled thumbnails: fewer, larger,
 *   and each says what it is.
 */

export type StageChip = {
  key: string;
  src: string;
  alt: string;
  label: string;
};

const chipLayout = [
  {
    box: "left-[-2%] top-[22%] w-[38%] lg:left-[-12%]",
    depth: 18,
    delay: 0.25,
  },
  {
    box: "right-[-2%] top-[44%] w-[34%] lg:right-[-10%]",
    depth: 12,
    delay: 0.35,
  },
  { box: "left-[4%] bottom-[6%] w-[30%] lg:left-[-6%]", depth: 9, delay: 0.45 },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function Chip({ chip, index }: { chip: StageChip; index: number }) {
  const reduceMotion = useReducedMotion();
  const layout = chipLayout[index] ?? chipLayout[0];
  const { x, y } = useParallax(layout.depth);

  return (
    <motion.figure
      className={cn("absolute z-20", layout.box)}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: layout.delay, ease }}
    >
      <motion.div
        style={{ x, y }}
        className="bg-surface border-border rounded-2xl border p-2.5 shadow-[0_24px_48px_-24px_color-mix(in_oklab,var(--primary-deep)_45%,transparent)]"
      >
        <div className="bg-surface-muted relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={chip.src}
            alt={chip.alt}
            fill
            sizes="(min-width: 1024px) 200px, 34vw"
            className="object-contain p-2"
          />
        </div>
        <figcaption className="text-foreground mt-2 px-1 text-[0.8rem] font-semibold sm:text-sm">
          {chip.label}
        </figcaption>
      </motion.div>
    </motion.figure>
  );
}

function Owner({ alt }: { alt: string }) {
  const reduceMotion = useReducedMotion();
  const { x, y } = useParallax(-5);

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease }}
    >
      <motion.div style={{ x, y }}>
        <Image
          src="/images/hero/owner.png"
          alt={alt}
          width={866}
          height={896}
          priority
          sizes="(min-width: 1024px) 420px, 72vw"
          className="h-auto w-full"
        />
      </motion.div>
    </motion.div>
  );
}

export function HeroStage({
  ownerAlt,
  chips,
}: {
  ownerAlt: string;
  chips: StageChip[];
}) {
  return (
    <ParallaxStage className="relative mx-auto aspect-[5/6] w-full max-w-[34rem]">
      {/* Brand plate, lower 80% of the stage, so the owner's head rises out
          of it. */}
      <div className="absolute inset-x-[8%] top-[34%] bottom-0 overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,var(--primary-deep-2),var(--primary-deep)_72%)]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_28%,color-mix(in_oklab,var(--accent)_40%,transparent),transparent_72%)]"
        />
      </div>

      {/* The figure is clipped to the plate's bottom corners, so his waist
          ends inside the plate rather than in a hard horizontal cut. */}
      <div className="absolute inset-x-[8%] top-0 bottom-0 overflow-hidden rounded-b-[2.5rem]">
        <Owner alt={ownerAlt} />
      </div>

      {chips.slice(0, 3).map((chip, index) => (
        <Chip key={chip.key} chip={chip} index={index} />
      ))}
    </ParallaxStage>
  );
}
