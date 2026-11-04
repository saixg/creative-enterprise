"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { ParallaxStage, useParallax } from "@/components/motion/tilt";
import { cn } from "@/lib/utils";

/**
 * Services band visual: the repair photo as the hero plane, with three
 * service renders floating in front of it at different depths.
 *
 * Depth comes from three things together: pointer parallax (nearer layers
 * travel further), scale, and a soft shadow tinted to the band. A slow light
 * ring turns behind everything; under `prefers-reduced-motion` the global
 * stylesheet stops it, and parallax switches off in `ParallaxStage`.
 *
 * Images are interim crops from the design references (D-013, D-016).
 */
const floaters = [
  {
    key: "tools",
    src: "/images/storefront/cat-services.png",
    box: "left-[-6%] top-[8%] w-[30%]",
    depth: 22,
    delay: 0.3,
  },
  {
    key: "cctv",
    src: "/images/hero/cctv.png",
    box: "right-[-4%] top-[2%] w-[28%]",
    depth: 16,
    delay: 0.4,
  },
  {
    key: "printer",
    src: "/images/hero/printer.png",
    box: "right-[2%] bottom-[-2%] w-[34%]",
    depth: 12,
    delay: 0.5,
  },
] as const;

function Floater({ f }: { f: (typeof floaters)[number] }) {
  const reduce = useReducedMotion();
  const { x, y } = useParallax(f.depth);
  return (
    <motion.div
      className={cn("absolute z-20", f.box)}
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.94 }}
      animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: f.delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        style={{ x, y }}
        className="border-border/70 bg-surface/70 rounded-2xl border p-3 shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--accent)_60%,transparent)] backdrop-blur-md"
      >
        <div className="relative aspect-square">
          <Image
            src={f.src}
            alt=""
            fill
            sizes="180px"
            className="object-contain"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Centre() {
  const reduce = useReducedMotion();
  const { x, y } = useParallax(-6);
  return (
    <motion.div
      className="absolute inset-[12%_14%_10%_10%] z-10"
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      animate={reduce ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        style={{ x, y }}
        className="border-border relative h-full w-full overflow-hidden rounded-[2rem] border shadow-[0_40px_90px_-40px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
      >
        <Image
          src="/images/storefront/promo-repair.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 420px, 80vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--background)_60%,transparent),transparent_55%)]"
        />
      </motion.div>
    </motion.div>
  );
}

export function ServiceStage({ label }: { label: string }) {
  return (
    <ParallaxStage className="relative mx-auto aspect-[1/1] w-full max-w-[32rem]">
      <span className="sr-only">{label}</span>
      {/* Slow light ring. Decorative; stops under reduced motion. */}
      <div
        aria-hidden
        className="absolute inset-[4%] animate-[spin_28s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,color-mix(in_oklab,var(--accent)_55%,transparent)_70deg,transparent_140deg,color-mix(in_oklab,var(--primary)_45%,transparent)_230deg,transparent_300deg)] opacity-60 blur-2xl"
      />
      <Centre />
      {floaters.map((f) => (
        <Floater key={f.key} f={f} />
      ))}
    </ParallaxStage>
  );
}
