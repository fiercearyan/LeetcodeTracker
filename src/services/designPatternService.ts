import type {
  DesignPattern,
  DesignPatternInput
} from "@/types/designPattern";

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

export const designPatternService = {
  list(): Promise<DesignPattern[]> {
    return request<DesignPattern[]>("/api/design-patterns");
  },
  get(id: string): Promise<DesignPattern> {
    return request<DesignPattern>(`/api/design-patterns/${id}`);
  },
  create(payload: DesignPatternInput): Promise<DesignPattern> {
    return request<DesignPattern>("/api/design-patterns", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  update(id: string, payload: DesignPatternInput): Promise<DesignPattern> {
    return request<DesignPattern>(`/api/design-patterns/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  remove(id: string): Promise<{ _id: string }> {
    return request<{ _id: string }>(`/api/design-patterns/${id}`, {
      method: "DELETE"
    });
  }
};
