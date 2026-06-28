import { Gauge } from "lucide-react";
import type { Complexity } from "@/types/pattern";

/**
 * Compact, documentation-style complexity reference card.
 */
export function ComplexityBox({ complexities }: { complexities: Complexity[] }) {
  const rows = complexities.filter((c) => c.operation || c.complexity);
  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Gauge className="h-4 w-4 text-primary" />
        Complexities
      </div>
      <dl className="space-y-2">
        {rows.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0"
          >
            <dt className="text-sm text-muted-foreground">{c.operation}</dt>
            <dd className="font-mono text-sm font-medium">{c.complexity}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
