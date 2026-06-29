/** Loose node/edge types — we persist whatever React Flow produces. */
export interface DiagramNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  width?: number | null;
  height?: number | null;
  [key: string]: unknown;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  [key: string]: unknown;
}

export interface Diagram {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  folder: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  thumbnail: string;
  linkedQuestions: string[];
  linkedPatterns: string[];
  linkedDesignPatterns: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type DiagramInput = {
  title: string;
  description?: string;
  tags?: string[];
  folder?: string;
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  thumbnail?: string;
  linkedQuestions?: string[];
  linkedPatterns?: string[];
  linkedDesignPatterns?: string[];
};

/** Folder suggestions (free-form folders are also allowed). */
export const DIAGRAM_FOLDERS = [
  "Design Patterns",
  "LLD",
  "HLD",
  "System Design",
  "DSA",
  "Backend",
  "Interview"
];
