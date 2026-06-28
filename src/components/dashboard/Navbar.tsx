"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar({ onMenu }: { onMenu: () => void }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-border bg-background p-0.5 pr-2 transition-colors hover:bg-accent"
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4" />
              </span>
            )}
            <span className="hidden max-w-[8rem] truncate text-sm font-medium sm:block">
              {user?.name ?? "Account"}
            </span>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <div className="border-b border-border px-4 py-3">
                  <p className="truncate text-sm font-medium">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-500 transition-colors hover:bg-accent"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
