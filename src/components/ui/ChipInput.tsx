"use client";

import { useState } from "react";
import { TopicChip } from "@/components/ui/TopicChip";

interface ChipInputProps {
  value: string[];
  onChange: (chips: string[]) => void;
  placeholder?: string;
}

/**
 * Free-form chip input: Enter creates a chip, comma-separated paste is split,
 * Backspace on an empty field removes the last chip.
 */
export function ChipInput({
  value,
  onChange,
  placeholder = "Type and press Enter…"
}: ChipInputProps) {
  const [draft, setDraft] = useState("");

  const addChips = (raw: string) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const merged = [...value];
    for (const p of parts) {
      if (!merged.some((v) => v.toLowerCase() === p.toLowerCase())) {
        merged.push(p);
      }
    }
    onChange(merged);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (draft.trim()) {
        addChips(draft);
        setDraft("");
      }
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const remove = (chip: string) =>
    onChange(value.filter((c) => c !== chip));

  return (
    <div className="flex min-h-[2.75rem] w-full flex-wrap items-center gap-1.5 rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors focus-within:border-ring">
      {value.map((chip) => (
        <TopicChip key={chip} label={chip} onRemove={() => remove(chip)} />
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          if (text.includes(",")) {
            e.preventDefault();
            addChips(text);
            setDraft("");
          }
        }}
        onBlur={() => {
          if (draft.trim()) {
            addChips(draft);
            setDraft("");
          }
        }}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[8rem] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
