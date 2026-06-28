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
        "inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground",
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
