"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ListChecks, Plus, SearchX } from "lucide-react";
import { useQuestions } from "@/hooks/useQuestions";
import { QuestionToolbar, type FilterState } from "@/components/questions/QuestionToolbar";
import { QuestionTable } from "@/components/questions/QuestionTable";
import { Pagination } from "@/components/questions/Pagination";
import { QuestionFormModal } from "@/components/questions/QuestionFormModal";
import { ApproachModal } from "@/components/questions/ApproachModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import type { Question, QuestionInput, SortKey, SortOrder } from "@/types/question";

const DIFFICULTY_RANK: Record<string, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2
};

export function QuestionTracker() {
  const { questions, loading, create, update, remove } = useQuestions();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    difficulties: [],
    topics: []
  });
  const [sortKey, setSortKey] = useState<SortKey>("questionNumber");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [viewing, setViewing] = useState<Question | null>(null);
  const [deleting, setDeleting] = useState<Question | null>(null);

  const availableTopics = useMemo(
    () => Array.from(new Set(questions.flatMap((q) => q.topics))),
    [questions]
  );

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return questions.filter((q) => {
      const matchesSearch =
        !term ||
        String(q.questionNumber).includes(term) ||
        q.questionName.toLowerCase().includes(term) ||
        q.difficulty.toLowerCase().includes(term) ||
        q.topics.some((t) => t.toLowerCase().includes(term));

      const matchesDifficulty =
        filters.difficulties.length === 0 ||
        filters.difficulties.includes(q.difficulty);

      const matchesTopics =
        filters.topics.length === 0 ||
        filters.topics.every((t) => q.topics.includes(t));

      return matchesSearch && matchesDifficulty && matchesTopics;
    });
  }, [questions, filters]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "questionNumber":
          cmp = a.questionNumber - b.questionNumber;
          break;
        case "questionName":
          cmp = a.questionName.localeCompare(b.questionName);
          break;
        case "difficulty":
          cmp =
            DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
          break;
        case "createdAt":
          cmp = a.createdAt.localeCompare(b.createdAt);
          break;
        case "updatedAt":
          cmp = a.updatedAt.localeCompare(b.updatedAt);
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
    [sorted, safePage, pageSize]
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleSubmit = async (payload: QuestionInput) => {
    if (editing) {
      await update(editing._id, payload);
    } else {
      await create(payload);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    setFormOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Question Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {questions.length} problem{questions.length === 1 ? "" : "s"} logged
            {filtered.length !== questions.length &&
              ` · ${filtered.length} matching`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Approach
        </button>
      </motion.div>

      <QuestionToolbar
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        availableTopics={availableTopics}
      />

      {loading ? (
        <TableSkeleton />
      ) : sorted.length === 0 ? (
        <EmptyState
          hasQuestions={questions.length > 0}
          onAdd={openAdd}
        />
      ) : (
        <>
          <QuestionTable
            questions={paginated}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            onView={setViewing}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
          <Pagination
            page={safePage}
            pageSize={pageSize}
            total={sorted.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </>
      )}

      <QuestionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <ApproachModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        question={viewing}
        onEdit={(q) => {
          setViewing(null);
          openEdit(q);
        }}
        onDelete={(q) => {
          setViewing(null);
          setDeleting(q);
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete question?"
        message={
          deleting
            ? `"#${deleting.questionNumber} · ${deleting.questionName}" will be permanently removed.`
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

function EmptyState({
  hasQuestions,
  onAdd
}: {
  hasQuestions: boolean;
  onAdd: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {hasQuestions ? (
          <SearchX className="h-7 w-7" />
        ) : (
          <ListChecks className="h-7 w-7" />
        )}
      </div>
      <h3 className="text-lg font-semibold">
        {hasQuestions ? "No matching questions" : "No questions yet"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasQuestions
          ? "Try adjusting your search or filters."
          : "Start building your tracker by logging your first solved problem and approach."}
      </p>
      {!hasQuestions && (
        <button
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add your first question
        </button>
      )}
    </motion.div>
  );
}
