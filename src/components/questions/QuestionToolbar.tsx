"use client";

import { Filter, Search, X } from "lucide-react";
import { DIFFICULTIES, TOPICS, type Difficulty } from "@/types/question";
import { TopicChip } from "@/components/ui/TopicChip";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface FilterState {
  search: string;
  difficulties: Difficulty[];
  topics: string[];
}

interface QuestionToolbarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  availableTopics: string[];
}

export function QuestionToolbar({
  filters,
  onChange,
  availableTopics
}: QuestionToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const topicOptions = Array.from(new Set([...TOPICS, ...availableTopics]));
  const activeCount = filters.difficulties.length + filters.topics.length;

  const toggleDifficulty = (d: Difficulty) => {
    onChange({
      ...filters,
      difficulties: filters.difficulties.includes(d)
        ? filters.difficulties.filter((x) => x !== d)
        : [...filters.difficulties, d]
    });
  };

  const toggleTopic = (t: string) => {
    onChange({
      ...filters,
      topics: filters.topics.includes(t)
        ? filters.topics.filter((x) => x !== t)
        : [...filters.topics, t]
    });
  };

  const clearAll = () =>
    onChange({ search: "", difficulties: [], topics: [] });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={(e) =>
              onChange({ ...filters, search: e.target.value })
            }
            placeholder="Search by number, name, topic or difficulty…"
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

        <button
          onClick={() => setShowFilters((s) => !s)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
            showFilters || activeCount > 0
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-background hover:bg-accent"
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="glass-card animate-fade-in space-y-4 p-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Difficulty
            </p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDifficulty(d)}
                  className={cn(
                    "rounded-lg ring-1 ring-inset transition-all",
                    filters.difficulties.includes(d)
                      ? "ring-primary"
                      : "opacity-60 ring-transparent hover:opacity-100"
                  )}
                >
                  <span className="block px-1 py-0.5">
                    <DifficultyBadge difficulty={d} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {topicOptions.map((t) => {
                const active = filters.topics.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
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
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {activeCount > 0 && !showFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.difficulties.map((d) => (
            <TopicChip
              key={d}
              label={d}
              onRemove={() => toggleDifficulty(d)}
            />
          ))}
          {filters.topics.map((t) => (
            <TopicChip key={t} label={t} onRemove={() => toggleTopic(t)} />
          ))}
        </div>
      )}
    </div>
  );
}
