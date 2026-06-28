"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Code2,
  Table,
  Quote,
  Eye,
  Pencil
} from "lucide-react";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

type Wrap = { before: string; after: string; placeholder: string };

const TABLE_SNIPPET = `\n| Column A | Column B |\n| --- | --- |\n| Cell 1 | Cell 2 |\n`;

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your approach in Markdown…",
  minRows = 12
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

  /** Wrap the current selection (or insert a placeholder). */
  const wrapSelection = ({ before, after, placeholder: ph }: Wrap) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || ph;
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  };

  /** Prefix each selected line (for lists / quotes). */
  const prefixLines = (prefix: string | ((i: number) => string)) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const slice = value.slice(start, end) || "item";
    const lines = slice.split("\n");
    const transformed = lines
      .map((line, i) => (typeof prefix === "function" ? prefix(i) : prefix) + line)
      .join("\n");
    const next = value.slice(0, start) + transformed + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => el.focus());
  };

  const wrapInlineCode = () =>
    wrapSelection({ before: "`", after: "`", placeholder: "code" });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();

    if (mod && key === "e") {
      e.preventDefault();
      wrapInlineCode();
      return;
    }
    if (mod && key === "b") {
      e.preventDefault();
      wrapSelection({ before: "**", after: "**", placeholder: "bold text" });
      return;
    }
    if (mod && key === "i") {
      e.preventDefault();
      wrapSelection({ before: "_", after: "_", placeholder: "italic text" });
      return;
    }
    // Typing a backtick with text selected wraps it as inline code.
    const el = textareaRef.current;
    if (e.key === "`" && el && el.selectionStart !== el.selectionEnd) {
      e.preventDefault();
      wrapInlineCode();
    }
  };

  const insertRaw = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const next = value.slice(0, start) + snippet + value.slice(start);
    onChange(next);
    requestAnimationFrame(() => el.focus());
  };

  const tools = [
    {
      icon: Bold,
      label: "Bold",
      action: () =>
        wrapSelection({ before: "**", after: "**", placeholder: "bold text" })
    },
    {
      icon: Italic,
      label: "Italic",
      action: () =>
        wrapSelection({ before: "_", after: "_", placeholder: "italic text" })
    },
    {
      icon: Code,
      label: "Inline code (⌘/Ctrl+E or `)",
      action: () =>
        wrapSelection({ before: "`", after: "`", placeholder: "code" })
    },
    {
      icon: List,
      label: "Bullet list",
      action: () => prefixLines("- ")
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      action: () => prefixLines((i) => `${i + 1}. `)
    },
    {
      icon: Code2,
      label: "Code block",
      action: () =>
        wrapSelection({
          before: "\n```java\n",
          after: "\n```\n",
          placeholder: "// your code"
        })
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => prefixLines("> ")
    },
    {
      icon: Table,
      label: "Table",
      action: () => insertRaw(TABLE_SNIPPET)
    }
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          {tools.map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              onClick={action}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              tab === "write"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Pencil className="h-3.5 w-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              tab === "preview"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={minRows}
          spellCheck={false}
          className="w-full resize-y bg-transparent px-4 py-3 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
        />
      ) : (
        <div className="min-h-[16rem] px-4 py-3">
          <MarkdownPreview content={value} />
        </div>
      )}
    </div>
  );
}
