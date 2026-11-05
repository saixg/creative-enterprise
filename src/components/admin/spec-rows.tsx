"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

import type { Spec } from "@/types/catalog";
import { inputClass } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

/**
 * Editable label/value rows for a product's specification table. Serialised
 * into one hidden JSON field so the server action validates the whole list.
 * Rows with an empty label or value are dropped on save, never stored blank.
 */
export function SpecRows({
  name,
  initial,
  error,
}: {
  name: string;
  initial: Spec[];
  error?: string;
}) {
  const [rows, setRows] = useState<(Spec & { key: number })[]>(() =>
    initial.map((spec, key) => ({ ...spec, key })),
  );
  const [nextKey, setNextKey] = useState(initial.length);

  const update = (key: number, patch: Partial<Spec>) =>
    setRows((all) => all.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const move = (index: number, by: -1 | 1) =>
    setRows((all) => {
      const next = [...all];
      const target = index + by;
      if (target < 0 || target >= next.length) return all;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });

  const clean = rows
    .map(({ label, value }) => ({ label: label.trim(), value: value.trim() }))
    .filter((r) => r.label && r.value);

  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={JSON.stringify(clean)} />
      {rows.length === 0 && (
        <p className="text-muted text-sm">
          No specifications yet. Add only what you have verified.
        </p>
      )}
      <ul className="grid gap-2">
        {rows.map((row, index) => (
          <li key={row.key} className="grid grid-cols-[1fr_1.6fr_auto] gap-2">
            <input
              aria-label={`Specification ${index + 1} label`}
              placeholder="Processor"
              value={row.label}
              maxLength={60}
              onChange={(e) => update(row.key, { label: e.target.value })}
              className={inputClass}
            />
            <input
              aria-label={`Specification ${index + 1} value`}
              placeholder="Intel Core i5-13420H"
              value={row.value}
              maxLength={200}
              onChange={(e) => update(row.key, { value: e.target.value })}
              className={inputClass}
            />
            <div className="flex items-center gap-0.5">
              <IconButton
                label="Move up"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="size-4" />
              </IconButton>
              <IconButton
                label="Move down"
                disabled={index === rows.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="size-4" />
              </IconButton>
              <IconButton
                label="Remove"
                onClick={() =>
                  setRows((all) => all.filter((r) => r.key !== row.key))
                }
                className="hover:text-destructive"
              >
                <X className="size-4" />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          setRows((all) => [...all, { key: nextKey, label: "", value: "" }]);
          setNextKey((k) => k + 1);
        }}
        className="text-primary hover:bg-primary/5 inline-flex h-10 w-fit items-center gap-1.5 rounded-xl px-3 text-sm font-semibold"
      >
        <Plus aria-hidden className="size-4" />
        Add specification
      </button>
      {error && (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

function IconButton({
  label,
  className,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "text-muted hover:text-foreground hover:bg-surface-muted flex size-9 items-center justify-center rounded-lg disabled:opacity-30",
        className,
      )}
      {...props}
    />
  );
}
