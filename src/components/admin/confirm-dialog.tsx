"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

/**
 * Confirmation for destructive actions (vectorlab surfaces skill):
 *   - the title names the exact item ("Delete product 'HP Victus 15'?")
 *   - the confirm button carries the destructive verb, in destructive colour
 *   - Cancel has focus when the dialog opens; Escape cancels
 *   - focus returns to the button that opened it
 *
 * Native <dialog>.showModal() supplies the focus trap, the inert page behind
 * it and Escape handling, so none of that is reimplemented here.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  pending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancel.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      aria-labelledby="confirm-title"
      className="bg-surface text-foreground border-border m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border p-0 shadow-[var(--shadow-raised)] backdrop:bg-[color-mix(in_oklab,var(--surface-inverse)_45%,transparent)] backdrop:backdrop-blur-sm"
    >
      <div className="grid gap-3 p-6">
        <h2 id="confirm-title" className="text-lg font-bold text-balance">
          {title}
        </h2>
        <div className="text-muted text-sm text-pretty">{body}</div>
      </div>
      <div className="bg-surface-muted flex justify-end gap-2 rounded-b-2xl px-6 py-4">
        <button
          ref={cancel}
          type="button"
          disabled={pending}
          onClick={onCancel}
          className="border-border-strong bg-surface hover:bg-background h-10 rounded-full border px-5 text-sm font-semibold disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={onConfirm}
          className="bg-destructive inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
