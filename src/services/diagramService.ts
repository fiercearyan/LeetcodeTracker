import type { Diagram, DiagramInput } from "@/types/diagram";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
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
    /* handled below */
  }
  if (!res.ok || !body?.success) {
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}

export const diagramService = {
  list(): Promise<Diagram[]> {
    return request<Diagram[]>("/api/diagrams");
  },
  get(id: string): Promise<Diagram> {
    return request<Diagram>(`/api/diagrams/${id}`);
  },
  create(payload: DiagramInput): Promise<Diagram> {
    return request<Diagram>("/api/diagrams", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  update(id: string, payload: Partial<DiagramInput>): Promise<Diagram> {
    return request<Diagram>(`/api/diagrams/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  remove(id: string): Promise<{ _id: string }> {
    return request<{ _id: string }>(`/api/diagrams/${id}`, {
      method: "DELETE"
    });
  }
};
