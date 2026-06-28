import type { Question, QuestionInput } from "@/types/question";

/**
 * Service layer for all question-related API calls.
 * Keeps fetch logic out of components and gives a single place to evolve the
 * transport (e.g. swap fetch for axios) without touching the UI.
 */

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init
  });

  let body: ApiEnvelope<T> | null = null;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // ignore – handled below
  }

  if (!res.ok || !body?.success) {
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }

  return body.data as T;
}

export const questionService = {
  list(): Promise<Question[]> {
    return request<Question[]>("/api/questions");
  },

  get(id: string): Promise<Question> {
    return request<Question>(`/api/questions/${id}`);
  },

  create(payload: QuestionInput): Promise<Question> {
    return request<Question>("/api/questions", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  update(id: string, payload: QuestionInput): Promise<Question> {
    return request<Question>(`/api/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },

  remove(id: string): Promise<{ _id: string }> {
    return request<{ _id: string }>(`/api/questions/${id}`, {
      method: "DELETE"
    });
  }
};
