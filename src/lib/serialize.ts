import type { QuestionDocument } from "@/models/Question";
import type { Question } from "@/types/question";

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
