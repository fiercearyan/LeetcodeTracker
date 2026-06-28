"use client";

import { ChevronRight } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import type { RelatedQuestion } from "@/types/pattern";

interface RelatedQuestionsProps {
  questions: RelatedQuestion[];
  loading?: boolean;
  onOpen: (questionId: string) => void;
}

export function RelatedQuestions({
  questions,
  loading,
  onOpen
}: RelatedQuestionsProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No linked questions yet. Associate this pattern with a question in the
        Question Tracker and it will appear here automatically.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {questions.map((q) => (
        <li key={q._id}>
          <button
            onClick={() => onOpen(q._id)}
            className="group flex w-full items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <span className="font-mono text-sm text-muted-foreground">
              {q.questionNumber}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {q.questionName}
            </span>
            <DifficultyBadge difficulty={q.difficulty} />
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
