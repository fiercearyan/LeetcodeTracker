"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

export function LoginCard() {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard/questions" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-card relative z-10 w-full max-w-md p-8 sm:p-10"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <div
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-[18px] font-mono text-2xl font-semibold"
          style={{
            background: "var(--tile)",
            border: "1px solid var(--accent-border)",
            color: "var(--accent)",
            boxShadow: "inset 0 1px 0 rgba(var(--ink),0.05)"
          }}
        >
          &lt;/&gt;
        </div>
        <h1 className="font-display text-4xl tracking-[0.3px] sm:text-5xl">
          Recall
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--t5)" }}>
          Your DSA second brain — patterns, approaches and notes you can summon
          on demand.
        </p>
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-all hover:bg-accent hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        <span>{loading ? "Redirecting…" : "Continue with Google"}</span>
      </button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing you agree to track your problem-solving journey securely.
      </p>
    </motion.div>
  );
}
