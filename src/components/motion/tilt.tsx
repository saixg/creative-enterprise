"use client";

import {
  createContext,
  useContext,
  useRef,
  type ComponentProps,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Depth motion (docs/DECISIONS.md D-014).
 *
 * `Tilt` turns its surface a few degrees toward the pointer, in real CSS 3D
 * space, with spring damping so it settles rather than snaps. `TiltLayer`
 * lifts a child off that surface along Z, so content inside a tilting card
 * separates into planes — that separation is what makes it read as depth
 * instead of a skewed rectangle.
 *
 * Guard rails, all enforced here so no caller can forget them:
 * - pointer (mouse/pen) only — on touch a tilt would fight scrolling
 * - capped angle, default 6°
 * - `prefers-reduced-motion` renders a flat, static wrapper
 */

const spring = { stiffness: 220, damping: 22, mass: 0.6 };

type TiltState = { enabled: boolean };
const TiltContext = createContext<TiltState>({ enabled: false });

export function Tilt({
  children,
  className,
  max = 6,
  glare = true,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  children: ReactNode;
  /** Maximum rotation in degrees. Keep it small; depth is seasoning. */
  max?: number;
  /** A soft highlight that follows the pointer across the surface. */
  glare?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position within the element, normalised to -0.5 … 0.5.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);

  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useSpring(0, spring);
  const glareBg = useMotionTemplate`radial-gradient(60% 60% at ${glareX} ${glareY}, color-mix(in oklab, var(--surface) 55%, transparent), transparent 70%)`;

  if (reduceMotion) {
    return (
      <div className={className} {...props}>
        <TiltContext.Provider value={{ enabled: false }}>
          {children}
        </TiltContext.Provider>
      </div>
    );
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
    glareOpacity.set(1);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
    glareOpacity.set(0);
  }

  return (
    // The outer element owns the perspective, so the inner surface rotates
    // in a real 3D space rather than an orthographic skew.
    <div
      className={cn("[perspective:1100px]", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...props}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full rounded-[inherit] will-change-transform"
      >
        <TiltContext.Provider value={{ enabled: true }}>
          {children}
        </TiltContext.Provider>

        {glare && (
          <motion.span
            aria-hidden
            style={{ background: glareBg, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />
        )}
      </motion.div>
    </div>
  );
}

/**
 * A child lifted off a `Tilt` surface. `depth` is in pixels along Z; 20–40 is
 * plenty. Outside an enabled `Tilt` it renders flat.
 */
export function TiltLayer({
  depth = 24,
  className,
  children,
}: {
  depth?: number;
  className?: string;
  children: ReactNode;
}) {
  const { enabled } = useContext(TiltContext);

  return (
    <div
      className={className}
      style={
        enabled
          ? {
              transform: `translateZ(${depth}px)`,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

/**
 * Pointer parallax for a whole stage. Children read the shared, spring-damped
 * pointer offset with `useParallax(depth)` and drift by different amounts —
 * nearer layers further — which is what gives the hero cluster its depth.
 */
type ParallaxState = { x: MotionValue<number>; y: MotionValue<number> } | null;
const ParallaxContext = createContext<ParallaxState>(null);

export function ParallaxStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 90, damping: 20 });
  const y = useSpring(rawY, { stiffness: 90, damping: 20 });

  return (
    <div
      className={className}
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        rawX.set((event.clientX - rect.left) / rect.width - 0.5);
        rawY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      <ParallaxContext.Provider value={reduceMotion ? null : { x, y }}>
        {children}
      </ParallaxContext.Provider>
    </div>
  );
}

/**
 * Offset for a layer inside `ParallaxStage`. `depth` is the maximum travel in
 * pixels: positive moves with the pointer, negative against it.
 */
export function useParallax(depth: number) {
  const ctx = useContext(ParallaxContext);
  const zero = useMotionValue(0);
  const x = useTransform(ctx?.x ?? zero, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(ctx?.y ?? zero, [-0.5, 0.5], [-depth, depth]);
  return { x, y };
}
