"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * A vertical process timeline whose line draws itself as you scroll.
 *
 * Motivation: the four steps of a service request are a sequence, and tying
 * the line to scroll makes "you are here in the process" literal. Each step's
 * marker lights up as the line reaches it.
 *
 * Driven by Motion's `useScroll` on the section (no scroll listeners), spring
 * smoothed, and fully drawn and static under `prefers-reduced-motion`.
 */
export type TimelineStep = {
  key: string;
  title: string;
  body: string;
  icon: ReactNode;
};

function Marker({
  index,
  count,
  progress,
  icon,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  icon: ReactNode;
}) {
  // Each marker activates as the line passes its position.
  const at = count > 1 ? index / (count - 1) : 0;
  const lit = useTransform(progress, [Math.max(at - 0.12, 0), at], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.85, 1]);

  return (
    <div className="relative size-12 shrink-0">
      <div className="border-border bg-surface text-muted absolute inset-0 flex items-center justify-center rounded-full border">
        {icon}
      </div>
      <motion.div
        style={{ opacity: lit, scale }}
        className="bg-primary text-primary-foreground absolute inset-0 flex items-center justify-center rounded-full shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
      >
        {icon}
      </motion.div>
    </div>
  );
}

export function ScrollTimeline({ steps }: { steps: TimelineStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const full = useTransform(smooth, () => 1);
  const progress = reduce ? full : smooth;

  return (
    <ol ref={ref} className="relative grid gap-10">
      {/* Track and the drawn line, centred on the 48px markers. */}
      <span
        aria-hidden
        className="bg-border absolute top-6 bottom-6 left-6 w-0.5 -translate-x-1/2"
      />
      <motion.span
        aria-hidden
        style={{ scaleY: progress }}
        className="from-primary to-accent-soft absolute top-6 bottom-6 left-6 w-0.5 origin-top -translate-x-1/2 bg-linear-to-b"
      />

      {steps.map((step, index) => (
        <li key={step.key} className="relative flex gap-6">
          <Marker
            index={index}
            count={steps.length}
            progress={progress}
            icon={step.icon}
          />
          <div className="pt-2.5">
            <h3 className="text-lg font-bold tracking-tight">{step.title}</h3>
            <p className="text-muted mt-1.5 max-w-md text-pretty">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
