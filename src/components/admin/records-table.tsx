"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImageOff, Search } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge, inputClass, type Tone } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export type RecordRow = {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  image: string | null;
  status: "draft" | "published";
  badges: { label: string; tone: Tone }[];
  meta: string;
  updated: string;
};

/**
 * Searchable, filterable list of products or services. Filtering is local:
 * the full list is small (a single store), and it keeps every keystroke
 * instant without a request.
 */
export function RecordsTable({
  rows,
  noun,
}: {
  rows: RecordRow[];
  noun: string;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (status === "all" || row.status === status) &&
        (!q || `${row.title} ${row.subtitle}`.toLowerCase().includes(q)),
    );
  }, [rows, query, status]);

  const counts = {
    all: rows.length,
    published: rows.filter((r) => r.status === "published").length,
    draft: rows.filter((r) => r.status === "draft").length,
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-60 flex-1">
          <span className="sr-only">Search {noun}</span>
          <Search
            aria-hidden
            className="text-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${noun}`}
            className={cn(inputClass, "ps-10")}
          />
        </label>
        <div
          role="group"
          aria-label="Filter by status"
          className="bg-surface-muted flex rounded-full p-1"
        >
          {(["all", "published", "draft"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => setStatus(value)}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-semibold capitalize transition-colors",
                status === value
                  ? "bg-surface text-foreground shadow-card"
                  : "text-muted hover:text-foreground",
              )}
            >
              {value === "all"
                ? "All"
                : value === "published"
                  ? "Live"
                  : "Drafts"}
              <span className="text-muted ms-1.5 tabular-nums">
                {counts[value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted border-border rounded-2xl border border-dashed px-6 py-10 text-center text-sm">
          No {noun} match.
        </p>
      ) : (
        <ul className="surface-card divide-border divide-y overflow-hidden rounded-2xl">
          {visible.map((row) => (
            <li key={row.id}>
              <Link
                href={row.href}
                className="hover:bg-surface-muted/60 focus-visible:bg-surface-muted/60 grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-4 px-4 py-3 transition-colors focus-visible:outline-none sm:grid-cols-[3.5rem_minmax(0,1fr)_auto]"
              >
                <span className="bg-surface-muted relative flex size-14 items-center justify-center overflow-hidden rounded-xl">
                  {row.image ? (
                    <Image
                      src={row.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain p-1.5"
                    />
                  ) : (
                    <ImageOff aria-hidden className="text-muted size-5" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold">{row.title}</span>
                    {row.status === "published" ? (
                      <Badge tone="success">Live</Badge>
                    ) : (
                      <Badge>Draft</Badge>
                    )}
                    {row.badges.map((b) => (
                      <Badge key={b.label} tone={b.tone}>
                        {b.label}
                      </Badge>
                    ))}
                  </span>
                  <span className="text-muted mt-0.5 block truncate text-sm">
                    {row.subtitle}
                  </span>
                </span>
                <span className="text-muted hidden text-end text-sm sm:block">
                  <span className="text-foreground block font-semibold tabular-nums">
                    {row.meta}
                  </span>
                  <span className="text-xs">Updated {row.updated}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
