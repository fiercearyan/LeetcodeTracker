"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { TagSelect } from "@/components/ui/TagSelect";
import { ChipInput } from "@/components/ui/ChipInput";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
import { ComplexityEditor } from "@/components/patterns/ComplexityEditor";
import { PATTERN_TAGS, type Pattern, type PatternInput } from "@/types/pattern";

interface PatternFormModalProps {
  open: boolean;
  onClose: () => void;
  initial?: Pattern | null;
  onSubmit: (payload: PatternInput) => Promise<unknown>;
}

const EMPTY: PatternInput = {
  name: "",
  description: "",
  tags: [],
  triggerKeywords: [],
  notes: "",
  template: "",
  mentalChecklist: [],
  complexities: []
};

const NOTES_TEMPLATE = `## When should I think about this pattern?
If the problem mentions:
-

## Quick Decision Rules
| Situation | Approach |
| --- | --- |
|  |  |

## Interview Reminder
> Pause and ask: can this be solved with this pattern?
`;

const TEMPLATE_PLACEHOLDER = `Add reusable code, one fenced block per language for tabs:

\`\`\`python
# python template
\`\`\`

\`\`\`java
// java template
\`\`\``;

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">
        {label}
        {hint && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function PatternFormModal({
  open,
  onClose,
  initial,
  onSubmit
}: PatternFormModalProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<PatternInput>(EMPTY);
  const [checklistText, setChecklistText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      if (initial) {
        setForm({
          name: initial.name,
          description: initial.description,
          tags: initial.tags,
          triggerKeywords: initial.triggerKeywords,
          notes: initial.notes,
          template: initial.template,
          mentalChecklist: initial.mentalChecklist,
          complexities: initial.complexities
        });
        setChecklistText(initial.mentalChecklist.join("\n"));
      } else {
        setForm({ ...EMPTY, notes: NOTES_TEMPLATE });
        setChecklistText("");
      }
    }
  }, [open, initial]);

  const set = <K extends keyof PatternInput>(key: K, val: PatternInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Pattern name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const mentalChecklist = checklistText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      await onSubmit({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        mentalChecklist,
        complexities: form.complexities.filter(
          (c) => c.operation.trim() || c.complexity.trim()
        )
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
      title={isEdit ? "Edit Pattern" : "Add Pattern"}
      description={
        isEdit
          ? "Update this reusable insight."
          : "Capture a reusable DSA trick or interview heuristic."
      }
      size="max-w-3xl"
    >
      <div className="space-y-5">
        <Field label="Pattern Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Heap"
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
          )}
        </Field>

        <Field label="Short Description">
          <input
            type="text"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Kth element, Top K, Merge sorted lists…"
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
          />
        </Field>

        <Field label="Tags">
          <TagSelect
            value={form.tags}
            onChange={(t) => set("tags", t)}
            suggestions={PATTERN_TAGS}
            placeholder="Add tags…"
          />
        </Field>

        <Field
          label="Trigger Keywords"
          hint="Enter or comma to add — words that should make this pattern come to mind"
        >
          <ChipInput
            value={form.triggerKeywords}
            onChange={(k) => set("triggerKeywords", k)}
            placeholder="Kth, Top K, Median…"
          />
        </Field>

        <Field label="Notes">
          <MarkdownEditor
            value={form.notes}
            onChange={(v) => set("notes", v)}
            placeholder="Write your reusable insight in Markdown…"
          />
        </Field>

        <Field
          label="Template"
          hint="Optional — one fenced code block per language creates tabs"
        >
          <MarkdownEditor
            value={form.template}
            onChange={(v) => set("template", v)}
            placeholder={TEMPLATE_PLACEHOLDER}
            minRows={8}
          />
        </Field>

        <Field
          label="Mental Checklist"
          hint="One question per line — things to ask yourself before choosing this pattern"
        >
          <textarea
            value={checklistText}
            onChange={(e) => setChecklistText(e.target.value)}
            rows={5}
            placeholder={"Is K much smaller than N?\nDo I only need Top K elements?\nCan I avoid sorting everything?"}
            className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-ring"
          />
        </Field>

        <Field label="Complexities">
          <ComplexityEditor
            value={form.complexities}
            onChange={(c) => set("complexities", c)}
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
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
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
    </Modal>
  );
}
