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

/* ------------------------- Design Patterns ------------------------- */

export const designPatternSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name too long"),
  type: z.enum(["Creational", "Structural", "Behavioral"]),
  description: z.string().trim().max(400, "Description too long").default(""),
  triggerWords: z.array(z.string().trim().min(1)).default([]),
  definition: z.string().default(""),
  problemStatement: z.string().default(""),
  useCases: z.string().default(""),
  whenToUse: z.array(z.string().trim().min(1)).default([]),
  coreConcepts: z
    .array(
      z.object({
        title: z.string().trim().default(""),
        description: z.string().trim().default("")
      })
    )
    .default([]),
  solution: z.string().default(""),
  advantages: z.array(z.string().trim().min(1)).default([]),
  disadvantages: z.array(z.string().trim().min(1)).default([]),
  interviewQuestions: z.array(z.string().trim().min(1)).default([]),
  exampleCode: z.string().default(""),
  relatedPatterns: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid pattern id"))
    .default([]),
  // base64 data URL or empty
  umlImage: z.string().default(""),
  notes: z.string().default("")
});

export type DesignPatternSchemaInput = z.infer<typeof designPatternSchema>;

export const designPatternUpdateSchema = designPatternSchema.partial();
