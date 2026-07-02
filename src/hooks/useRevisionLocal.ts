"use client";

import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "recall.revision.favorites";
const VIEW_KEY = "recall.revision.viewed";
const LAST_KEY = "recall.revision.lastOpened";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

/**
 * Locally-persisted revision state: favorites, viewed cards (reading progress),
 * and the last opened card. All stored in localStorage — no backend needed.
 */
export function useRevisionLocal() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);
  const [lastOpened, setLastOpened] = useState<string | null>(null);

  useEffect(() => {
    setFavorites(read(FAV_KEY));
    setViewed(read(VIEW_KEY));
    if (typeof window !== "undefined")
      setLastOpened(localStorage.getItem(LAST_KEY));
  }, []);

  const persist = (key: string, value: string[]) => {
    if (typeof window !== "undefined")
      localStorage.setItem(key, JSON.stringify(value));
  };

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      persist(FAV_KEY, next);
      return next;
    });
  }, []);

  const markViewed = useCallback((id: string) => {
    if (typeof window !== "undefined") localStorage.setItem(LAST_KEY, id);
    setLastOpened(id);
    setViewed((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      persist(VIEW_KEY, next);
      return next;
    });
  }, []);

  return {
    favorites,
    viewed,
    lastOpened,
    isFavorite: (id: string) => favorites.includes(id),
    isViewed: (id: string) => viewed.includes(id),
    toggleFavorite,
    markViewed
  };
}
