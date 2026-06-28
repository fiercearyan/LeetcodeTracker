"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Link2, Pencil, X, Zap } from "lucide-react";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { TopicChip } from "@/components/ui/TopicChip";
import { TemplateTabs } from "@/components/patterns/TemplateTabs";
import { MentalChecklist } from "@/components/patterns/MentalChecklist";
import { ComplexityBox } from "@/components/patterns/ComplexityBox";
import { RelatedQuestions } from "@/components/patterns/RelatedQuestions";
import type { Pattern } from "@/types/pattern";

interface PatternViewDrawerProps {
  open: boolean;
  pattern: Pattern | null;
  relatedLoading?: boolean;
  onClose: () => void;
  onEdit: (p: Pattern) => void;
  onKeywordSearch: (keyword: string) => void;
  onOpenQuestion: (questionId: string) => void;
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PatternViewDrawer({
  open,
  pattern,
  relatedLoading,
  onClose,
  onEdit,
  onKeywordSearch,
  onOpenQuestion
}: PatternViewDrawerProps) {
  const relatedRef = useRef<HTMLDivElement>(null);

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

  const usage = pattern?.usageCount ?? 0;

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
            className="glass-card fixed right-0 top-0 z-50 flex h-full w-full max-w-3xl flex-col rounded-none border-y-0 border-r-0 sm:rounded-l-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold">{pattern.name}</h2>
                {pattern.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pattern.description}
                  </p>
                )}
                {pattern.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {pattern.tags.map((t) => (
                      <TopicChip key={t} label={t} />
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {/* Trigger keywords + usage count */}
              {pattern.triggerKeywords.length > 0 && (
                <Section title="Trigger Keywords">
                  <div className="flex flex-wrap gap-1.5">
                    {pattern.triggerKeywords.map((k) => (
                      <button
                        key={k}
                        onClick={() => onKeywordSearch(k)}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 ring-1 ring-inset ring-amber-500/30 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
                        title={`Find patterns with "${k}"`}
                      >
                        <Zap className="h-3 w-3" />
                        {k}
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              <button
                onClick={() =>
                  relatedRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Link2 className="h-4 w-4" />
                Used in {usage} question{usage === 1 ? "" : "s"}
              </button>

              {/* Two-column: main content + complexity sidebar */}
              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="min-w-0 flex-1 space-y-6">
                  {pattern.notes.trim() && (
                    <Section title="Notes">
                      <MarkdownPreview content={pattern.notes} />
                    </Section>
                  )}

                  {pattern.template.trim() && (
                    <Section title="Template">
                      <TemplateTabs template={pattern.template} />
                    </Section>
                  )}

                  {pattern.mentalChecklist.length > 0 && (
                    <Section title="Mental Checklist">
                      <MentalChecklist items={pattern.mentalChecklist} />
                    </Section>
                  )}

                  <div ref={relatedRef} className="scroll-mt-4">
                    <Section title="Related Questions">
                      <RelatedQuestions
                        questions={pattern.relatedQuestions ?? []}
                        loading={relatedLoading}
                        onOpen={onOpenQuestion}
                      />
                    </Section>
                  </div>
                </div>

                {pattern.complexities.some(
                  (c) => c.operation || c.complexity
                ) && (
                  <aside className="w-full shrink-0 lg:w-60">
                    <div className="lg:sticky lg:top-0">
                      <ComplexityBox complexities={pattern.complexities} />
                    </div>
                  </aside>
                )}
              </div>
            </div>

            {/* Footer */}
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
