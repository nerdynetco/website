import mongoose, { Document, Schema } from "mongoose";
import * as z from "zod";

// Progress categories for build-in-public tracking
export const PROGRESS_CATEGORIES = [
  "Code",
  "Design",
  "Research",
  "Shipping",
  "Learning",
  "Planning",
] as const;

export type ProgressCategory = (typeof PROGRESS_CATEGORIES)[number];

// Zod schema for validation
export const rawProgressLogSchema = z.object({
  userId: z.string(),
  date: z.date(),
  category: z.enum(PROGRESS_CATEGORIES),
  intensity: z.number().min(1).max(4),
  note: z.string().max(500).optional(),
  projectId: z.string().optional(),
  autoShared: z.boolean().default(false),
});

export type RawProgressLogType = z.infer<typeof rawProgressLogSchema>;

export type ProgressLogTypeWithId = RawProgressLogType & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    username: string;
    house?: string;
  };
};

interface IProgressLog extends Document {
  userId: string;
  author: {
    id: string;
    name: string;
    username: string;
    house?: string;
  };
  date: Date;
  category: ProgressCategory;
  intensity: number; // 1-4 scale
  note?: string;
  projectId?: string;
  autoShared: boolean; // Whether this was auto-posted to community
  createdAt: Date;
  updatedAt: Date;
}

const progressLogSchema = new Schema<IProgressLog>(
  {
    userId: { type: String, required: true, index: true },
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      username: { type: String, required: true },
      house: { type: String },
    },
    date: { type: Date, required: true, index: true },
    category: {
      type: String,
      enum: PROGRESS_CATEGORIES,
      required: true,
    },
    intensity: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    note: {
      type: String,
      maxlength: 500,
    },
    projectId: {
      type: String,
    },
    autoShared: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
progressLogSchema.index({ userId: 1, date: -1 });
progressLogSchema.index({ date: -1 });

// Ensure one log per user per day per category
progressLogSchema.index(
  { userId: 1, date: 1, category: 1 },
  { unique: true }
);

export const ProgressLog =
  mongoose.models?.ProgressLog ||
  mongoose.model<IProgressLog>("ProgressLog", progressLogSchema);

export default ProgressLog;
