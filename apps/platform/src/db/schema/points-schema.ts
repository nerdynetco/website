import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";
import { houses } from "./house-schema";

// Individual point transactions
export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  house: text("house")
    .notNull()
    .references(() => houses.name),
  points: integer("points").notNull(), // Can be positive or negative
  reason: text("reason").notNull(), // e.g., "progress_log", "post_created", "helpful_comment"
  description: text("description"), // Optional details
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Weekly house standings (aggregated)
export const weeklyHouseStandings = pgTable("weekly_house_standings", {
  id: serial("id").primaryKey(),
  house: text("house")
    .notNull()
    .references(() => houses.name),
  weekStart: timestamp("week_start").notNull(), // Monday of the week
  weekEnd: timestamp("week_end").notNull(), // Sunday of the week
  totalPoints: integer("total_points").notNull().default(0),
  postCount: integer("post_count").notNull().default(0),
  progressCount: integer("progress_count").notNull().default(0),
  memberCount: integer("member_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Point values for different activities
export const POINT_VALUES = {
  PROGRESS_LOG: 5,
  POST_CREATED: 10,
  COMMENT_CREATED: 2,
  POST_LIKED: 1,
  COMMENT_LIKED: 1,
  HELPFUL_COMMENT: 5, // When comment gets multiple likes
  STREAK_7: 20,
  STREAK_30: 50,
  STREAK_100: 150,
  BADGE_EARNED: 10,
} as const;

export type PointReason = keyof typeof POINT_VALUES;
