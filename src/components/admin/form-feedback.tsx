"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { ActionState } from "@/features/admin/schemas";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Announces a server action's result once per submission. */
export function useActionToast(state: ActionState) {
  const last = useRef(state);
  useEffect(() => {
    if (state === last.current) return;
    last.current = state;
    if (state.status === "success" && state.message)
      toast.success(state.message);
    if (state.status === "error" && state.message) toast.error(state.message);
  }, [state]);
}

/**
 * A submit button that shows its own pending state. `intent` is sent as the
 * button's value, so one form can save, publish or unpublish.
 */
export function SubmitButton({
  intent,
  children,
  variant = "primary",
  className,
}: {
  intent?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const { pending, data } = useFormStatus();
  const mine = pending && (intent ? data?.get("intent") === intent : true);
  return (
    <button
      type="submit"
      name={intent ? "intent" : undefined}
      value={intent}
      disabled={pending}
      aria-busy={mine || undefined}
      className={buttonClasses({
        variant,
        className: cn("min-w-28", className),
      })}
    >
      {mine && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

/** Form-level error summary, announced to assistive tech. */
export function FormAlert({ state }: { state: ActionState }) {
  if (state.status !== "error" || !state.message) return null;
  return (
    <p
      role="alert"
      className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-sm"
    >
      {state.message}
    </p>
  );
}
