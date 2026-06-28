"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [10, 25, 50, 100];

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 text-sm sm:flex-row">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-ring"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">
          {from}–{to} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors",
              page <= 1
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-accent"
            )}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2 text-sm font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors",
              page >= totalPages
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-accent"
            )}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
