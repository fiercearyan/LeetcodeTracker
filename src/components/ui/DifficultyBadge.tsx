import type { Difficulty } from "@/types/question";

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: "#7DC4A0",
  Medium: "#D7A75A",
  Hard: "#D98A82"
};

/**
 * Difficulty shown as a glowing colored dot + colored label (Recall style).
 */
export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const c = DIFFICULTY_COLOR[difficulty];
  return (
    <span
      className="inline-flex items-center gap-2 text-[13.5px] font-medium"
      style={{ color: c }}
    >
      <span
        className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
        style={{ background: c, boxShadow: `0 0 9px ${c}` }}
      />
      {difficulty}
    </span>
  );
}
