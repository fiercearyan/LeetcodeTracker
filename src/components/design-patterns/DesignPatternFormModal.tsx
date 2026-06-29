"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { ChipInput } from "@/components/ui/ChipInput";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
import { CoreConceptsEditor } from "@/components/design-patterns/CoreConceptsEditor";
import { MultiTextEditor } from "@/components/design-patterns/MultiTextEditor";
import { PatternPicker, type PatternOption } from "@/components/questions/PatternPicker";
import {
  DESIGN_PATTERN_TYPES,
  TYPE_BADGE,
  type DesignPattern,
  type DesignPatternInput,
  type DesignPatternType
} from "@/types/designPattern";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: DesignPattern | null;
  onSubmit: (payload: DesignPatternInput) => Promise<unknown>;
  relatedOptions: PatternOption[];
}

const EMPTY: DesignPatternInput = {
  name: "",
  type: "Creational",
  description: "",
  triggerWords: [],
  definition: "",
  problemStatement: "",
  useCases: "",
  whenToUse: [],
  coreConcepts: [],
  solution: "",
  advantages: [],
  disadvantages: [],
  interviewQuestions: [],
  exampleCode: "",
  relatedPatterns: [],
  umlImage: "",
  notes: ""
};

const CODE_TEMPLATE = `\`\`\`java
// Java example
\`\`\`

\`\`\`python
# Python example
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

const inputCls =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring";

export function DesignPatternFormModal({
  open,
  onClose,
  initial,
  onSubmit,
  relatedOptions
}: Props) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<DesignPatternInput>(EMPTY);
  const [whenText, setWhenText] = useState("");
  const [advText, setAdvText] = useState("");
  const [disText, setDisText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (initial) {
      setForm({
        name: initial.name,
        type: initial.type,
        description: initial.description,
        triggerWords: initial.triggerWords,
        definition: initial.definition,
        problemStatement: initial.problemStatement,
        useCases: initial.useCases,
        whenToUse: initial.whenToUse,
        coreConcepts: initial.coreConcepts,
        solution: initial.solution,
        advantages: initial.advantages,
        disadvantages: initial.disadvantages,
        interviewQuestions: initial.interviewQuestions,
        exampleCode: initial.exampleCode,
        relatedPatterns: initial.relatedPatterns,
        umlImage: initial.umlImage,
        notes: initial.notes
      });
      setWhenText(initial.whenToUse.join("\n"));
      setAdvText(initial.advantages.join("\n"));
      setDisText(initial.disadvantages.join("\n"));
    } else {
      setForm({ ...EMPTY, exampleCode: CODE_TEMPLATE });
      setWhenText("");
      setAdvText("");
      setDisText("");
    }
  }, [open, initial]);

  const set = <K extends keyof DesignPatternInput>(
    key: K,
    val: DesignPatternInput[K]
  ) => setForm((f) => ({ ...f, [key]: val }));

  const onUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large (max 2 MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("umlImage", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setErrors({ name: "Pattern name is required" });
      return;
    }
    setSaving(true);
    try {
      const lines = (s: string) =>
        s.split("\n").map((l) => l.trim()).filter(Boolean);
      await onSubmit({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        whenToUse: lines(whenText),
        advantages: lines(advText),
        disadvantages: lines(disText),
        coreConcepts: form.coreConcepts.filter(
          (c) => c.title.trim() || c.description.trim()
        ),
        interviewQuestions: form.interviewQuestions
          .map((q) => q.trim())
          .filter(Boolean)
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
      title={isEdit ? "Edit Design Pattern" : "Add Design Pattern"}
      description="Build a revisable handbook entry for this software design pattern."
      size="max-w-3xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Pattern Name">
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Flyweight"
              className={inputCls}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
            )}
          </Field>
          <Field label="Pattern Type">
            <div className="flex gap-2">
              {DESIGN_PATTERN_TYPES.map((t) => {
                const active = form.type === t;
                const s = TYPE_BADGE[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t as DesignPatternType)}
                    className="flex-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all"
                    style={
                      active
                        ? { color: "#fff", background: s.color, border: `1px solid ${s.color}` }
                        : { color: s.color, background: s.bg, border: `1px solid ${s.border}` }
                    }
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <Field label="Short Description" hint="max 2 lines on the card">
          <input
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Helps reduce memory usage by sharing data among many objects."
            className={inputCls}
          />
        </Field>

        <Field label="Trigger Words" hint="Enter or comma to add">
          <ChipInput
            value={form.triggerWords}
            onChange={(v) => set("triggerWords", v)}
            placeholder="Extrinsic, Intrinsic, Shared State…"
          />
        </Field>

        <Field label="Definition (Overview)">
          <MarkdownEditor
            value={form.definition}
            onChange={(v) => set("definition", v)}
            minRows={6}
            placeholder="What is this pattern?"
          />
        </Field>

        <Field label="Real-world Use Cases">
          <MarkdownEditor
            value={form.useCases}
            onChange={(v) => set("useCases", v)}
            minRows={5}
            placeholder={"- Word Processor\n- Game Development\n- Icons"}
          />
        </Field>

        <Field label="Problem Statement">
          <MarkdownEditor
            value={form.problemStatement}
            onChange={(v) => set("problemStatement", v)}
            minRows={4}
            placeholder="Why was this pattern introduced?"
          />
        </Field>

        <Field label="When to Use" hint="one item per line (checklist)">
          <textarea
            value={whenText}
            onChange={(e) => setWhenText(e.target.value)}
            rows={4}
            placeholder={"Memory is limited\nObjects share common state\nObject creation is expensive"}
            className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-ring"
          />
        </Field>

        <Field label="Core Concepts">
          <CoreConceptsEditor
            value={form.coreConcepts}
            onChange={(v) => set("coreConcepts", v)}
          />
        </Field>

        <Field label="How It Solves the Problem">
          <MarkdownEditor
            value={form.solution}
            onChange={(v) => set("solution", v)}
            minRows={6}
            placeholder={"1. Separate intrinsic and extrinsic state.\n2. ..."}
          />
        </Field>

        <Field label="UML Diagram" hint="image, max 2 MB">
          {form.umlImage ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.umlImage}
                alt="UML preview"
                className="max-h-48 rounded-xl border border-border object-contain"
              />
              <button
                type="button"
                onClick={() => set("umlImage", "")}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-6 text-sm font-medium text-muted-foreground transition-colors hover:border-ring/50 hover:text-foreground"
            >
              <ImagePlus className="h-5 w-5" /> Upload UML diagram
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </Field>

        <Field label="Example Code" hint="one fenced block per language for tabs">
          <MarkdownEditor
            value={form.exampleCode}
            onChange={(v) => set("exampleCode", v)}
            minRows={8}
            placeholder={CODE_TEMPLATE}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Advantages" hint="one per line">
            <textarea
              value={advText}
              onChange={(e) => setAdvText(e.target.value)}
              rows={4}
              placeholder={"Saves memory\nFaster object creation"}
              className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-ring"
            />
          </Field>
          <Field label="Disadvantages" hint="one per line">
            <textarea
              value={disText}
              onChange={(e) => setDisText(e.target.value)}
              rows={4}
              placeholder={"Increased complexity\nHarder debugging"}
              className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-ring"
            />
          </Field>
        </div>

        <Field
          label="Interview Questions"
          hint="first line = question, rest = answer (Markdown)"
        >
          <MultiTextEditor
            value={form.interviewQuestions}
            onChange={(v) => set("interviewQuestions", v)}
          />
        </Field>

        <Field label="Related Patterns">
          <PatternPicker
            value={form.relatedPatterns}
            onChange={(v) => set("relatedPatterns", v)}
            options={relatedOptions}
          />
        </Field>

        <Field label="Personal Notes">
          <MarkdownEditor
            value={form.notes}
            onChange={(v) => set("notes", v)}
            minRows={5}
            placeholder="Observations, mistakes, tips…"
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
