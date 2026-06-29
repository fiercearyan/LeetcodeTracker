export type DesignPatternType = "Creational" | "Structural" | "Behavioral";

export const DESIGN_PATTERN_TYPES: DesignPatternType[] = [
  "Creational",
  "Structural",
  "Behavioral"
];

export interface CoreConcept {
  title: string;
  description: string;
}

/** Minimal shape used for related-pattern links. */
export interface RelatedDesignPattern {
  _id: string;
  name: string;
  type: DesignPatternType;
}

export interface DesignPattern {
  _id: string;
  name: string;
  type: DesignPatternType;
  description: string;
  triggerWords: string[];
  definition: string;
  problemStatement: string;
  useCases: string;
  whenToUse: string[];
  coreConcepts: CoreConcept[];
  solution: string;
  advantages: string[];
  disadvantages: string[];
  interviewQuestions: string[];
  exampleCode: string;
  relatedPatterns: string[];
  umlImage: string;
  notes: string;
  views: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  /** Resolved on the detail endpoint. */
  relatedPatternDetails?: RelatedDesignPattern[];
}

export type DesignPatternInput = {
  name: string;
  type: DesignPatternType;
  description: string;
  triggerWords: string[];
  definition: string;
  problemStatement: string;
  useCases: string;
  whenToUse: string[];
  coreConcepts: CoreConcept[];
  solution: string;
  advantages: string[];
  disadvantages: string[];
  interviewQuestions: string[];
  exampleCode: string;
  relatedPatterns: string[];
  umlImage: string;
  notes: string;
};

export type DesignPatternSortKey = "name" | "updatedAt" | "createdAt";

export const DESIGN_PATTERN_SORT_OPTIONS: {
  key: DesignPatternSortKey;
  label: string;
}[] = [
  { key: "name", label: "Alphabetical" },
  { key: "updatedAt", label: "Recently Updated" },
  { key: "createdAt", label: "Recently Created" }
];

/** Tinted badge colors per type (kept within the Recall palette). */
export const TYPE_BADGE: Record<
  DesignPatternType,
  { color: string; bg: string; border: string }
> = {
  Creational: {
    color: "#7DC4A0",
    bg: "rgba(125,196,160,0.12)",
    border: "rgba(125,196,160,0.32)"
  },
  Structural: {
    color: "#8B7FF0",
    bg: "rgba(139,127,240,0.12)",
    border: "rgba(139,127,240,0.32)"
  },
  Behavioral: {
    color: "#D7A75A",
    bg: "rgba(215,167,90,0.12)",
    border: "rgba(215,167,90,0.32)"
  }
};
