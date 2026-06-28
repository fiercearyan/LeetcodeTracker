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
  approach: z.string().default(""),
  // Pattern ObjectId references (24-char hex).
  patterns: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid pattern id"))
    .default([])
});

export type QuestionSchemaInput = z.infer<typeof questionSchema>;

/**
 * For updates we allow a partial payload but keep the same field-level rules.
 */
export const questionUpdateSchema = questionSchema.partial();

/* ----------------------------- Patterns ----------------------------- */

export const patternSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Pattern name is required")
    .max(120, "Pattern name is too long"),
  description: z
    .string()
    .trim()
    .max(280, "Description is too long")
    .default(""),
  tags: z.array(z.string().trim().min(1)).default([]),
  triggerKeywords: z.array(z.string().trim().min(1)).default([]),
  notes: z.string().default(""),
  template: z.string().default(""),
  mentalChecklist: z.array(z.string().trim().min(1)).default([]),
  complexities: z
    .array(
      z.object({
        operation: z.string().trim().default(""),
        complexity: z.string().trim().default("")
      })
    )
    .default([])
});

export type PatternSchemaInput = z.infer<typeof patternSchema>;

export const patternUpdateSchema = patternSchema.partial();
