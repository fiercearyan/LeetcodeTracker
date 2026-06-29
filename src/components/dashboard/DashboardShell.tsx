"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div
        className="flex min-w-0 flex-1 flex-col overflow-y-auto"
        style={{
          background:
            "radial-gradient(1100px 420px at 78% -8%, var(--accent-soft), transparent 62%), var(--bg)"
        }}
      >
        <Navbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-5 py-9 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
