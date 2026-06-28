"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { TopicChip } from "@/components/ui/TopicChip";
import type { Question } from "@/types/question";

export function ApproachModal({
  open,
  onClose,
  question,
  onEdit,
  onDelete
}: {
  open: boolean;
  onClose: () => void;
  question: Question | null;
  onEdit?: (q: Question) => void;
  onDelete?: (q: Question) => void;
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
        {question.leetcodeUrl && (
          <a
            href={question.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            Open Question <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <MarkdownPreview content={question.approach} />

      {/* Edit / Delete live here on mobile, where the table's Actions column is
          hidden to prevent horizontal overflow. */}
      {(onEdit || onDelete) && (
        <div className="mt-6 flex gap-3 border-t border-border pt-4 sm:hidden">
          {onEdit && (
            <button
              onClick={() => onEdit(question)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(question)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/20"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
