"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

export function MarkdownPreview({
  content,
  className
}: {
  content: string;
  className?: string;
}) {
  if (!content?.trim()) {
    return (
      <p className={cn("text-sm italic text-muted-foreground", className)}>
        Nothing to preview yet.
      </p>
    );
  }

  return (
    <div className={cn("markdown-body", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
