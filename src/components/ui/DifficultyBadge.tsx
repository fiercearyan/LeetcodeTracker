import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types/question";

const styles: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30",
  Hard: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/30"
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        styles[difficulty]
      )}
    >
      {difficulty}
    </span>
  );
}
