"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Complexity } from "@/types/pattern";

interface ComplexityEditorProps {
  value: Complexity[];
  onChange: (rows: Complexity[]) => void;
}

export function ComplexityEditor({ value, onChange }: ComplexityEditorProps) {
  const update = (i: number, key: keyof Complexity, val: string) => {
    const next = value.map((row, idx) =>
      idx === i ? { ...row, [key]: val } : row
    );
    onChange(next);
  };

  const addRow = () => onChange([...value, { operation: "", complexity: "" }]);
  const removeRow = (i: number) =>
    onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={row.operation}
            onChange={(e) => update(i, "operation", e.target.value)}
            placeholder="Operation (e.g. Insert)"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
          <input
            value={row.complexity}
            onChange={(e) => update(i, "complexity", e.target.value)}
            placeholder="O(log n)"
            className="w-32 rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus:border-ring"
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            aria-label="Remove row"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ring/50 hover:text-foreground"
      >
        <Plus className="h-4 w-4" /> Add complexity
      </button>
    </div>
  );
}
