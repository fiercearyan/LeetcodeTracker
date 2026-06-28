import type { Pattern, PatternInput } from "@/types/pattern";

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
    // handled below
  }

  if (!res.ok || !body?.success) {
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}

export const patternService = {
  list(): Promise<Pattern[]> {
    return request<Pattern[]>("/api/patterns");
  },

  /** Fetches a pattern and increments its server-side view counter. */
  get(id: string): Promise<Pattern> {
    return request<Pattern>(`/api/patterns/${id}`);
  },

  create(payload: PatternInput): Promise<Pattern> {
    return request<Pattern>("/api/patterns", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  update(id: string, payload: PatternInput): Promise<Pattern> {
    return request<Pattern>(`/api/patterns/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },

  remove(id: string): Promise<{ _id: string }> {
    return request<{ _id: string }>(`/api/patterns/${id}`, {
      method: "DELETE"
    });
  }
};
