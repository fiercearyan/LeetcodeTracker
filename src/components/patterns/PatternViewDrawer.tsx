"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Pencil, X } from "lucide-react";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { TopicChip } from "@/components/ui/TopicChip";
import type { Pattern } from "@/types/pattern";

interface PatternViewDrawerProps {
  open: boolean;
  pattern: Pattern | null;
  onClose: () => void;
  onEdit: (p: Pattern) => void;
}

/**
 * Read-only side drawer that renders a pattern's Markdown notes — the
 * "second brain" reading view.
 */
export function PatternViewDrawer({
  open,
  pattern,
  onClose,
  onEdit
}: PatternViewDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && pattern && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="glass-card fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col rounded-none border-y-0 border-r-0 sm:rounded-l-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold">{pattern.name}</h2>
                {pattern.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pattern.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {pattern.tags.map((t) => (
                    <TopicChip key={t} label={t} />
                  ))}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <MarkdownPreview content={pattern.notes} />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" /> {pattern.views} view
                {pattern.views === 1 ? "" : "s"}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Close
                </button>
                <button
                  onClick={() => onEdit(pattern)}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
