import { z } from "zod";
import { DIFFICULTIES } from "@/types/question";

export const questionSchema = z.object({
  questionNumber: z
    .number({ invalid_type_error: "Question number must be a number" })
    .int("Question number must be an integer")
    .positive("Question number must be positive"),
  questionName: z
    .string()
    .trim()
    .min(1, "Question name is required")
    .max(200, "Question name is too long"),
  difficulty: z.enum(DIFFICULTIES as [string, ...string[]]),
  topics: z.array(z.string().trim().min(1)).default([]),
  // Optional — may be empty (problems sourced from sites without a stable URL).
  leetcodeUrl: z
    .string()
    .trim()
    .default("")
    .refine((url) => url === "" || /^https?:\/\/.+/i.test(url), {
      message: "Enter a valid URL (http:// or https://) or leave it empty"
    }),
  approach: z.string().default("")
});

export type QuestionSchemaInput = z.infer<typeof questionSchema>;

/**
 * For updates we allow a partial payload but keep the same field-level rules.
 */
export const questionUpdateSchema = questionSchema.partial();
