import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface PatternDocument extends mongoose.Document {
  name: string;
  description: string;
  tags: string[];
  notes: string;
  views: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatternSchema = new Schema<PatternDocument>(
  {
    name: {
      type: String,
      required: [true, "Pattern name is required"],
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      default: ""
    },
    // Supports the "Most Viewed" sort and a future "Used in X" style badge.
    views: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: String,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// A user shouldn't have two patterns with the same name (case-insensitive
// uniqueness is enforced at the app layer; this index covers exact matches).
PatternSchema.index({ createdBy: 1, name: 1 }, { unique: true });

export const Pattern: Model<PatternDocument> =
  (models.Pattern as Model<PatternDocument>) ||
  model<PatternDocument>("Pattern", PatternSchema);
