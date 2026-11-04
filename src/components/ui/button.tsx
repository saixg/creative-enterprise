import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow",
  secondary:
    "bg-surface text-foreground border border-border hover:border-border-strong shadow-card",
  ghost: "text-foreground hover:bg-surface-muted",
  inverse:
    "bg-surface-inverse text-foreground-inverse hover:opacity-90 shadow-raised",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

/**
 * Anchor styled as a button. Separate from `Button` on purpose: a link that
 * navigates must stay an anchor for keyboard and assistive-tech behaviour.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
