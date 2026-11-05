import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Admin building blocks. The admin favours operational clarity over
 * marketing theatre (doc 02 §7) but uses the same tokens as the website, so
 * it is visibly the same product.
 *
 * Admin copy is English only for now (docs/DECISIONS.md D-019): it is an
 * internal tool. Everything a CUSTOMER reads is edited here in both languages.
 */

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-3xl font-extrabold tracking-tight text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-muted mt-1.5 max-w-2xl text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  className,
  actions,
}: {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn("surface-card rounded-2xl p-5 sm:p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-bold">{title}</h2>}
            {description && (
              <p className="text-muted mt-1 text-sm text-pretty">
                {description}
              </p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

const tones = {
  neutral: "bg-surface-muted text-muted border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warm/12 text-warning border-warm/30",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
} as const;

export type Tone = keyof typeof tones;

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const inputClass =
  "border-border-strong bg-surface text-foreground placeholder:text-muted/70 h-11 w-full rounded-xl border px-3.5 text-sm " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring " +
  "aria-[invalid=true]:border-destructive disabled:opacity-60";

export const textareaClass = cn(
  inputClass,
  "h-auto min-h-24 py-3 leading-relaxed",
);

/**
 * A labelled field. The label always sits above the control (never a
 * placeholder-as-label), hints sit under the label, and an error replaces
 * nothing: it is added below and tied to the control with aria-describedby.
 */
export function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
  optional,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  optional?: boolean;
}) {
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional && (
          <span className="text-muted ms-1.5 font-normal">(optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-muted -mt-0.5 text-xs">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-destructive text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props tying a control to its Field hint and error. */
export function describedBy(id: string, hint?: unknown, error?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return {
    "aria-describedby": ids || undefined,
    "aria-invalid": error ? true : undefined,
  } as const;
}

export function Toggle({
  name,
  label,
  description,
  defaultChecked,
  id,
}: {
  name: string;
  label: string;
  description?: ReactNode;
  defaultChecked?: boolean;
  id?: string;
}) {
  const inputId = id ?? name;
  return (
    <label
      htmlFor={inputId}
      className="border-border hover:border-border-strong has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors"
    >
      <input
        id={inputId}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="accent-primary mt-0.5 size-4 shrink-0"
      />
      <span className="grid gap-0.5">
        <span className="text-sm font-semibold">{label}</span>
        {description && (
          <span className="text-muted text-xs text-pretty">{description}</span>
        )}
      </span>
    </label>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="border-border flex flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center">
      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
        {icon}
      </span>
      <h2 className="mt-4 font-bold">{title}</h2>
      <p className="text-muted mt-1 max-w-sm text-sm text-pretty">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="surface-card overflow-x-auto rounded-2xl">
      <table
        className={cn("w-full min-w-[40rem] text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "text-muted border-border border-b px-4 py-3 text-xs font-semibold tracking-wide uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("border-border border-b px-4 py-3 align-middle", className)}
      {...props}
    />
  );
}

/** Date/time for admin lists, in the business's time zone. */
export function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}
