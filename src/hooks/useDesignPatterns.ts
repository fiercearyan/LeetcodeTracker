"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { designPatternService } from "@/services/designPatternService";
import type {
  DesignPattern,
  DesignPatternInput
} from "@/types/designPattern";

export function useDesignPatterns() {
  const [patterns, setPatterns] = useState<DesignPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPatterns(await designPatternService.list());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load design patterns";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (payload: DesignPatternInput) => {
    const created = await designPatternService.create(payload);
    setPatterns((prev) => [created, ...prev]);
    toast.success("Design pattern added");
    return created;
  }, []);

  const update = useCallback(
    async (id: string, payload: DesignPatternInput) => {
      const updated = await designPatternService.update(id, payload);
      setPatterns((prev) => prev.map((p) => (p._id === id ? updated : p)));
      toast.success("Design pattern updated");
      return updated;
    },
    []
  );

  const remove = useCallback(
    async (id: string) => {
      const snapshot = patterns;
      setPatterns((prev) => prev.filter((p) => p._id !== id));
      try {
        await designPatternService.remove(id);
        toast.success("Design pattern deleted");
      } catch (err) {
        setPatterns(snapshot);
        toast.error(
          err instanceof Error ? err.message : "Failed to delete pattern"
        );
        throw err;
      }
    },
    [patterns]
  );

  return { patterns, loading, error, refresh, create, update, remove };
}
