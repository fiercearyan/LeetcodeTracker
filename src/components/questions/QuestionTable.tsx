"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Pencil,
  Trash2
} from "lucide-react";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { TopicChip } from "@/components/ui/TopicChip";
import { cn, formatDate } from "@/lib/utils";
import type { Question, SortKey, SortOrder } from "@/types/question";

interface QuestionTableProps {
  questions: Question[];
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSort: (key: SortKey) => void;
  onView: (q: Question) => void;
  onEdit: (q: Question) => void;
  onDelete: (q: Question) => void;
}

interface Column {
  key: SortKey | null;
  label: string;
  className?: string;
}

const COLUMNS: Column[] = [
  { key: "questionNumber", label: "#", className: "w-16" },
  { key: "questionName", label: "Question" },
  { key: "difficulty", label: "Difficulty", className: "w-32" },
  { key: null, label: "Topics", className: "hidden md:table-cell" },
  { key: null, label: "Approach", className: "w-24" },
  { key: null, label: "Link", className: "hidden sm:table-cell w-28" },
  { key: null, label: "Actions", className: "w-28 text-right" }
];

export function QuestionTable({
  questions,
  sortKey,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete
}: QuestionTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  className={cn("px-4 py-3 font-semibold", col.className)}
                >
                  {col.key ? (
                    <button
                      onClick={() => onSort(col.key as SortKey)}
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      {col.label}
                      <SortIcon
                        active={sortKey === col.key}
                        order={sortOrder}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {questions.map((q) => (
                <motion.tr
                  key={q._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="group transition-colors hover:bg-accent/40"
                >
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {q.questionNumber}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {q.questionName}
                    <span className="mt-1 block text-xs text-muted-foreground md:hidden">
                      {q.topics.join(", ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DifficultyBadge difficulty={q.difficulty} />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex max-w-xs flex-wrap gap-1">
                      {q.topics.slice(0, 3).map((t) => (
                        <TopicChip key={t} label={t} />
                      ))}
                      {q.topics.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{q.topics.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onView(q)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {q.leetcodeUrl ? (
                      <a
                        href={q.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        Open <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(q)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label="Edit"
                        title={`Edit · added ${formatDate(q.createdAt)}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(q)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortIcon({
  active,
  order
}: {
  active: boolean;
  order: SortOrder;
}) {
  if (!active)
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  return order === "asc" ? (
    <ChevronUp className="h-3.5 w-3.5" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5" />
  );
}
