"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { ParallaxStage, useParallax } from "@/components/motion/tilt";

/**
 * Hero stage, rebuilt toward reference 02 (D-020): the owner inside a
 * luminous halo, surrounded by floating frosted-glass product tiles.
 *
 * What changed from the D-013 attempt the owner rejected: that one pasted
 * soft, low-resolution fragments straight onto the field. Here each product
 * sits on a real glass material (globals.css .glass-tile) at a size its
 * source image can hold sharply, and the halo, not a hard plate, carries the
 * owner's soft cut-out edge.
 *
 * Motion, each with a reason:
 *   - staggered entrance (300ms ease-out): reveals the cluster in reading order
 *   - pointer parallax, nearer tiles travel further: depth
 *   - slow float on each tile, offset phases: the reference's weightlessness.
 *     Scenery only; it stops under prefers-reduced-motion.
 */

export type StageChip = {
  key: string;
  src: string;
  alt: string;
  label: string;
};

type Slot = {
  box: string;
  depth: number;
  float: string;
  /** Hidden on small screens, where five tiles would crowd the owner. */
  wide?: boolean;
};

const slots: Slot[] = [
  { box: "left-[0%] top-[10%] w-[31%]", depth: 22, float: "-1s" },
  { box: "right-[0%] top-[4%] w-[27%]", depth: 16, float: "-3.5s" },
  { box: "right-[-6%] top-[35%] w-[20%]", depth: 26, float: "-5s", wide: true },
  {
    box: "left-[-4%] top-[50%] w-[21%]",
    depth: 12,
    float: "-2.2s",
    wide: true,
  },
  { box: "right-[2%] bottom-[3%] w-[26%]", depth: 18, float: "-6s" },
];

const ease = [0.16, 1, 0.3, 1] as const;

function Tile({
  chip,
  slot,
  index,
}: {
  chip: StageChip;
  slot: Slot;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const { x, y } = useParallax(slot.depth);

  return (
    <motion.figure
      className={cn("absolute z-20", slot.box, slot.wide && "hidden sm:block")}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 + index * 0.06, ease }}
    >
      <motion.div style={{ x, y }}>
        <div
          className="animate-float"
          style={{ ["--float-delay" as string]: slot.float }}
        >
          <div className="glass-tile rounded-[1.6rem] p-2.5 sm:p-3">
            <div className="relative aspect-square">
              <Image
                src={chip.src}
                alt={chip.alt}
                fill
                sizes="(min-width: 1024px) 180px, 28vw"
                className="object-contain p-1 drop-shadow-[0_14px_16px_color-mix(in_oklab,var(--primary-deep)_35%,transparent)]"
              />
            </div>
            <figcaption className="text-primary-deep mt-1 truncate px-1 text-center text-[0.7rem] font-semibold sm:text-xs">
              {chip.label}
            </figcaption>
          </div>
        </div>
      </motion.div>
    </motion.figure>
  );
}

function Owner({ alt }: { alt: string }) {
  const reduceMotion = useReducedMotion();
  const { x, y } = useParallax(-6);

  return (
    <motion.div
      className="absolute inset-x-[14%] bottom-0 z-10"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease }}
    >
      <motion.div style={{ x, y }}>
        <Image
          src="/images/hero/owner.png"
          alt={alt}
          width={866}
          height={896}
          priority
          sizes="(min-width: 1024px) 440px, 72vw"
          className="h-auto w-full [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
        />
      </motion.div>
    </motion.div>
  );
}

function Halo() {
  const { x, y } = useParallax(-3);
  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="absolute inset-x-[10%] top-[12%] aspect-square rounded-full"
    >
      {/* Light disc */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#eaf0ff_38%,color-mix(in_oklab,var(--primary)_22%,#dfe7ff)_70%,transparent_72%)]" />
      {/* Glass ring: the reference's glow framing (D-002, D-010). */}
      <div className="absolute inset-[3%] rounded-full border border-white/80 shadow-[inset_0_0_40px_color-mix(in_oklab,white_70%,transparent),0_0_70px_-10px_color-mix(in_oklab,var(--primary)_45%,transparent)]" />
      <div className="absolute inset-[9%] rounded-full border border-[color-mix(in_oklab,var(--primary)_18%,transparent)]" />
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
    <ParallaxStage className="relative mx-auto aspect-[1/1.05] w-full max-w-[38rem]">
      <Halo />
      <Owner alt={ownerAlt} />
      {chips.slice(0, slots.length).map((chip, index) => (
        <Tile key={chip.key} chip={chip} slot={slots[index]!} index={index} />
      ))}
    </ParallaxStage>
  );
}
