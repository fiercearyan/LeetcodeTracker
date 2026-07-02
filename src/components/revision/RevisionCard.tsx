"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RevisionCard as TRevisionCard } from "@/types/revision";

interface Props {
  card: TRevisionCard;
  favorite: boolean;
  viewed: boolean;
  onOpen: (c: TRevisionCard) => void;
  onToggleFavorite: (id: string) => void;
}

export function RevisionCard({
  card,
  favorite,
  viewed,
  onOpen,
  onToggleFavorite
}: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(card)}
      className="glass-card group flex min-h-[168px] cursor-pointer flex-col p-6 transition-shadow hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[24px] leading-[1.1]">
          {card.heading}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(card._id);
          }}
          aria-label={favorite ? "Unfavorite" : "Favorite"}
          className={cn(
            "shrink-0 rounded-lg p-1.5 transition-colors",
            favorite
              ? "text-amber-400"
              : "text-muted-foreground opacity-0 hover:text-amber-400 group-hover:opacity-100"
          )}
        >
          <Star className={cn("h-4 w-4", favorite && "fill-amber-400")} />
        </button>
      </div>

      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
        {card.question}
      </p>

      {card.tags && card.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-[7px] px-[9px] py-[3px] text-xs"
              style={{
                color: "var(--t3)",
                background: "rgba(var(--ink),0.025)",
                border: "1px solid rgba(var(--ink),0.07)"
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {viewed && (
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-500">
          <Check className="h-3.5 w-3.5" /> Revised
        </div>
      )}
    </motion.div>
  );
}
