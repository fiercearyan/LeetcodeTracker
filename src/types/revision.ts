export interface RevisionCard {
  _id: string;
  heading: string;
  question: string;
  answer: string;
  // Optional metadata — present today or added when migrating to MongoDB.
  project?: string;
  technology?: string;
  tags?: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
  status?: string;
  keywords?: string[];
  favorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type RevisionCardInput = Omit<RevisionCard, "_id">;

/**
 * Repository interface — the UI depends on this, not on the storage backend.
 * Today it is backed by a local JSON file; swapping in a MongoDB-backed
 * implementation later requires no UI changes.
 */
export interface RevisionRepository {
  list(): Promise<RevisionCard[]>;
  get(id: string): Promise<RevisionCard | null>;
  create(input: RevisionCardInput): Promise<RevisionCard>;
  update(id: string, input: Partial<RevisionCardInput>): Promise<RevisionCard>;
  remove(id: string): Promise<{ _id: string }>;
}
