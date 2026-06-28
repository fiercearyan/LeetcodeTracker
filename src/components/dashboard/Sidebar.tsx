"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Code2, ListChecks, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof ListChecks;
  disabled?: boolean;
}

const NAV: NavItem[] = [
  { label: "Question Tracker", href: "/dashboard/questions", icon: ListChecks },
  {
    label: "Profile Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    disabled: true
  }
];

export function Sidebar({
  mobileOpen,
  onClose
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500 text-primary-foreground">
          <Code2 className="h-5 w-5" />
        </div>
        <span className="text-base font-semibold tracking-tight">
          LeetCode Tracker
        </span>
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex cursor-not-allowed items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground/60"
                title="Coming in Phase 2"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-[1.15rem] w-[1.15rem]" />
                  {item.label}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-[1.15rem] w-[1.15rem]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Phase 1</p>
        <p className="mt-0.5">Profile Analytics arrives in Phase 2.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card/40 lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-card shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
