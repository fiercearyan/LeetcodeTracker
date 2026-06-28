"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { TopicMultiSelect } from "@/components/ui/TopicMultiSelect";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
import { DIFFICULTIES, type Difficulty, type Question, type QuestionInput } from "@/types/question";

interface QuestionFormModalProps {
  open: boolean;
  onClose: () => void;
  /** When provided, the modal is in edit mode. */
  initial?: Question | null;
  onSubmit: (payload: QuestionInput) => Promise<unknown>;
}

const EMPTY: QuestionInput = {
  questionNumber: 0,
  questionName: "",
  difficulty: "Easy",
  topics: [],
  leetcodeUrl: "",
  approach: ""
};

const APPROACH_TEMPLATE = `## Problem Intuition


## Algorithm
1.

\`\`\`python
# your code here
\`\`\`

## Complexity
| Metric | Value |
| --- | --- |
| Time | O() |
| Space | O() |

## Mistakes
-

## Optimizations


## Notes
>
`;

export function QuestionFormModal({
  open,
  onClose,
  initial,
  onSubmit
}: QuestionFormModalProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<QuestionInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      if (initial) {
        setForm({
          questionNumber: initial.questionNumber,
          questionName: initial.questionName,
          difficulty: initial.difficulty,
          topics: initial.topics,
          leetcodeUrl: initial.leetcodeUrl,
          approach: initial.approach
        });
      } else {
        setForm({ ...EMPTY, approach: APPROACH_TEMPLATE });
      }
    }
  }, [open, initial]);

  const set = <K extends keyof QuestionInput>(key: K, val: QuestionInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.questionNumber || form.questionNumber < 1)
      next.questionNumber = "Enter a valid question number";
    if (!form.questionName.trim())
      next.questionName = "Question name is required";
    // URL is optional — only validate the format when something is entered.
    if (form.leetcodeUrl.trim()) {
      try {
        const u = new URL(form.leetcodeUrl);
        if (!/^https?:$/.test(u.protocol)) throw new Error();
      } catch {
        next.leetcodeUrl = "Enter a valid URL (https://…) or leave it empty";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        questionName: form.questionName.trim(),
        leetcodeUrl: form.leetcodeUrl.trim()
      });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Question" : "Add Approach"}
      description={
        isEdit
          ? "Update the details and notes for this problem."
          : "Log a new problem with your approach and notes."
      }
      size="max-w-3xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Question Number" error={errors.questionNumber}>
            <input
              type="number"
              min={1}
              value={form.questionNumber || ""}
              onChange={(e) =>
                set("questionNumber", Number(e.target.value))
              }
              placeholder="1"
              className="input"
            />
          </Field>
          <Field
            label="Question Name"
            error={errors.questionName}
            className="sm:col-span-2"
          >
            <input
              type="text"
              value={form.questionName}
              onChange={(e) => set("questionName", e.target.value)}
              placeholder="Two Sum"
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Difficulty">
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set("difficulty", d as Difficulty)}
                  className={difficultyBtn(form.difficulty === d, d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Problem URL (optional)" error={errors.leetcodeUrl}>
            <input
              type="url"
              value={form.leetcodeUrl}
              onChange={(e) => set("leetcodeUrl", e.target.value)}
              placeholder="https://… (leave blank if none)"
              className="input"
            />
          </Field>
        </div>

        <Field label="Topics">
          <TopicMultiSelect
            value={form.topics}
            onChange={(t) => set("topics", t)}
          />
        </Field>

        <Field label="Approach">
          <MarkdownEditor
            value={form.approach}
            onChange={(v) => set("approach", v)}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEdit ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--input));
          background: hsl(var(--background));
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        :global(.input:focus) {
          border-color: hsl(var(--ring));
        }
      `}</style>
    </Modal>
  );
}

function Field({
  label,
  error,
  className,
  children
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function difficultyBtn(active: boolean, d: Difficulty) {
  const base =
    "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ";
  if (!active)
    return (
      base +
      "border-border bg-background text-muted-foreground hover:bg-accent"
    );
  const map: Record<Difficulty, string> = {
    Easy: "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    Medium:
      "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400",
    Hard: "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400"
  };
  return base + map[d];
}
