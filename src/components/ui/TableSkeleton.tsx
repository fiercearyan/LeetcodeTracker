export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border px-5 py-3.5">
        <div className="skeleton h-4 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="skeleton h-4 w-8" />
            <div className="skeleton h-4 flex-1 max-w-[14rem]" />
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton hidden h-4 w-32 sm:block" />
            <div className="skeleton ml-auto h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
