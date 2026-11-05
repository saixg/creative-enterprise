"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Inbox,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { Link } from "@/i18n/navigation";
import type { ActionState } from "@/features/admin/schemas";
import {
  Badge,
  inputClass,
  textareaClass,
  type Tone,
} from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export type InboxRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  notes: string | null;
  locale: "en" | "gu";
  subject: string | null;
  subjectHref: string | null;
  source: string;
  created: string;
  createdRelative: string;
};

const tone = (status: string): Tone =>
  status === "new"
    ? "primary"
    : status === "closed" || status === "completed"
      ? "success"
      : status === "cancelled"
        ? "neutral"
        : "warning";

/**
 * Two-pane inbox: the list on the left, the selected message on the right
 * (stacked on phones). Contact links open the admin's own phone or WhatsApp;
 * nothing is ever sent automatically from here.
 */
export function InboxView({
  rows,
  statuses,
  update,
  subjectLabel,
}: {
  rows: InboxRow[];
  statuses: readonly (readonly [string, string])[];
  update: (values: {
    id: string;
    status: string;
    notes: string;
  }) => Promise<ActionState>;
  subjectLabel: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("open");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const label = (status: string) =>
    statuses.find(([value]) => value === status)?.[1] ?? status;
  const closed = (status: string) =>
    ["closed", "completed", "cancelled"].includes(status);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const byStatus =
        filter === "all" ||
        (filter === "open" ? !closed(row.status) : row.status === filter);
      const byQuery =
        !q ||
        `${row.name} ${row.phone} ${row.email ?? ""} ${row.message} ${row.subject ?? ""}`
          .toLowerCase()
          .includes(q);
      return byStatus && byQuery;
    });
  }, [rows, filter, query]);

  const selected = rows.find((r) => r.id === selectedId) ?? null;
  const filters: [string, string][] = [
    ["open", "Open"],
    ...statuses.map(([v, l]) => [v, l] as [string, string]),
    ["all", "All"],
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-60 flex-1">
          <span className="sr-only">Search</span>
          <Search
            aria-hidden
            className="text-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone or message"
            className={cn(inputClass, "ps-10")}
          />
        </label>
        <div
          role="group"
          aria-label="Filter by status"
          className="bg-surface-muted flex max-w-full overflow-x-auto rounded-full p-1"
        >
          {filters.map(([value, text]) => {
            const count =
              value === "all"
                ? rows.length
                : value === "open"
                  ? rows.filter((r) => !closed(r.status)).length
                  : rows.filter((r) => r.status === value).length;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-3.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  filter === value
                    ? "bg-surface text-foreground shadow-card"
                    : "text-muted hover:text-foreground",
                )}
              >
                {text}
                <span className="text-muted ms-1.5 tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <ul
          className={cn(
            "surface-card divide-border max-h-[70vh] divide-y overflow-y-auto rounded-2xl",
            selected && "hidden lg:block",
          )}
        >
          {visible.length === 0 && (
            <li className="text-muted px-5 py-12 text-center text-sm">
              Nothing here.
            </li>
          )}
          {visible.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => setSelectedId(row.id)}
                aria-current={row.id === selectedId || undefined}
                className={cn(
                  "hover:bg-surface-muted/60 grid w-full gap-1 px-4 py-3.5 text-start transition-colors",
                  row.id === selectedId && "bg-primary/5",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate",
                      row.status === "new" ? "font-bold" : "font-semibold",
                    )}
                  >
                    {row.name}
                  </span>
                  <span className="text-muted shrink-0 text-xs">
                    {row.createdRelative}
                  </span>
                </span>
                <span className="text-muted truncate text-sm">
                  {row.subject ? `${row.subject}: ` : ""}
                  {row.message}
                </span>
                <span className="mt-0.5">
                  <Badge tone={tone(row.status)}>{label(row.status)}</Badge>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className={cn(!selected && "hidden lg:block")}>
          {selected ? (
            <Detail
              key={selected.id + selected.status + (selected.notes ?? "")}
              row={selected}
              statuses={statuses}
              subjectLabel={subjectLabel}
              onBack={() => setSelectedId(null)}
              onSave={async (values) => {
                const result = await update({ id: selected.id, ...values });
                if (result.status === "success") {
                  toast.success(result.message ?? "Saved.");
                  router.refresh();
                } else toast.error(result.message ?? "Could not save.");
              }}
            />
          ) : (
            <div className="border-border text-muted flex h-full min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-10 text-center text-sm">
              <Inbox aria-hidden className="size-8" />
              Select a message to read it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  row,
  statuses,
  subjectLabel,
  onBack,
  onSave,
}: {
  row: InboxRow;
  statuses: readonly (readonly [string, string])[];
  subjectLabel: string;
  onBack: () => void;
  onSave: (values: { status: string; notes: string }) => Promise<void>;
}) {
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState(row.notes ?? "");
  const [pending, start] = useTransition();
  const dirty = status !== row.status || notes !== (row.notes ?? "");
  const digits = row.phone.replace(/\D/g, "");
  // Indian numbers are usually typed without the country code.
  const wa = digits.length === 10 ? `91${digits}` : digits;

  return (
    <article className="surface-card grid gap-6 rounded-2xl p-5 sm:p-6">
      <button
        type="button"
        onClick={onBack}
        className="text-muted hover:text-foreground inline-flex w-fit items-center gap-1 text-sm lg:hidden"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to list
      </button>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{row.name}</h2>
          <p className="text-muted mt-0.5 text-sm">
            {row.created} · prefers{" "}
            {row.locale === "gu" ? "Gujarati" : "English"}
            {row.source !== "web_form" ? ` · via ${row.source}` : ""}
          </p>
        </div>
        <Badge tone={tone(row.status)}>
          {statuses.find(([v]) => v === row.status)?.[1] ?? row.status}
        </Badge>
      </header>

      <div className="flex flex-wrap gap-2">
        <a
          href={`tel:${row.phone}`}
          className="border-border hover:border-border-strong inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
        >
          <Phone aria-hidden className="size-4" />
          {row.phone}
        </a>
        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border hover:border-border-strong inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
        >
          <MessageCircle aria-hidden className="size-4" />
          WhatsApp
        </a>
        {row.email && (
          <a
            href={`mailto:${row.email}`}
            className="border-border hover:border-border-strong inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
          >
            <Mail aria-hidden className="size-4" />
            {row.email}
          </a>
        )}
      </div>

      {row.subject && (
        <p className="text-sm">
          <span className="text-muted">{subjectLabel}: </span>
          {row.subjectHref ? (
            <Link
              href={row.subjectHref}
              className="text-primary font-semibold hover:underline"
            >
              {row.subject}
            </Link>
          ) : (
            <span className="font-semibold">{row.subject}</span>
          )}
        </p>
      )}

      <blockquote className="bg-surface-muted rounded-xl p-4 text-[0.95rem] leading-relaxed whitespace-pre-line">
        {row.message}
      </blockquote>

      <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
        <label className="grid content-start gap-1.5 text-sm font-semibold">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            {statuses.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Private notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={4000}
            rows={4}
            placeholder="Follow-up details. Only admins can see these."
            className={textareaClass}
          />
        </label>
      </div>

      <div>
        <button
          type="button"
          disabled={!dirty || pending}
          onClick={() => start(() => onSave({ status, notes }))}
          className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold disabled:opacity-50"
        >
          {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
          Save
        </button>
      </div>
    </article>
  );
}
