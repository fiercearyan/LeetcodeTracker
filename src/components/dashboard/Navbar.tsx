"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar({ onMenu }: { onMenu: () => void }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session?.user;
  const initial = (user?.name ?? "A").charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-30 flex h-[68px] items-center gap-3 px-5 backdrop-blur-xl sm:px-10"
      style={{
        background: "var(--bg-blur)",
        borderBottom: "1px solid rgba(var(--ink),0.05)"
      }}
    >
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="ml-auto flex items-center gap-2.5">
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-[11px] rounded-[30px] py-1.5 pl-[7px] pr-3.5 transition-colors"
            style={{
              background: "rgba(var(--ink),0.03)",
              border: "1px solid rgba(var(--ink),0.07)"
            }}
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={30}
                height={30}
                className="h-[30px] w-[30px] rounded-full"
              />
            ) : (
              <span
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[13px] font-semibold"
                style={{
                  background: "var(--avatar)",
                  border: "1px solid var(--accent-border)",
                  color: "var(--accent)"
                }}
              >
                {initial}
              </span>
            )}
            <span
              className="hidden max-w-[10rem] truncate text-[13.5px] font-medium sm:block"
              style={{ color: "var(--t2a)" }}
            >
              {user?.name ?? "Account"}
            </span>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div
                className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl shadow-lg"
                style={{
                  background: "var(--surface)",
                  border: "1px solid rgba(var(--ink),0.09)"
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: "1px solid rgba(var(--ink),0.07)" }}
                >
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p
                    className="truncate text-xs"
                    style={{ color: "var(--t5)" }}
                  >
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-400 transition-colors hover:bg-accent"
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
