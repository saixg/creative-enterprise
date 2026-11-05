"use client";

import { useRef, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { ActionState } from "@/features/admin/schemas";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

/**
 * A destructive action behind a named confirmation dialog. The dialog names
 * what will be lost, because "Are you sure?" alone teaches people to click
 * through.
 */
export function DangerButton({
  action,
  title,
  body,
  confirmLabel,
  children,
}: {
  action: () => Promise<ActionState>;
  /** e.g. Delete product “HP Victus 15”? */
  title: string;
  body: string;
  /** The destructive verb, e.g. "Delete product". */
  confirmLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const trigger = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        className="text-destructive hover:bg-destructive/10 border-destructive/30 inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
      >
        <Trash2 aria-hidden className="size-4" />
        {children}
      </button>
      <ConfirmDialog
        open={open}
        title={title}
        body={body}
        confirmLabel={confirmLabel}
        pending={pending}
        onCancel={close}
        onConfirm={() =>
          start(async () => {
            const result = await action();
            // Success redirects away; only an error lands back here.
            if (result?.status === "error") {
              toast.error(result.message ?? "That did not work.");
              close();
            }
          })
        }
      />
    </>
  );
}
