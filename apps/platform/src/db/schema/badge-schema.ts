import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const badgeTypes = pgTable("badge_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., "7_day_streak", "30_day_streak"
  title: text("title").notNull(), // e.g., "Week Warrior"
  description: text("description").notNull(),
  icon: text("icon").notNull(), // emoji or icon name
  category: text("category").notNull(), // "streak", "contribution", "achievement"
  requirement: integer("requirement"), // numeric requirement (e.g., 7 for 7-day streak)
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  badgeId: integer("badge_id")
    .notNull()
    .references(() => badgeTypes.id),
  awardedAt: timestamp("awarded_at").notNull().defaultNow(),
});

// Badge type definitions
export const BADGE_DEFINITIONS = {
  STREAK_7: {
    name: "7_day_streak",
    title: "Week Warrior",
    description: "Logged progress for 7 consecutive days",
    icon: "🔥",
    category: "streak",
    requirement: 7,
  },
  STREAK_30: {
    name: "30_day_streak",
    title: "Monthly Master",
    description: "Logged progress for 30 consecutive days",
    icon: "⚡",
    category: "streak",
    requirement: 30,
  },
  STREAK_100: {
    name: "100_day_streak",
    title: "Century Champion",
    description: "Logged progress for 100 consecutive days",
    icon: "👑",
    category: "streak",
    requirement: 100,
  },
  FIRST_LOG: {
    name: "first_log",
    title: "First Steps",
    description: "Logged your first progress",
    icon: "🌱",
    category: "achievement",
    requirement: 1,
  },
  LOGS_50: {
    name: "50_logs",
    title: "Consistent Builder",
    description: "Created 50 progress logs",
    icon: "🎯",
    category: "achievement",
    requirement: 50,
  },
  LOGS_100: {
    name: "100_logs",
    title: "Dedicated Builder",
    description: "Created 100 progress logs",
    icon: "💎",
    category: "achievement",
    requirement: 100,
  },
} as const;

export type BadgeDefinition = typeof BADGE_DEFINITIONS[keyof typeof BADGE_DEFINITIONS];
