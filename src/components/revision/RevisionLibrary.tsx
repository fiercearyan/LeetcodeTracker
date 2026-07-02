"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Search, SearchX, Star, Upload } from "lucide-react";
import { revisionService } from "@/services/revisionService";
import { useRevisionLocal } from "@/hooks/useRevisionLocal";
import { RevisionCard } from "@/components/revision/RevisionCard";
import { RevisionDrawer } from "@/components/revision/RevisionDrawer";
import { cn } from "@/lib/utils";
import type { RevisionCard as TRevisionCard } from "@/types/revision";

export function RevisionLibrary() {
  const [cards, setCards] = useState<TRevisionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    isFavorite,
    isViewed,
    toggleFavorite,
    markViewed,
    favorites,
    viewed
  } = useRevisionLocal();

  useEffect(() => {
    revisionService
      .list()
      .then(setCards)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    return cards.filter((c) => {
      const matchesSearch =
        !t ||
        c.heading.toLowerCase().includes(t) ||
        c.question.toLowerCase().includes(t) ||
        c.answer.toLowerCase().includes(t) ||
        (c.keywords ?? []).some((k) => k.toLowerCase().includes(t));
      const matchesFav = !favOnly || favorites.includes(c._id);
      return matchesSearch && matchesFav;
    });
  }, [cards, search, favOnly, favorites]);

  const selectedIndex = filtered.findIndex((c) => c._id === selectedId);
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  const openCard = (c: TRevisionCard) => {
    setSelectedId(c._id);
    markViewed(c._id);
  };
  const goTo = (i: number) => {
    const c = filtered[i];
    if (c) {
      setSelectedId(c._id);
      markViewed(c._id);
    }
  };

  const progress = cards.length
    ? Math.round((viewed.length / cards.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="font-display text-[42px] leading-none tracking-[0.3px]">
            Project Revision
          </h1>
          <p className="mt-3 text-[13.5px]" style={{ color: "var(--t5)" }}>
            Revise your projects through interview-style questions.
          </p>
        </div>
        <button
          disabled
          title="Coming soon"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 self-start rounded-[11px] border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground sm:self-auto"
        >
          <Upload className="h-4 w-4" /> Import JSON
        </button>
      </motion.div>

      {/* Progress */}
      <div className="glass-card flex items-center gap-4 p-4">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span style={{ color: "var(--t5)" }}>Reading progress</span>
            <span className="font-mono" style={{ color: "var(--accent)" }}>
              {viewed.length} / {cards.length} revised
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ background: "rgba(var(--ink),0.06)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--accent)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across headings, questions and answers…"
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-ring"
          />
        </div>
        {favorites.length > 0 && (
          <button
            onClick={() => setFavOnly((f) => !f)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
              favOnly
                ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            <Star className={cn("h-4 w-4", favOnly && "fill-amber-400")} />
            Favorites
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card space-y-3 p-6">
              <div className="skeleton h-6 w-2/3" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {cards.length > 0 ? (
              <SearchX className="h-7 w-7" />
            ) : (
              <BookOpen className="h-7 w-7" />
            )}
          </div>
          <h3 className="text-lg font-semibold">
            {cards.length > 0 ? "No matching cards" : "No revision cards yet"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {cards.length > 0
              ? "Try a different search term or clear the favorites filter."
              : "Revision cards load from your project JSON."}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {filtered.map((c) => (
              <RevisionCard
                key={c._id}
                card={c}
                favorite={isFavorite(c._id)}
                viewed={isViewed(c._id)}
                onOpen={openCard}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <RevisionDrawer
        open={Boolean(selected)}
        card={selected}
        favorite={selected ? isFavorite(selected._id) : false}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex >= 0 && selectedIndex < filtered.length - 1}
        onPrev={() => goTo(selectedIndex - 1)}
        onNext={() => goTo(selectedIndex + 1)}
        onClose={() => setSelectedId(null)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
