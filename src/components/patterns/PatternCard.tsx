"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { TopicChip } from "@/components/ui/TopicChip";
import { timeAgo } from "@/lib/utils";
import type { Pattern } from "@/types/pattern";

interface PatternCardProps {
  pattern: Pattern;
  onOpen: (p: Pattern) => void;
  onEdit: (p: Pattern) => void;
  onDelete: (p: Pattern) => void;
}

export function PatternCard({
  pattern,
  onOpen,
  onEdit,
  onDelete
}: PatternCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(pattern)}
      className="glass-card group flex cursor-pointer flex-col p-5 transition-shadow hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">
          {pattern.name}
        </h3>
      </div>

      <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
        {pattern.description || "No description yet."}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {pattern.tags.slice(0, 4).map((t) => (
          <TopicChip key={t} label={t} />
        ))}
        {pattern.tags.length > 4 && (
          <span className="text-xs text-muted-foreground">
            +{pattern.tags.length - 4}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-xs text-muted-foreground">
          Updated {timeAgo(pattern.updatedAt)}
        </span>
        <div
          className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(pattern)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Edit pattern"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(pattern)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            aria-label="Delete pattern"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
