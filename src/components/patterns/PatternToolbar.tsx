"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PATTERN_SORT_OPTIONS,
  type PatternSortKey
} from "@/types/pattern";

export interface PatternFilterState {
  search: string;
  tags: string[];
  sort: PatternSortKey;
}

interface PatternToolbarProps {
  filters: PatternFilterState;
  onChange: (next: PatternFilterState) => void;
  availableTags: string[];
}

export function PatternToolbar({
  filters,
  onChange,
  availableTags
}: PatternToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleTag = (t: string) => {
    onChange({
      ...filters,
      tags: filters.tags.includes(t)
        ? filters.tags.filter((x) => x !== t)
        : [...filters.tags, t]
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by name, tag, description or notes…"
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-ring"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={filters.sort}
          onChange={(e) =>
            onChange({ ...filters, sort: e.target.value as PatternSortKey })
          }
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
          aria-label="Sort patterns"
        >
          {PATTERN_SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>

        {availableTags.length > 0 && (
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
              showFilters || filters.tags.length > 0
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            <Filter className="h-4 w-4" />
            Tags
            {filters.tags.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                {filters.tags.length}
              </span>
            )}
          </button>
        )}
      </div>

      {showFilters && availableTags.length > 0 && (
        <div className="glass-card animate-fade-in space-y-3 p-4">
          <div className="flex flex-wrap gap-2">
            {availableTags.map((t) => {
              const active = filters.tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground hover:bg-accent/70"
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {filters.tags.length > 0 && (
            <button
              onClick={() => onChange({ ...filters, tags: [] })}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear tag filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
