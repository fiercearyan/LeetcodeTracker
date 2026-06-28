export interface Pattern {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  notes: string;
  views: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type PatternInput = {
  name: string;
  description: string;
  tags: string[];
  notes: string;
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
