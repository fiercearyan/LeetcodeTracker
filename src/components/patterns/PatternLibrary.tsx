"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, Plus, SearchX } from "lucide-react";
import { patternService } from "@/services/patternService";
import { usePatterns } from "@/hooks/usePatterns";
import { PatternCard } from "@/components/patterns/PatternCard";
import { PatternFormModal } from "@/components/patterns/PatternFormModal";
import { PatternViewDrawer } from "@/components/patterns/PatternViewDrawer";
import {
  PatternToolbar,
  type PatternFilterState
} from "@/components/patterns/PatternToolbar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Pattern, PatternInput } from "@/types/pattern";

export function PatternLibrary() {
  const router = useRouter();
  const { patterns, loading, create, update, remove, registerView } =
    usePatterns();

  const [filters, setFilters] = useState<PatternFilterState>({
    search: "",
    tags: [],
    sort: "updatedAt"
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Pattern | null>(null);
  const [viewing, setViewing] = useState<Pattern | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleting, setDeleting] = useState<Pattern | null>(null);

  const availableTags = useMemo(
    () => Array.from(new Set(patterns.flatMap((p) => p.tags))).sort(),
    [patterns]
  );

  const visible = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const filtered = patterns.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.notes.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)) ||
        p.triggerKeywords.some((k) => k.toLowerCase().includes(term));
      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.every((t) => p.tags.includes(t));
      return matchesSearch && matchesTags;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (filters.sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "createdAt":
          return b.createdAt.localeCompare(a.createdAt);
        case "views":
          return b.views - a.views;
        case "updatedAt":
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });
    return sorted;
  }, [patterns, filters]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Pattern) => {
    setEditing(p);
    setFormOpen(true);
  };
  const openView = async (p: Pattern) => {
    registerView(p._id);
    setViewing(p);
    setViewLoading(true);
    try {
      // Fetch the full detail (related questions + live usage count).
      const detail = await patternService.get(p._id);
      setViewing((cur) => (cur && cur._id === detail._id ? detail : cur));
    } catch {
      /* keep the basic view */
    } finally {
      setViewLoading(false);
    }
  };

  const handleKeywordSearch = (keyword: string) => {
    setViewing(null);
    setFilters((f) => ({ ...f, search: keyword }));
  };

  const openQuestion = (questionId: string) => {
    router.push(`/dashboard/questions?view=${questionId}`);
  };

  const handleSubmit = async (payload: PatternInput) => {
    if (editing) await update(editing._id, payload);
    else await create(payload);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="font-display text-[42px] leading-none tracking-[0.3px]">
            Pattern Library
          </h1>
          <p className="mt-3 text-[13.5px]" style={{ color: "var(--t5)" }}>
            Reusable DSA tricks &amp; interview heuristics — the mental hooks
            behind every solve.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 self-start rounded-[11px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:brightness-110 sm:self-auto"
          style={{ boxShadow: "0 6px 20px -8px var(--accent)" }}
        >
          <Plus className="h-4 w-4" /> Add Pattern
        </button>
      </motion.div>

      <PatternToolbar
        filters={filters}
        onChange={setFilters}
        availableTags={availableTags}
      />

      {loading ? (
        <CardGridSkeleton />
      ) : visible.length === 0 ? (
        <EmptyState hasPatterns={patterns.length > 0} onAdd={openAdd} />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {visible.map((p) => (
              <PatternCard
                key={p._id}
                pattern={p}
                onOpen={openView}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <PatternFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <PatternViewDrawer
        open={Boolean(viewing)}
        pattern={viewing}
        relatedLoading={viewLoading}
        onClose={() => setViewing(null)}
        onEdit={(p) => {
          setViewing(null);
          openEdit(p);
        }}
        onKeywordSearch={handleKeywordSearch}
        onOpenQuestion={openQuestion}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete pattern?"
        message={
          deleting
            ? `"${deleting.name}" will be permanently removed.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={async () => {
          if (deleting) await remove(deleting._id);
        }}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass-card space-y-3 p-5">
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="flex gap-1.5">
            <div className="skeleton h-5 w-14 rounded-md" />
            <div className="skeleton h-5 w-14 rounded-md" />
          </div>
          <div className="skeleton h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasPatterns,
  onAdd
}: {
  hasPatterns: boolean;
  onAdd: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {hasPatterns ? (
          <SearchX className="h-7 w-7" />
        ) : (
          <BrainCircuit className="h-7 w-7" />
        )}
      </div>
      <h3 className="text-lg font-semibold">
        {hasPatterns ? "No matching patterns" : "Build your second brain"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasPatterns
          ? "Try adjusting your search or tag filters."
          : "Capture reusable DSA tricks and interview heuristics you can apply across many problems."}
      </p>
      {!hasPatterns && (
        <button
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add your first pattern
        </button>
      )}
    </motion.div>
  );
}
