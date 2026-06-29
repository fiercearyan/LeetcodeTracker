import { cn } from "@/lib/utils";

export function TopicChip({
  label,
  onRemove,
  className
}: {
  label: string;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[7px] px-[9px] py-[3px] text-xs",
        className
      )}
      style={{
        color: "var(--t3)",
        background: "rgba(var(--ink),0.025)",
        border: "1px solid rgba(var(--ink),0.07)"
      }}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-sm transition-colors"
          style={{ color: "var(--t6)" }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
