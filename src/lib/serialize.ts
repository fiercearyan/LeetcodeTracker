import type { QuestionDocument } from "@/models/Question";
import type { Question } from "@/types/question";
import type { PatternDocument } from "@/models/Pattern";
import type { Pattern } from "@/types/pattern";
import type { DesignPatternDocument } from "@/models/DesignPattern";
import type { DesignPattern } from "@/types/designPattern";

/**
 * Convert a Mongoose document into a plain, client-safe Question object.
 */
export function serializeQuestion(doc: QuestionDocument): Question {
  return {
    _id: String(doc._id),
    questionNumber: doc.questionNumber,
    questionName: doc.questionName,
    difficulty: doc.difficulty,
    topics: doc.topics ?? [],
    leetcodeUrl: doc.leetcodeUrl,
    approach: doc.approach ?? "",
    patterns: (doc.patterns ?? []).map((p) => String(p)),
    createdBy: doc.createdBy,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

export function serializePattern(doc: PatternDocument): Pattern {
  return {
    _id: String(doc._id),
    name: doc.name,
    description: doc.description ?? "",
    tags: doc.tags ?? [],
    triggerKeywords: doc.triggerKeywords ?? [],
    notes: doc.notes ?? "",
    template: doc.template ?? "",
    mentalChecklist: doc.mentalChecklist ?? [],
    complexities: (doc.complexities ?? []).map((c) => ({
      operation: c.operation ?? "",
      complexity: c.complexity ?? ""
    })),
    views: doc.views ?? 0,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

export function serializeDesignPattern(
  doc: DesignPatternDocument
): DesignPattern {
  return {
    _id: String(doc._id),
    name: doc.name,
    type: doc.type,
    description: doc.description ?? "",
    triggerWords: doc.triggerWords ?? [],
    definition: doc.definition ?? "",
    problemStatement: doc.problemStatement ?? "",
    useCases: doc.useCases ?? "",
    whenToUse: doc.whenToUse ?? [],
    coreConcepts: (doc.coreConcepts ?? []).map((c) => ({
      title: c.title ?? "",
      description: c.description ?? ""
    })),
    solution: doc.solution ?? "",
    advantages: doc.advantages ?? [],
    disadvantages: doc.disadvantages ?? [],
    interviewQuestions: doc.interviewQuestions ?? [],
    exampleCode: doc.exampleCode ?? "",
    relatedPatterns: (doc.relatedPatterns ?? []).map((p) => String(p)),
    umlImage: doc.umlImage ?? "",
    notes: doc.notes ?? "",
    views: doc.views ?? 0,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}
