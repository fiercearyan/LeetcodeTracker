"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ListChecks, Network, Shapes, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: typeof ListChecks;
  disabled?: boolean;
}

const NAV: NavItem[] = [
  { label: "Question Tracker", href: "/dashboard/questions", icon: ListChecks },
  { label: "Pattern Library", href: "/dashboard/patterns", icon: Network },
  {
    label: "Design Patterns",
    href: "/dashboard/design-patterns",
    icon: Shapes
  },
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
    <div className="flex h-full flex-col px-5 pb-6 pt-6">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 pb-1">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[11px] font-mono text-[15px] font-semibold"
          style={{
            background: "var(--tile)",
            border: "1px solid var(--accent-border)",
            color: "var(--accent)",
            boxShadow: "inset 0 1px 0 rgba(var(--ink),0.04)"
          }}
        >
          &lt;/&gt;
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-[25px] tracking-[0.2px]">Recall</span>
          <span
            className="mt-[3px] font-mono text-[9.5px] uppercase tracking-[2.5px]"
            style={{ color: "var(--t6)" }}
          >
            dsa&nbsp;tracker
          </span>
        </div>
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-[10px] px-[13px] py-[11px] text-[14.5px] font-medium"
                style={{ color: "var(--t9)" }}
                title="Coming in Phase 2"
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
                <span
                  className="ml-auto rounded-[5px] px-[7px] py-[3px] font-mono text-[9px] tracking-[1.5px]"
                  style={{
                    color: "var(--t8)",
                    background: "rgba(var(--ink),0.04)"
                  }}
                >
                  SOON
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="relative flex items-center gap-3 rounded-[10px] px-[13px] py-[11px] text-[14.5px] font-medium transition-colors"
              style={{
                background: active ? "var(--accent-soft)" : "transparent",
                color: active ? "var(--t1)" : "var(--t4)"
              }}
            >
              {active && (
                <span
                  className="absolute -left-5 bottom-[11px] top-[11px] w-[3px] rounded-r-[3px]"
                  style={{ background: "var(--accent)" }}
                />
              )}
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Phase note */}
      <div
        className="mt-auto rounded-xl p-[14px]"
        style={{
          background: "rgba(var(--ink),0.02)",
          border: "1px solid rgba(var(--ink),0.05)"
        }}
      >
        <div
          className="font-mono text-[10px] uppercase tracking-[1.5px]"
          style={{ color: "var(--accent)" }}
        >
          Phase 1
        </div>
        <div
          className="mt-1.5 text-[12.5px] leading-[1.5]"
          style={{ color: "var(--t5)" }}
        >
          Profile Analytics arrives in Phase&nbsp;2 — streaks, heatmaps &amp;
          recall scoring.
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden w-[266px] shrink-0 lg:block"
        style={{
          background: "var(--bg-side)",
          borderRight: "1px solid rgba(var(--ink),0.06)"
        }}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside
            className="absolute left-0 top-0 h-full w-[266px] shadow-xl"
            style={{
              background: "var(--bg-side)",
              borderRight: "1px solid rgba(var(--ink),0.06)"
            }}
          >
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
