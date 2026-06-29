import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface DiagramDocument extends mongoose.Document {
  title: string;
  description: string;
  tags: string[];
  folder: string;
  nodes: unknown[];
  edges: unknown[];
  thumbnail: string;
  linkedQuestions: mongoose.Types.ObjectId[];
  linkedPatterns: mongoose.Types.ObjectId[];
  linkedDesignPatterns: mongoose.Types.ObjectId[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const DiagramSchema = new Schema<DiagramDocument>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    folder: { type: String, default: "", trim: true },
    // React Flow nodes/edges stored as free-form documents.
    nodes: { type: [Schema.Types.Mixed], default: [] },
    edges: { type: [Schema.Types.Mixed], default: [] },
    thumbnail: { type: String, default: "" },
    linkedQuestions: {
      type: [{ type: Schema.Types.ObjectId, ref: "Question" }],
      default: []
    },
    linkedPatterns: {
      type: [{ type: Schema.Types.ObjectId, ref: "Pattern" }],
      default: []
    },
    linkedDesignPatterns: {
      type: [{ type: Schema.Types.ObjectId, ref: "DesignPattern" }],
      default: []
    },
    createdBy: { type: String, required: true, index: true }
  },
  { timestamps: true, minimize: false }
);

export const Diagram: Model<DiagramDocument> =
  (models.Diagram as Model<DiagramDocument>) ||
  model<DiagramDocument>("Diagram", DiagramSchema);
