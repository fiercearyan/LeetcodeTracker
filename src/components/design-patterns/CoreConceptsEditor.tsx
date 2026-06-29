"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CoreConcept } from "@/types/designPattern";

interface Props {
  value: CoreConcept[];
  onChange: (rows: CoreConcept[]) => void;
}

export function CoreConceptsEditor({ value, onChange }: Props) {
  const update = (i: number, key: keyof CoreConcept, val: string) =>
    onChange(value.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));

  const add = () => onChange([...value, { title: "", description: "" }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div
          key={i}
          className="rounded-xl border p-3"
          style={{
            borderColor: "rgba(var(--ink),0.09)",
            background: "rgba(var(--ink),0.015)"
          }}
        >
          <div className="flex items-center gap-2">
            <input
              value={row.title}
              onChange={(e) => update(i, "title", e.target.value)}
              placeholder="Concept title (e.g. Intrinsic State)"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus:border-ring"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
              aria-label="Remove concept"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            value={row.description}
            onChange={(e) => update(i, "description", e.target.value)}
            placeholder="Short description…"
            rows={2}
            className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ring/50 hover:text-foreground"
      >
        <Plus className="h-4 w-4" /> Add concept
      </button>
    </div>
  );
}
