import mongoose, { Schema, model, models, type Model } from "mongoose";
import { DESIGN_PATTERN_TYPES } from "@/types/designPattern";

export interface DesignPatternDocument extends mongoose.Document {
  name: string;
  type: "Creational" | "Structural" | "Behavioral";
  description: string;
  triggerWords: string[];
  definition: string;
  problemStatement: string;
  useCases: string;
  whenToUse: string[];
  coreConcepts: { title: string; description: string }[];
  solution: string;
  advantages: string[];
  disadvantages: string[];
  interviewQuestions: string[];
  exampleCode: string;
  relatedPatterns: mongoose.Types.ObjectId[];
  umlImage: string;
  notes: string;
  views: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const DesignPatternSchema = new Schema<DesignPatternDocument>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    type: {
      type: String,
      enum: DESIGN_PATTERN_TYPES,
      required: [true, "Type is required"]
    },
    description: { type: String, default: "", trim: true },
    triggerWords: { type: [String], default: [] },
    definition: { type: String, default: "" },
    problemStatement: { type: String, default: "" },
    useCases: { type: String, default: "" },
    whenToUse: { type: [String], default: [] },
    coreConcepts: {
      type: [
        {
          _id: false,
          title: { type: String, default: "" },
          description: { type: String, default: "" }
        }
      ],
      default: []
    },
    solution: { type: String, default: "" },
    advantages: { type: [String], default: [] },
    disadvantages: { type: [String], default: [] },
    interviewQuestions: { type: [String], default: [] },
    exampleCode: { type: String, default: "" },
    relatedPatterns: {
      type: [{ type: Schema.Types.ObjectId, ref: "DesignPattern" }],
      default: []
    },
    // Stored as a base64 data URL (self-contained, no external storage needed).
    umlImage: { type: String, default: "" },
    notes: { type: String, default: "" },
    views: { type: Number, default: 0 },
    createdBy: { type: String, required: true, index: true }
  },
  { timestamps: true }
);

DesignPatternSchema.index({ createdBy: 1, name: 1 }, { unique: true });

export const DesignPattern: Model<DesignPatternDocument> =
  (models.DesignPattern as Model<DesignPatternDocument>) ||
  model<DesignPatternDocument>("DesignPattern", DesignPatternSchema);
