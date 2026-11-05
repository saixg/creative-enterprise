"use client";

import { useRef, type ComponentProps, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

/**
 * Spotlight card: a soft light follows the pointer across the surface.
 *
 * Writes CSS custom properties straight onto the element (no React state, so
 * no re-render per pointer frame); the `.spotlight` layer in globals.css
 * paints from them. Pointer only: touch never shows it. Under reduced motion
 * the light still appears, without transition, since it is a static paint.
 */
export function Spotlight({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    ref.current.style.setProperty("--spot-o", "1");
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => ref.current?.style.setProperty("--spot-o", "0")}
      className={cn("relative", className)}
      {...props}
    >
      <div
        aria-hidden
        className="spotlight pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      />
      {children}
    </div>
  );
}
