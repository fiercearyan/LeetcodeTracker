"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Eye, Pencil, X, Zap } from "lucide-react";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { MentalChecklist } from "@/components/patterns/MentalChecklist";
import { TemplateTabs } from "@/components/patterns/TemplateTabs";
import { TypeBadge } from "@/components/design-patterns/TypeBadge";
import { InterviewAccordion } from "@/components/design-patterns/Accordion";
import { UmlImage } from "@/components/design-patterns/UmlImage";
import type { DesignPattern } from "@/types/designPattern";

interface Props {
  open: boolean;
  pattern: DesignPattern | null;
  loading?: boolean;
  onClose: () => void;
  onEdit: (p: DesignPattern) => void;
  onOpenRelated: (id: string) => void;
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
      <h3 className="mb-3 text-[19px] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export function DesignPatternDrawer({
  open,
  pattern,
  loading,
  onClose,
  onEdit,
  onOpenRelated
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
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
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-3xl flex-col sm:rounded-l-2xl"
            style={{
              background: "var(--surface)",
              borderLeft: "1px solid rgba(var(--ink),0.09)",
              boxShadow: "-30px 0 80px -30px rgba(0,0,0,0.6)"
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
              <div className="min-w-0">
                <h2 className="font-display truncate text-[34px] leading-none">
                  {pattern.name}
                </h2>
                <div className="mt-3">
                  <TypeBadge type={pattern.type} />
                </div>
                {pattern.triggerWords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {pattern.triggerWords.map((k) => (
                      <span
                        key={k}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium"
                        style={{
                          color: "#D7A75A",
                          background: "rgba(215,167,90,0.1)",
                          border: "1px solid rgba(215,167,90,0.3)"
                        }}
                      >
                        <Zap className="h-3 w-3" />
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close"
                style={{ border: "1px solid rgba(var(--ink),0.08)" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6 sm:px-8">
              {pattern.definition.trim() && (
                <Section title="Overview">
                  <MarkdownPreview content={pattern.definition} />
                </Section>
              )}

              {pattern.useCases.trim() && (
                <Section title="Real-world Use Cases">
                  <MarkdownPreview content={pattern.useCases} />
                </Section>
              )}

              {pattern.problemStatement.trim() && (
                <Section title="Problem Statement">
                  <MarkdownPreview content={pattern.problemStatement} />
                </Section>
              )}

              {pattern.whenToUse.length > 0 && (
                <Section title="When to Use">
                  <MentalChecklist items={pattern.whenToUse} />
                </Section>
              )}

              {pattern.coreConcepts.length > 0 && (
                <Section title="Core Concepts">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {pattern.coreConcepts.map((c, i) => (
                      <div
                        key={i}
                        className="rounded-xl border p-4"
                        style={{
                          borderColor: "rgba(var(--ink),0.08)",
                          background: "rgba(var(--ink),0.015)"
                        }}
                      >
                        <div
                          className="text-sm font-semibold"
                          style={{ color: "var(--accent)" }}
                        >
                          {c.title}
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {c.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {pattern.solution.trim() && (
                <Section title="How It Solves the Problem">
                  <MarkdownPreview content={pattern.solution} />
                </Section>
              )}

              {pattern.umlImage && (
                <Section title="UML Diagram">
                  <UmlImage src={pattern.umlImage} alt={`${pattern.name} UML`} />
                </Section>
              )}

              {pattern.exampleCode.trim() && (
                <Section title="Example Code">
                  <TemplateTabs template={pattern.exampleCode} />
                </Section>
              )}

              {pattern.advantages.length > 0 && (
                <Section title="Advantages">
                  <ul className="space-y-2">
                    {pattern.advantages.map((a, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {pattern.disadvantages.length > 0 && (
                <Section title="Disadvantages">
                  <ul className="space-y-2">
                    {pattern.disadvantages.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {pattern.interviewQuestions.length > 0 && (
                <Section title="Interview Questions">
                  <InterviewAccordion items={pattern.interviewQuestions} />
                </Section>
              )}

              {(pattern.relatedPatternDetails?.length ?? 0) > 0 && (
                <Section title="Related Design Patterns">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {pattern.relatedPatternDetails!.map((r) => (
                      <button
                        key={r._id}
                        onClick={() => onOpenRelated(r._id)}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-accent"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {r.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {r.type}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {pattern.notes.trim() && (
                <Section title="Notes">
                  <div
                    className="rounded-r-xl py-2 pl-4"
                    style={{
                      borderLeft: "3px solid var(--accent)",
                      background: "var(--accent-soft)"
                    }}
                  >
                    <MarkdownPreview content={pattern.notes} />
                  </div>
                </Section>
              )}

              {loading && (
                <p className="text-sm text-muted-foreground">Loading details…</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 sm:px-8">
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
