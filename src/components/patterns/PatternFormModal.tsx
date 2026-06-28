"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { TagSelect } from "@/components/ui/TagSelect";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
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
  notes: ""
};

const NOTES_TEMPLATE = `## When should I think about this pattern?
If the problem mentions:
-

## Quick Decision Rules
| Situation | Approach |
| --- | --- |
|  |  |

## Checklist
- [ ] Identify the trigger keywords
- [ ] Confirm constraints fit
- [ ] Recall the template

## Interview Reminder
> Pause and ask: can this be solved with this pattern?
`;

export function PatternFormModal({
  open,
  onClose,
  initial,
  onSubmit
}: PatternFormModalProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<PatternInput>(EMPTY);
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
          notes: initial.notes
        });
      } else {
        setForm({ ...EMPTY, notes: NOTES_TEMPLATE });
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
      await onSubmit({
        ...form,
        name: form.name.trim(),
        description: form.description.trim()
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
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Pattern Name
          </label>
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
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Short Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Kth element, Top K, Merge sorted lists…"
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Tags</label>
          <TagSelect
            value={form.tags}
            onChange={(t) => set("tags", t)}
            suggestions={PATTERN_TAGS}
            placeholder="Add tags…"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Notes</label>
          <MarkdownEditor
            value={form.notes}
            onChange={(v) => set("notes", v)}
            placeholder="Write your reusable insight in Markdown…"
          />
        </div>

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
