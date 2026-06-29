"use client";

import { Plus, Trash2 } from "lucide-react";

interface Props {
  value: string[];
  onChange: (rows: string[]) => void;
  placeholder?: string;
  /** First line is the question; following lines are the (optional) answer. */
  rows?: number;
}

/**
 * Editable list of multi-line text entries — used for interview questions,
 * where each entry is "question\noptional answer".
 */
export function MultiTextEditor({
  value,
  onChange,
  placeholder = "Question\nOptional answer in Markdown…",
  rows = 3
}: Props) {
  const update = (i: number, val: string) =>
    onChange(value.map((v, idx) => (idx === i ? val : v)));
  const add = () => onChange([...value, ""]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2.5">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <textarea
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="flex-1 resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:border-ring"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ring/50 hover:text-foreground"
      >
        <Plus className="h-4 w-4" /> Add question
      </button>
    </div>
  );
}
