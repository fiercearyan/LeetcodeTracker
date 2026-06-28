"use client";

import { useMemo, useState } from "react";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { TEMPLATE_LANGUAGES } from "@/types/pattern";
import { cn } from "@/lib/utils";

interface ParsedBlock {
  langId: string;
  label: string;
  code: string;
}

/** Map a raw fence language to a known id/label, falling back to the raw value. */
function normalizeLang(raw: string): { id: string; label: string } {
  const lower = raw.trim().toLowerCase();
  const known = TEMPLATE_LANGUAGES.find((l) => l.aliases.includes(lower));
  if (known) return { id: known.id, label: known.label };
  if (!lower) return { id: "code", label: "Code" };
  return { id: lower, label: raw.trim() };
}

function parseTemplate(template: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  const fence = /```([^\n`]*)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = fence.exec(template)) !== null) {
    const { id, label } = normalizeLang(match[1] ?? "");
    blocks.push({ langId: id, label, code: match[2].replace(/\s+$/, "") });
  }
  return blocks;
}

export function TemplateTabs({ template }: { template: string }) {
  const blocks = useMemo(() => parseTemplate(template), [template]);

  // Distinct languages, preserving the canonical display order where possible.
  const languages = useMemo(() => {
    const ids = Array.from(new Set(blocks.map((b) => b.langId)));
    return ids
      .map((id) => blocks.find((b) => b.langId === id)!)
      .sort((a, b) => {
        const ai = TEMPLATE_LANGUAGES.findIndex((l) => l.id === a.langId);
        const bi = TEMPLATE_LANGUAGES.findIndex((l) => l.id === b.langId);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
  }, [blocks]);

  const [active, setActive] = useState(0);

  if (!template.trim()) {
    return (
      <p className="text-sm italic text-muted-foreground">
        No template added yet.
      </p>
    );
  }

  // No fenced code, or a single language → render the markdown as-is.
  if (languages.length <= 1) {
    return <MarkdownPreview content={template} />;
  }

  const current = languages[Math.min(active, languages.length - 1)];
  const code = blocks
    .filter((b) => b.langId === current.langId)
    .map((b) => b.code)
    .join("\n\n");

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-1.5">
        {languages.map((lang, i) => (
          <button
            key={lang.langId}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              i === active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <div className="markdown-body px-4 py-1">
        <MarkdownPreview content={"```" + current.langId + "\n" + code + "\n```"} />
      </div>
    </div>
  );
}
