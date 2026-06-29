"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { cn } from "@/lib/utils";

/**
 * Each item's first line is the question (header); the remaining lines render
 * as a Markdown answer when expanded.
 */
export function InterviewAccordion({ items }: { items: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((raw, i) => {
        const [header, ...rest] = raw.split("\n");
        const answer = rest.join("\n").trim();
        const expanded = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-xl border"
            style={{
              borderColor: "rgba(var(--ink),0.08)",
              background: "rgba(var(--ink),0.012)"
            }}
          >
            <button
              onClick={() => setOpen(expanded ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent/40"
            >
              <span>{header}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  expanded && "rotate-180"
                )}
              />
            </button>
            {expanded && answer && (
              <div className="border-t border-border px-4 py-3">
                <MarkdownPreview content={answer} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
