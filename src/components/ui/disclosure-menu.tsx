"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A small disclosure menu: a button that opens a panel of links.
 *
 * Used for the header's Products ▾, Services ▾ and language pickers. The
 * reference draws those chevrons, and a chevron that opens nothing is a false
 * affordance, so they are real menus.
 *
 * Behaviour: click or Enter/Space toggles; Escape closes and returns focus to
 * the button; clicking outside or tabbing out closes. It is a disclosure
 * (button + region), not an ARIA `menu`, because its children are ordinary
 * navigation links that should behave like links.
 */
export function DisclosureMenu({
  label,
  icon,
  children,
  align = "start",
  buttonClassName,
  panelClassName,
}: {
  label: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  buttonClassName?: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      // Close when focus leaves the whole widget, so keyboard users tabbing
      // past it are not left with a stray open panel.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full transition-colors",
          "focus-visible:outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
          buttonClassName,
        )}
      >
        {icon}
        {label}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        onClick={() => setOpen(false)}
        className={cn(
          "bg-surface/95 border-border shadow-raised absolute top-full z-50 mt-2 min-w-52 rounded-2xl border p-2 backdrop-blur-xl",
          align === "end" ? "end-0" : "start-0",
          panelClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** A link row inside a `DisclosureMenu` panel. */
export const menuItemClasses =
  "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium " +
  "text-foreground transition-colors hover:bg-primary/10 hover:text-primary " +
  "focus-visible:outline-focus-ring focus-visible:outline-2";
