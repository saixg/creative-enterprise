"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Reveal-on-scroll for a group of items.
 *
 * Each direct child rises and fades in once, as it enters the viewport, with a
 * short stagger. Motivation: it paces a dense grid so the eye reads it in
 * order instead of all at once. It plays once, never on every scroll pass,
 * and renders static under `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  itemClassName,
  as = "div",
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  as?: "div" | "ul" | "ol";
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const Item = as === "div" ? motion.div : motion.li;
  const Wrapper = as;

  return (
    <Wrapper className={className}>
      {Children.map(children, (child, index) => (
        <Item
          className={itemClassName}
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.3,
            delay: index * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </Item>
      ))}
    </Wrapper>
  );
}

/**
 * A single revealed item, for layouts where the grid cell itself carries
 * layout classes (bento spans) and cannot be the animated element.
 */
export function RevealItem({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.3,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
