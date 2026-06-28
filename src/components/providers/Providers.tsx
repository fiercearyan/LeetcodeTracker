"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "!bg-card !text-card-foreground !border !border-border !rounded-xl !shadow-lg",
            duration: 3500
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
