import mongoose, { Schema, model, models, type Model } from "mongoose";
import { DIFFICULTIES } from "@/types/question";

export interface QuestionDocument extends mongoose.Document {
  questionNumber: number;
  questionName: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  leetcodeUrl: string;
  approach: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<QuestionDocument>(
  {
    questionNumber: {
      type: Number,
      required: [true, "Question number is required"],
      min: [1, "Question number must be positive"]
    },
    questionName: {
      type: String,
      required: [true, "Question name is required"],
      trim: true
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      required: [true, "Difficulty is required"]
    },
    topics: {
      type: [String],
      default: []
    },
    leetcodeUrl: {
      type: String,
      required: [true, "LeetCode URL is required"],
      trim: true
    },
    approach: {
      type: String,
      default: ""
    },
    createdBy: {
      type: String,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// Enforce uniqueness of question numbers *per user* (not globally).
QuestionSchema.index({ createdBy: 1, questionNumber: 1 }, { unique: true });

export const Question: Model<QuestionDocument> =
  (models.Question as Model<QuestionDocument>) ||
  model<QuestionDocument>("Question", QuestionSchema);
