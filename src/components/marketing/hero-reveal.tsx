"use client";

import type { ReactNode } from "react";
import { Children } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Staggered entrance for the hero copy column.
 *
 * Each direct child rises 16px and fades in, 60ms apart — the design system's
 * stagger. It animates `transform` and `opacity` only, and collapses to a plain
 * wrapper under `prefers-reduced-motion` so nothing moves and nothing is
 * delayed.
 */
export function HeroReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
