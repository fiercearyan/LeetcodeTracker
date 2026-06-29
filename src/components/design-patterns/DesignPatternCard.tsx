"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { TopicChip } from "@/components/ui/TopicChip";
import { TypeBadge } from "@/components/design-patterns/TypeBadge";
import { timeAgo } from "@/lib/utils";
import type { DesignPattern } from "@/types/designPattern";

interface Props {
  pattern: DesignPattern;
  onOpen: (p: DesignPattern) => void;
  onEdit: (p: DesignPattern) => void;
  onDelete: (p: DesignPattern) => void;
}

export function DesignPatternCard({ pattern, onOpen, onEdit, onDelete }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(pattern)}
      className="glass-card group flex min-h-[244px] cursor-pointer flex-col p-6 transition-shadow hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <h3 className="font-display text-[26px] leading-[1.05]">{pattern.name}</h3>

      <div className="mt-2.5">
        <TypeBadge type={pattern.type} />
      </div>

      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
        {pattern.description || "No description yet."}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {pattern.triggerWords.slice(0, 4).map((t) => (
          <TopicChip key={t} label={t} />
        ))}
        {pattern.triggerWords.length > 4 && (
          <span className="self-center text-xs text-muted-foreground">
            +{pattern.triggerWords.length - 4}
          </span>
        )}
      </div>

      <div
        className="mt-auto flex items-center justify-between pt-4"
        style={{ borderTop: "1px solid rgba(var(--ink),0.06)" }}
      >
        <span className="text-xs" style={{ color: "var(--t7)" }}>
          Updated {timeAgo(pattern.updatedAt)}
        </span>
        <div
          className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(pattern)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(pattern)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
