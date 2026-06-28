"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interactive (local-only) checklist of self-questions to ask before choosing
 * a pattern. Ticks are a thinking aid and intentionally not persisted.
 */
export function MentalChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  if (items.length === 0) return null;

  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const on = checked.has(i);
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background"
                )}
              >
                {on && <Check className="h-3.5 w-3.5" />}
              </span>
              <span
                className={cn(
                  "text-sm transition-colors",
                  on
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {item}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
