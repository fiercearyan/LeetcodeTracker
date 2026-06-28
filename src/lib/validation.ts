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
  leetcodeUrl: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .refine((url) => /^https?:\/\//i.test(url), {
      message: "URL must start with http:// or https://"
    }),
  approach: z.string().default("")
});

export type QuestionSchemaInput = z.infer<typeof questionSchema>;

/**
 * For updates we allow a partial payload but keep the same field-level rules.
 */
export const questionUpdateSchema = questionSchema.partial();
