"use client";

import { ExternalLink } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { TopicChip } from "@/components/ui/TopicChip";
import type { Question } from "@/types/question";

export function ApproachModal({
  open,
  onClose,
  question
}: {
  open: boolean;
  onClose: () => void;
  question: Question | null;
}) {
  if (!question) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`#${question.questionNumber} · ${question.questionName}`}
      size="max-w-3xl"
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={question.difficulty} />
        {question.topics.map((t) => (
          <TopicChip key={t} label={t} />
        ))}
        <a
          href={question.leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
        >
          Open Question <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <MarkdownPreview content={question.approach} />
    </Modal>
  );
}
