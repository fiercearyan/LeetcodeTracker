import type { QuestionDocument } from "@/models/Question";
import type { Question } from "@/types/question";
import type { PatternDocument } from "@/models/Pattern";
import type { Pattern } from "@/types/pattern";

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
    notes: doc.notes ?? "",
    views: doc.views ?? 0,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}
