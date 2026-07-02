"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Maximize2,
  Minimize2,
  Star,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { cn } from "@/lib/utils";
import type { RevisionCard } from "@/types/revision";

interface Props {
  open: boolean;
  card: RevisionCard | null;
  hasPrev: boolean;
  hasNext: boolean;
  favorite: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

interface Section {
  title: string;
  body: string;
}

function splitSections(md: string): { preamble: string; sections: Section[] } {
  const lines = md.split("\n");
  const preamble: string[] = [];
  const sections: Section[] = [];
  let cur: { title: string; body: string[] } | null = null;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (cur) sections.push({ title: cur.title, body: cur.body.join("\n") });
      cur = { title: line.slice(3).trim(), body: [] };
    } else if (cur) {
      cur.body.push(line);
    } else {
      preamble.push(line);
    }
  }
  if (cur) sections.push({ title: cur.title, body: cur.body.join("\n") });
  return { preamble: preamble.join("\n").trim(), sections };
}

export function RevisionDrawer({
  open,
  card,
  hasPrev,
  hasNext,
  favorite,
  onPrev,
  onNext,
  onClose,
  onToggleFavorite
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollMemory = useRef<Record<string, number>>({});
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const { preamble, sections } = useMemo(
    () => splitSections(card?.answer ?? ""),
    [card]
  );

  // Reset sections (all expanded) + restore scroll on card change.
  useEffect(() => {
    if (!card) return;
    setOpenSections(new Set(sections.map((_, i) => i)));
    requestAnimationFrame(() => {
      if (scrollRef.current)
        scrollRef.current.scrollTop = scrollMemory.current[card._id] ?? 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?._id]);

  const copyAnswer = async () => {
    if (!card) return;
    try {
      await navigator.clipboard.writeText(card.answer);
      setCopied(true);
      toast.success("Answer copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };

  // Keyboard shortcuts.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onPrev();
      else if (e.key === "ArrowRight" && hasNext) onNext();
      else if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "c" &&
        !window.getSelection()?.toString()
      ) {
        e.preventDefault();
        copyAnswer();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hasPrev, hasNext, card]);

  const saveScroll = () => {
    if (card && scrollRef.current)
      scrollMemory.current[card._id] = scrollRef.current.scrollTop;
  };

  const toggleSection = (i: number) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && card && (
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
                <div
                  className="font-mono text-[10.5px] uppercase tracking-[1.6px]"
                  style={{ color: "var(--t6)" }}
                >
                  {card.heading}
                </div>
                <h2 className="mt-2 text-[22px] font-semibold leading-snug">
                  {card.question}
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => onToggleFavorite(card._id)}
                  aria-label="Favorite"
                  className={cn(
                    "rounded-lg p-1.5 transition-colors",
                    favorite
                      ? "text-amber-400"
                      : "text-muted-foreground hover:text-amber-400"
                  )}
                >
                  <Star className={cn("h-5 w-5", favorite && "fill-amber-400")} />
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  style={{ border: "1px solid rgba(var(--ink),0.08)" }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-2.5 sm:px-8">
              <button
                onClick={copyAnswer}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy Answer
              </button>
              {sections.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      setOpenSections(new Set(sections.map((_, i) => i)))
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                  >
                    <Maximize2 className="h-3.5 w-3.5" /> Expand All
                  </button>
                  <button
                    onClick={() => setOpenSections(new Set())}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                  >
                    <Minimize2 className="h-3.5 w-3.5" /> Collapse All
                  </button>
                </>
              )}
            </div>

            {/* Body */}
            <div
              ref={scrollRef}
              onScroll={saveScroll}
              className="flex-1 overflow-y-auto px-6 py-6 sm:px-8"
            >
              {preamble && <MarkdownPreview content={preamble} />}

              <div className="space-y-3">
                {sections.map((s, i) => {
                  const isOpen = openSections.has(i);
                  return (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border"
                      style={{
                        borderColor: "rgba(var(--ink),0.08)",
                        background: "rgba(var(--ink),0.012)"
                      }}
                    >
                      <button
                        onClick={() => toggleSection(i)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[15px] font-semibold transition-colors hover:bg-accent/40"
                      >
                        {s.title}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-border px-4 py-3">
                          <MarkdownPreview content={s.body} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 sm:px-8">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
