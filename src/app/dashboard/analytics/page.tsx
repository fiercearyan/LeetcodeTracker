import { BarChart3 } from "lucide-react";

/**
 * Phase 2 placeholder. The route exists so the architecture (sidebar nav,
 * protected layout) is ready for the analytics module to be plugged in later
 * without refactoring.
 */
export default function AnalyticsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BarChart3 className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Profile Analytics</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Rich analytics — solved distribution, streaks, contest ratings,
        topic-wise progress and an AI revision planner — are planned for Phase 2.
      </p>
      <span className="mt-5 rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Coming soon
      </span>
    </div>
  );
}
