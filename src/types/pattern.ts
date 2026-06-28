import type { Difficulty } from "@/types/question";

export interface Complexity {
  operation: string;
  complexity: string;
}

/** Minimal question shape returned with a pattern's related questions. */
export interface RelatedQuestion {
  _id: string;
  questionNumber: number;
  questionName: string;
  difficulty: Difficulty;
}

export interface Pattern {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  triggerKeywords: string[];
  notes: string;
  template: string;
  mentalChecklist: string[];
  complexities: Complexity[];
  views: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  /** Computed dynamically from the Question collection (not persisted). */
  usageCount?: number;
  relatedQuestions?: RelatedQuestion[];
}

export type PatternInput = {
  name: string;
  description: string;
  tags: string[];
  triggerKeywords: string[];
  notes: string;
  template: string;
  mentalChecklist: string[];
  complexities: Complexity[];
};

export type PatternSortKey = "name" | "updatedAt" | "createdAt" | "views";

export const PATTERN_SORT_OPTIONS: {
  key: PatternSortKey;
  label: string;
}[] = [
  { key: "name", label: "Alphabetical" },
  { key: "updatedAt", label: "Recently Updated" },
  { key: "createdAt", label: "Recently Created" },
  { key: "views", label: "Most Viewed" }
];

/** Suggested tags — users can also create their own. */
export const PATTERN_TAGS: string[] = [
  "Heap",
  "Priority Queue",
  "Top K",
  "Binary Heap",
  "Streaming",
  "Sliding Window",
  "Binary Search",
  "Two Pointers",
  "Monotonic Stack",
  "Trie",
  "Graph",
  "BFS",
  "DFS",
  "Greedy",
  "Backtracking",
  "DP",
  "Tree",
  "Sorting",
  "Union Find",
  "Bit Manipulation",
  "Math",
  "Hashing"
];

/** Languages recognised for the Template tabs, in display order. */
export const TEMPLATE_LANGUAGES: { id: string; label: string; aliases: string[] }[] =
  [
    { id: "java", label: "Java", aliases: ["java"] },
    { id: "python", label: "Python", aliases: ["python", "py"] },
    { id: "go", label: "Go", aliases: ["go", "golang"] },
    { id: "javascript", label: "JavaScript", aliases: ["javascript", "js"] },
    { id: "cpp", label: "C++", aliases: ["cpp", "c++", "cplusplus"] }
  ];
