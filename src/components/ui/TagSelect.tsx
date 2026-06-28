"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { TopicChip } from "@/components/ui/TopicChip";
import { cn } from "@/lib/utils";

interface TagSelectProps {
  value: string[];
  onChange: (tags: string[]) => void;
  /** Suggested options shown in the dropdown (users can still add custom). */
  suggestions: string[];
  placeholder?: string;
}

/**
 * Generic multi-select with custom entry and full keyboard navigation.
 * Used for both question topics and pattern tags.
 */
export function TagSelect({
  value,
  onChange,
  suggestions,
  placeholder = "Select tags…"
}: TagSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const all = Array.from(new Set([...suggestions, ...value]));
    return all.filter((t) =>
      t.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query, value, suggestions]);

  const canAddCustom =
    query.trim().length > 0 &&
    !options.some((o) => o.toLowerCase() === query.trim().toLowerCase());

  const itemCount = options.length + (canAddCustom ? 1 : 0);

  useEffect(() => {
    setActiveIndex((i) => Math.max(0, Math.min(i, itemCount - 1)));
  }, [itemCount]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const toggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  const addCustom = () => {
    const t = query.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (itemCount === 0 ? 0 : (i + 1) % itemCount));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) =>
          itemCount === 0 ? 0 : (i - 1 + itemCount) % itemCount
        );
        break;
      case "Enter":
        e.preventDefault();
        if (canAddCustom && activeIndex === options.length) {
          addCustom();
        } else if (options[activeIndex]) {
          toggle(options[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Backspace":
        if (query === "" && value.length > 0) {
          onChange(value.slice(0, -1));
        }
        break;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setActiveIndex(0);
        }}
        className="flex min-h-[2.75rem] w-full flex-wrap items-center gap-1.5 rounded-xl border border-input bg-background px-3 py-2 text-left text-sm transition-colors hover:border-ring/50 focus:outline-none"
      >
        {value.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          value.map((t) => (
            <TopicChip key={t} label={t} onRemove={() => toggle(t)} />
          ))
        )}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="border-b border-border p-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search, ↑↓ to navigate, Enter to select…"
                className="w-full rounded-lg bg-background px-3 py-2 text-sm outline-none"
              />
            </div>
            <div ref={listRef} className="max-h-56 overflow-y-auto p-1">
              {options.map((tag, idx) => {
                const selected = value.includes(tag);
                const active = idx === activeIndex;
                return (
                  <button
                    key={tag}
                    type="button"
                    data-index={idx}
                    onClick={() => toggle(tag)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-accent" : "hover:bg-accent",
                      selected && "text-primary"
                    )}
                  >
                    {tag}
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border text-[10px]",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      )}
                    >
                      {selected && "✓"}
                    </span>
                  </button>
                );
              })}
              {canAddCustom && (
                <button
                  type="button"
                  data-index={options.length}
                  onClick={addCustom}
                  onMouseEnter={() => setActiveIndex(options.length)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary transition-colors",
                    activeIndex === options.length ? "bg-accent" : "hover:bg-accent"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Add &quot;{query.trim()}&quot;
                </button>
              )}
              {itemCount === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No tags found.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
