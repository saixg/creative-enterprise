"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Monitor, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Catalogue search from the storefront reference (D-016).
 *
 * Searches the catalogue in the browser: it is small, and searching client-side
 * keeps every page statically prerendered. Matches name, brand, category and
 * the spec line, all words required, case-insensitive.
 *
 * Keyboard: Ctrl+K / ⌘K focuses it, arrows move through results, Enter opens
 * the highlighted product, Escape closes. It is an ARIA combobox so a screen
 * reader announces the result list and the active option.
 */
export type SearchItem = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  specs: string;
  image: string | null;
};

const noopSubscribe = () => () => {};

export function CatalogueSearch({
  items,
  className,
}: {
  items: SearchItem[];
  className?: string;
}) {
  const t = useTranslations("search");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  // Platform for the shortcut hint. The server snapshot is "not Mac", so the
  // first client render matches the HTML and hydration stays clean.
  const isMac = useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return items
      .filter((item) => {
        const hay =
          `${item.name} ${item.brand} ${item.category} ${item.specs}`.toLowerCase();
        return words.every((word) => hay.includes(word));
      })
      .slice(0, 6);
  }, [items, query]);

  const showPanel = open && query.trim().length > 0;

  function go(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/products/${slug}`);
  }

  return (
    <div className={cn("relative", className)}>
      <div className="border-border bg-surface/60 focus-within:border-accent flex h-11 items-center gap-3 rounded-full border px-4 transition-colors">
        <Search aria-hidden className="text-muted size-4 shrink-0" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showPanel && results[active] ? `${listId}-${active}` : undefined
          }
          aria-label={t("label")}
          placeholder={t("placeholder")}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((i) =>
                Math.min(i + 1, Math.max(results.length - 1, 0)),
              );
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (event.key === "Enter" && results[active]) {
              event.preventDefault();
              go(results[active].slug);
            } else if (event.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          className="placeholder:text-muted text-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <kbd className="border-border text-muted hidden rounded-md border px-1.5 py-0.5 font-sans text-[0.7rem] sm:inline">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </div>

      {showPanel && (
        <ul
          id={listId}
          role="listbox"
          className="bg-surface border-border shadow-raised absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border p-1.5"
        >
          {results.length === 0 ? (
            <li className="text-muted px-3 py-4 text-sm">
              {t("noResults", { query })}
            </li>
          ) : (
            results.map((item, index) => (
              <li
                key={item.slug}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseDown={(event) => {
                  event.preventDefault();
                  go(item.slug);
                }}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2",
                  index === active && "bg-primary/12",
                )}
              >
                <span className="bg-surface-muted relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <Monitor
                      aria-hidden
                      className="text-border-strong size-5"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="text-foreground block truncate text-sm font-semibold">
                    {item.name}
                  </span>
                  <span className="text-muted block truncate text-xs">
                    {item.brand} · {item.specs}
                  </span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
