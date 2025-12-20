import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const reportStatusEnum = pgEnum("report_status", ["pending", "reviewing", "resolved", "dismissed"]);
export const reportTypeEnum = pgEnum("report_type", ["spam", "harassment", "inappropriate", "misinformation", "other"]);
export const contentTypeEnum = pgEnum("content_type", ["post", "comment", "user"]);

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentType: contentTypeEnum("content_type").notNull(),
  contentId: text("content_id").notNull(), // MongoDB ID for post/comment
  reporterId: text("reporter_id").notNull().references(() => users.id),
  reportType: reportTypeEnum("report_type").notNull(),
  reason: text("reason"),
  status: reportStatusEnum("status").notNull().default("pending"),
  reviewedBy: text("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const moderationActions = pgTable("moderation_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").references(() => reports.id),
  moderatorId: text("moderator_id").notNull().references(() => users.id),
  action: text("action").notNull(), // "removed", "warned", "banned", "dismissed"
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
