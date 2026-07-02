import rawCards from "@/data/project-revision.json";
import type {
  RevisionCard,
  RevisionCardInput,
  RevisionRepository
} from "@/types/revision";

function slugify(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "card"}-${index}`;
}

/**
 * Local JSON-backed repository. Mirrors the future REST surface
 * (GET /revision, GET /revision/:id, POST, PUT, DELETE) so the module can be
 * migrated to MongoDB by swapping this single class.
 */
class LocalJsonRevisionRepository implements RevisionRepository {
  private cards: RevisionCard[];

  constructor() {
    this.cards = (rawCards as Omit<RevisionCard, "_id">[]).map((c, i) => ({
      _id: slugify(c.heading, i),
      ...c
    }));
  }

  async list(): Promise<RevisionCard[]> {
    return this.cards;
  }

  async get(id: string): Promise<RevisionCard | null> {
    return this.cards.find((c) => c._id === id) ?? null;
  }

  // Write operations are stubbed today; they define the contract for the
  // future MongoDB-backed implementation.
  async create(_input: RevisionCardInput): Promise<RevisionCard> {
    throw new Error("Creating revision cards will be available with MongoDB.");
  }
  async update(
    _id: string,
    _input: Partial<RevisionCardInput>
  ): Promise<RevisionCard> {
    throw new Error("Editing revision cards will be available with MongoDB.");
  }
  async remove(_id: string): Promise<{ _id: string }> {
    throw new Error("Deleting revision cards will be available with MongoDB.");
  }
}

export const revisionService: RevisionRepository =
  new LocalJsonRevisionRepository();
