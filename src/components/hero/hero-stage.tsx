"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { ParallaxStage, useParallax } from "@/components/motion/tilt";

/**
 * The right-hand stage of the hero: the owner, standing among glass product
 * panels, with the two entry cards overlapping his lower body.
 *
 * Depth order, back to front: panels → owner → cards. The owner in front of
 * the panels is what makes the cluster read as *his* stock; the cards in front
 * of him anchor the composition to the page and stop him floating.
 *
 * ASSETS (docs/DECISIONS.md D-012, D-013): the owner and every product render
 * are cut out of the approved reference itself. They are interim — low
 * resolution — and are swapped for original photography when it is supplied.
 */

type Panel = {
  key: string;
  src: string;
  alt: string;
  /** Position within the stage. Percentages, so the cluster scales as one. */
  box: string;
  /** Visible below `lg`? Small screens keep only the four strongest panels. */
  mobile: boolean;
  delay: number;
  /** Product size inside its glass frame. */
  inset: string;
  /** Parallax travel in px; nearer panels move further (D-014). */
  depth: number;
  /**
   * Render as the reference's solid navy tile instead of glass. Only the tools
   * panel uses this: it is an icon tile in reference 02, not a product.
   */
  tile?: boolean;
};

const panels: Panel[] = [
  {
    key: "laptop",
    depth: 16,
    src: "/images/hero/laptop.png",
    alt: "Laptop",
    box: "left-[0%] top-[4%] w-[25%] aspect-[6/5]",
    mobile: true,
    delay: 0.18,
    inset: "p-[9%]",
  },
  {
    key: "tower",
    depth: 16,
    src: "/images/hero/tower.png",
    alt: "Gaming desktop",
    box: "right-[19%] top-[1%] w-[23%] aspect-[1/1.08]",
    mobile: true,
    delay: 0.24,
    inset: "p-[10%]",
  },
  {
    key: "cctv",
    depth: 10,
    src: "/images/hero/cctv.png",
    alt: "CCTV camera",
    box: "right-[0%] top-[8%] w-[16%] aspect-square",
    mobile: false,
    delay: 0.3,
    inset: "p-[12%]",
  },
  {
    key: "tools",
    depth: 13,
    src: "/images/hero/tools.png",
    alt: "Repair tools",
    box: "left-[-1%] top-[37%] w-[18%] aspect-square",
    mobile: true,
    delay: 0.36,
    inset: "p-[14%]",
    tile: true,
  },
  {
    key: "printer",
    depth: 11,
    src: "/images/hero/printer.png",
    alt: "Printer",
    box: "right-[2%] top-[36%] w-[23%] aspect-[4/3]",
    mobile: true,
    delay: 0.42,
    inset: "p-[10%]",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

/** Drifts its children with the stage's pointer parallax. */
function ParallaxLayer({
  depth,
  className,
  children,
}: {
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const { x, y } = useParallax(depth);
  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

export function HeroStage({
  ownerAlt,
  cards,
}: {
  ownerAlt: string;
  /** The dual entry cards, rendered by the server and placed here at `lg`. */
  cards: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    // Pointer parallax across the whole stage: panels drift by their own
    // depth, the owner slightly against them, so the cluster separates into
    // planes as the pointer moves.
    <ParallaxStage className="relative mx-auto h-[25rem] w-full max-w-xl sm:h-[30rem] lg:h-[38rem] lg:max-w-none">
      {panels.map((panel, index) => (
        <motion.div
          key={panel.key}
          className={cn(
            "absolute",
            panel.box,
            !panel.mobile && "hidden sm:block",
          )}
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: panel.delay, ease }}
        >
          <ParallaxLayer depth={panel.depth} className="h-full w-full">
            {/* Ambient drift: small, slow and out of phase per panel. */}
            <motion.div
              className={cn(
                "relative h-full w-full rounded-[1.6rem]",
                panel.tile
                  ? "from-primary-deep-2 to-primary-deep border-primary-foreground/15 border bg-linear-to-br shadow-[0_24px_44px_-20px_var(--primary-deep)]"
                  : "glass-panel",
              )}
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={{
                duration: 6.5 + index * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className={cn("relative h-full w-full", panel.inset)}>
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  fill
                  sizes="(min-width: 1024px) 220px, 140px"
                  className="object-contain drop-shadow-[0_14px_18px_color-mix(in_oklab,var(--primary-deep)_35%,transparent)]"
                />
              </div>
            </motion.div>
          </ParallaxLayer>
        </motion.div>
      ))}

      {/* The owner. Centred slightly left of the stage, as in the reference,
          and standing behind the entry cards. */}
      <motion.div
        className="absolute bottom-0 left-1/2 z-10 w-[76%] -translate-x-1/2 sm:w-[62%] lg:bottom-[6.75rem] lg:left-[46%] lg:w-[71%]"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease }}
      >
        <ParallaxLayer depth={-6}>
          <Image
            src="/images/hero/owner.png"
            alt={ownerAlt}
            width={866}
            height={896}
            priority
            sizes="(min-width: 1024px) 520px, 70vw"
            // The crop ends at the waist. Desktop hides that edge behind the entry
            // cards; on narrow screens a fade stops it reading as a hard cut.
            className="h-auto w-full [mask-image:linear-gradient(to_bottom,black_82%,transparent)] lg:[mask-image:none]"
          />
        </ParallaxLayer>
      </motion.div>

      {/* Entry cards overlap the owner at lg and above. Below lg they render
          as a normal block after the copy instead (see Hero). */}
      <div className="absolute inset-x-[7%] bottom-0 z-20 hidden lg:inset-x-[5%] lg:right-0 lg:block">
        {cards}
      </div>
    </ParallaxStage>
  );
}
