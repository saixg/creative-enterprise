"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Kinetic pieces for the landing page (docs/DECISIONS.md D-023).
 *
 * Each one has a reason, per doc 02 section 9 ("animation should improve
 * understanding, hierarchy or perceived quality"):
 *
 *   RiseLine      hierarchy: the headline arrives a line at a time, so the
 *                 eye reads the lead-in before the brand words
 *   DrawUnderline storytelling: the brand's signature swoosh draws itself,
 *                 finishing the headline rather than being there from frame 1
 *   Magnetic      feedback: the primary action leans toward the pointer, so
 *                 it feels picked up rather than merely hovered
 *
 * All three collapse to their finished, static state under
 * `prefers-reduced-motion`, and none of them delays interaction: the CTA is
 * clickable from first paint whatever the animation is doing.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One line of a headline, rising out of a clipping mask.
 *
 * The mask is what sells it: the text travels from fully below its own box,
 * so it is revealed rather than merely faded. `pb`/`pt` padding keeps room
 * for descenders and, in Gujarati, for the matras above the line, which a
 * tight clip would otherwise shear.
 */
export function RiseLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={cn("block", className)}>{children}</span>;
  }

  return (
    <span
      className={cn("block overflow-hidden pt-[0.14em] pb-[0.08em]", className)}
    >
      <motion.span
        className="block"
        initial={{ y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.85, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * The hand-drawn swoosh under the emphasised word, drawing itself left to
 * right. `pathLength` is normalised to 1 by Motion, so the dash maths does
 * not depend on the path's real length.
 */
export function DrawUnderline({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 400 30"
      preserveAspectRatio="none"
      className={className}
    >
      <motion.path
        d="M6 22 C 120 8, 260 4, 394 10"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="7"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={reduce ? undefined : { pathLength: 1 }}
        transition={{ duration: 0.7, delay, ease: EASE }}
      />
    </svg>
  );
}

/**
 * Magnetic wrapper: the child leans a few pixels toward the pointer and
 * springs back on leave.
 *
 * Pointer position drives motion values directly, never React state, so a
 * pointer move costs no render (doc: one re-render per frame collapses on
 * mobile). Touch is excluded, because a magnet that fires on tap just makes
 * the button feel loose.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  /** Fraction of the pointer's offset the element travels. Keep it small. */
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  if (reduce) {
    return <span className={cn("inline-block", className)}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
      onPointerMove={(event) => {
        if (event.pointerType === "touch" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((event.clientX - (r.left + r.width / 2)) * strength);
        y.set((event.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
