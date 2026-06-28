export type Difficulty = "Easy" | "Medium" | "Hard";

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export const TOPICS: string[] = [
  "Array",
  "Stack",
  "Queue",
  "Binary Search",
  "Graph",
  "DP",
  "Trie",
  "Heap",
  "Greedy",
  "Sliding Window",
  "Backtracking",
  "Union Find",
  "Segment Tree",
  "Monotonic Stack",
  "Bit Manipulation",
  "String",
  "Tree",
  "Linked List",
  "HashMap"
];

export interface Question {
  _id: string;
  questionNumber: number;
  questionName: string;
  difficulty: Difficulty;
  topics: string[];
  leetcodeUrl: string;
  approach: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type QuestionInput = {
  questionNumber: number;
  questionName: string;
  difficulty: Difficulty;
  topics: string[];
  leetcodeUrl: string;
  approach: string;
};

export type SortKey =
  | "questionNumber"
  | "questionName"
  | "difficulty"
  | "createdAt"
  | "updatedAt";

export type SortOrder = "asc" | "desc";
