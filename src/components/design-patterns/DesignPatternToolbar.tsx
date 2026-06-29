"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DESIGN_PATTERN_TYPES,
  DESIGN_PATTERN_SORT_OPTIONS,
  TYPE_BADGE,
  type DesignPatternType,
  type DesignPatternSortKey
} from "@/types/designPattern";

export interface DPFilterState {
  search: string;
  types: DesignPatternType[];
  sort: DesignPatternSortKey;
}

interface Props {
  filters: DPFilterState;
  onChange: (next: DPFilterState) => void;
}

export function DesignPatternToolbar({ filters, onChange }: Props) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (t: DesignPatternType) =>
    onChange({
      ...filters,
      types: filters.types.includes(t)
        ? filters.types.filter((x) => x !== t)
        : [...filters.types, t]
    });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by name, type, description, trigger words or use cases…"
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
            onChange({
              ...filters,
              sort: e.target.value as DesignPatternSortKey
            })
          }
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
          aria-label="Sort"
        >
          {DESIGN_PATTERN_SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters((s) => !s)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
            showFilters || filters.types.length > 0
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-background hover:bg-accent"
          )}
        >
          <Filter className="h-4 w-4" />
          Type
          {filters.types.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {filters.types.length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="glass-card animate-fade-in flex flex-wrap gap-2 p-4">
          {DESIGN_PATTERN_TYPES.map((t) => {
            const active = filters.types.includes(t);
            const s = TYPE_BADGE[t];
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className="rounded-[7px] px-3 py-1 text-xs font-medium transition-all"
                style={
                  active
                    ? {
                        color: "#fff",
                        background: s.color,
                        border: `1px solid ${s.color}`
                      }
                    : {
                        color: s.color,
                        background: s.bg,
                        border: `1px solid ${s.border}`
                      }
                }
              >
                {t}
              </button>
            );
          })}
          {filters.types.length > 0 && (
            <button
              onClick={() => onChange({ ...filters, types: [] })}
              className="self-center text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
