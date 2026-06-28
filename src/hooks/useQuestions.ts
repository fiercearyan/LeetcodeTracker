"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { questionService } from "@/services/questionService";
import type { Question, QuestionInput } from "@/types/question";

/**
 * Central data hook for the question tracker.
 * Owns the canonical list and exposes optimistic CRUD helpers.
 */
export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await questionService.list();
      setQuestions(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load questions";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (payload: QuestionInput) => {
    const created = await questionService.create(payload);
    setQuestions((prev) => [created, ...prev]);
    toast.success("Question added");
    return created;
  }, []);

  const update = useCallback(
    async (id: string, payload: QuestionInput) => {
      const updated = await questionService.update(id, payload);
      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? updated : q))
      );
      toast.success("Question updated");
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    // Optimistic removal with rollback on failure.
    const snapshot = questions;
    setQuestions((prev) => prev.filter((q) => q._id !== id));
    try {
      await questionService.remove(id);
      toast.success("Question deleted");
    } catch (err) {
      setQuestions(snapshot);
      const message =
        err instanceof Error ? err.message : "Failed to delete question";
      toast.error(message);
      throw err;
    }
  }, [questions]);

  return { questions, loading, error, refresh, create, update, remove };
}
