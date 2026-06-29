"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, SearchX, Shapes } from "lucide-react";
import { useDesignPatterns } from "@/hooks/useDesignPatterns";
import { designPatternService } from "@/services/designPatternService";
import { DesignPatternCard } from "@/components/design-patterns/DesignPatternCard";
import { DesignPatternDrawer } from "@/components/design-patterns/DesignPatternDrawer";
import { DesignPatternFormModal } from "@/components/design-patterns/DesignPatternFormModal";
import {
  DesignPatternToolbar,
  type DPFilterState
} from "@/components/design-patterns/DesignPatternToolbar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { PatternOption } from "@/components/questions/PatternPicker";
import type {
  DesignPattern,
  DesignPatternInput
} from "@/types/designPattern";

export function DesignPatternsLibrary() {
  const { patterns, loading, create, update, remove } = useDesignPatterns();

  const [filters, setFilters] = useState<DPFilterState>({
    search: "",
    types: [],
    sort: "updatedAt"
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DesignPattern | null>(null);
  const [viewing, setViewing] = useState<DesignPattern | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleting, setDeleting] = useState<DesignPattern | null>(null);

  const relatedOptions: PatternOption[] = useMemo(
    () =>
      patterns
        .filter((p) => p._id !== editing?._id)
        .map((p) => ({ _id: p._id, name: p.name })),
    [patterns, editing]
  );

  const visible = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const filtered = patterns.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.type.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.triggerWords.some((t) => t.toLowerCase().includes(term)) ||
        p.useCases.toLowerCase().includes(term);
      const matchesType =
        filters.types.length === 0 || filters.types.includes(p.type);
      return matchesSearch && matchesType;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (filters.sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "createdAt":
          return b.createdAt.localeCompare(a.createdAt);
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
  const openEdit = (p: DesignPattern) => {
    setEditing(p);
    setFormOpen(true);
  };

  const openView = async (p: DesignPattern) => {
    setViewing(p);
    setViewLoading(true);
    try {
      const detail = await designPatternService.get(p._id);
      setViewing((cur) => (cur && cur._id === detail._id ? detail : cur));
    } catch {
      /* keep basic view */
    } finally {
      setViewLoading(false);
    }
  };

  const openRelated = async (id: string) => {
    const base = patterns.find((p) => p._id === id);
    if (base) {
      await openView(base);
    } else {
      try {
        setViewLoading(true);
        setViewing(await designPatternService.get(id));
      } finally {
        setViewLoading(false);
      }
    }
  };

  const handleSubmit = async (payload: DesignPatternInput) => {
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
            Design Patterns
          </h1>
          <p className="mt-3 text-[13.5px]" style={{ color: "var(--t5)" }}>
            Learn, revise and quickly recall software design patterns with
            real-world examples.
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

      <DesignPatternToolbar filters={filters} onChange={setFilters} />

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
              <DesignPatternCard
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

      <DesignPatternFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
        relatedOptions={relatedOptions}
      />

      <DesignPatternDrawer
        open={Boolean(viewing)}
        pattern={viewing}
        loading={viewLoading}
        onClose={() => setViewing(null)}
        onEdit={(p) => {
          setViewing(null);
          openEdit(p);
        }}
        onOpenRelated={openRelated}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete design pattern?"
        message={deleting ? `"${deleting.name}" will be permanently removed.` : ""}
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
        <div key={i} className="glass-card space-y-3 p-6">
          <div className="skeleton h-6 w-2/3" />
          <div className="skeleton h-5 w-28 rounded-md" />
          <div className="skeleton h-4 w-full" />
          <div className="flex gap-1.5">
            <div className="skeleton h-5 w-14 rounded-md" />
            <div className="skeleton h-5 w-14 rounded-md" />
          </div>
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
          <Shapes className="h-7 w-7" />
        )}
      </div>
      <h3 className="text-lg font-semibold">
        {hasPatterns ? "No matching patterns" : "Your design pattern handbook"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasPatterns
          ? "Try adjusting your search or type filters."
          : "Add design patterns you can revise in under five minutes before an interview."}
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
