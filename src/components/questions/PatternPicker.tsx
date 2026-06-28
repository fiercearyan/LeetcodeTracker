"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TopicChip } from "@/components/ui/TopicChip";
import { cn } from "@/lib/utils";

export interface PatternOption {
  _id: string;
  name: string;
}

interface PatternPickerProps {
  value: string[];
  onChange: (ids: string[]) => void;
  options: PatternOption[];
}

/**
 * Searchable multi-select of existing patterns. Stores pattern ObjectIds but
 * displays names. New patterns are created in the Pattern Library, not here.
 */
export function PatternPicker({ value, onChange, options }: PatternPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const nameById = useMemo(
    () => new Map(options.map((o) => [o._id, o.name])),
    [options]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    setActiveIndex((i) => Math.max(0, Math.min(i, filtered.length - 1)));
  }, [filtered.length]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const toggle = (id: string) =>
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        filtered.length === 0 ? 0 : (i + 1) % filtered.length
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) toggle(filtered[activeIndex]._id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Backspace" && query === "" && value.length > 0) {
      onChange(value.slice(0, -1));
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
          <span className="text-muted-foreground">
            {options.length === 0
              ? "No patterns yet — create some in the Pattern Library"
              : "Link patterns…"}
          </span>
        ) : (
          value.map((id) => (
            <TopicChip
              key={id}
              label={nameById.get(id) ?? "Unknown"}
              onRemove={() => toggle(id)}
            />
          ))
        )}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && options.length > 0 && (
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
                placeholder="Search patterns…"
                className="w-full rounded-lg bg-background px-3 py-2 text-sm outline-none"
              />
            </div>
            <div ref={listRef} className="max-h-56 overflow-y-auto p-1">
              {filtered.map((opt, idx) => {
                const selected = value.includes(opt._id);
                const active = idx === activeIndex;
                return (
                  <button
                    key={opt._id}
                    type="button"
                    data-index={idx}
                    onClick={() => toggle(opt._id)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-accent" : "hover:bg-accent",
                      selected && "text-primary"
                    )}
                  >
                    {opt.name}
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
              {filtered.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No patterns found.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
