"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { patternService } from "@/services/patternService";
import type { Pattern, PatternInput } from "@/types/pattern";

export function usePatterns() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patternService.list();
      setPatterns(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load patterns";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (payload: PatternInput) => {
    const created = await patternService.create(payload);
    setPatterns((prev) => [created, ...prev]);
    toast.success("Pattern added");
    return created;
  }, []);

  const update = useCallback(async (id: string, payload: PatternInput) => {
    const updated = await patternService.update(id, payload);
    setPatterns((prev) => prev.map((p) => (p._id === id ? updated : p)));
    toast.success("Pattern updated");
    return updated;
  }, []);

  const remove = useCallback(
    async (id: string) => {
      const snapshot = patterns;
      setPatterns((prev) => prev.filter((p) => p._id !== id));
      try {
        await patternService.remove(id);
        toast.success("Pattern deleted");
      } catch (err) {
        setPatterns(snapshot);
        const message =
          err instanceof Error ? err.message : "Failed to delete pattern";
        toast.error(message);
        throw err;
      }
    },
    [patterns]
  );

  /** Records a view (fire-and-forget) and bumps the local counter. */
  const registerView = useCallback((id: string) => {
    setPatterns((prev) =>
      prev.map((p) => (p._id === id ? { ...p, views: p.views + 1 } : p))
    );
    patternService.get(id).catch(() => {
      /* non-critical */
    });
  }, []);

  return { patterns, loading, error, refresh, create, update, remove, registerView };
}
