import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A page section that opts into one of the two theme value sets.
 *
 * The homepage carries both (docs/DECISIONS.md D-009): a light upper half and a
 * dark catalogue half. A section declaring `data-theme` must also paint its own
 * background, or it inherits the page theme's and the token swap is invisible.
 *
 * It deliberately does NOT set `data-page-theme` — that marker belongs to the
 * page shell and drives the root/overscroll colour. A dark section inside a
 * light page must not turn the whole document dark.
 */
export function ThemeSection({
  theme,
  className,
  children,
  ...props
}: Omit<ComponentProps<"section">, "children"> & {
  theme: "landing" | "app";
  children: ReactNode;
}) {
  return (
    <section
      data-theme={theme}
      className={cn("bg-background text-foreground", className)}
      {...props}
    >
      {children}
    </section>
  );
}

/**
 * The light-to-dark handoff between the two halves of the homepage.
 *
 * Static by design: animating a background transition at a section boundary
 * reads as a rendering glitch rather than as motion.
 */
export function TransitionBand() {
  return (
    <div
      aria-hidden
      className="h-28 w-full bg-[linear-gradient(to_bottom,var(--theme-landing-bg),var(--theme-app-bg))] sm:h-36"
    />
  );
}
