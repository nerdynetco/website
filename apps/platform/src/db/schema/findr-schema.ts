import { InferSelectModel } from "drizzle-orm";
import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./auth-schema";

/* =========================================================
   ENUMS
========================================================= */

export const findrRoleEnum = pgEnum("findr_role_enum", [
    "technical",
    "non-technical",
    "hybrid",
]);

export const commitmentEnum = pgEnum("commitment_enum", [
    "full-time",
    "part-time",
    "weekends",
    "flexible",
]);

export const swipeActionEnum = pgEnum("swipe_action_enum", [
    "like",
    "pass",
    "super_like",
]);

export const matchStatusEnum = pgEnum("match_status_enum", [
    "active",
    "unmatched",
]);

/* =========================================================
   FINDR PROFILES
   - Extended profile for co-founder matching
========================================================= */

export const findrProfiles = pgTable("findr_profiles", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => nanoid()),

    userId: text("user_id")
        .notNull()
        .references(() => users.id)
        .unique(),

    bio: text("bio"), // Max 280 chars (validated in app)

    role: findrRoleEnum("role").notNull().default("technical"),

    skills: jsonb("skills").$type<string[]>().default([]),
    lookingFor: jsonb("looking_for").$type<string[]>().default([]),

    projectIdeas: jsonb("project_ideas").$type<string[]>().default([]),
    interests: jsonb("interests").$type<string[]>().default([]),
    commitment: commitmentEnum("commitment").default("flexible"),

    // GitHub stats (cached, refreshed periodically)
    githubUsername: text("github_username"),
    githubCommits: integer("github_commits").default(0),
    githubPRs: integer("github_prs").default(0),
    githubLanguages: jsonb("github_languages").$type<string[]>().default([]),
    githubScore: integer("github_score").default(0),
    githubUpdatedAt: timestamp("github_updated_at"),

    // Avatar seed for deterministic generation (DiceBear)
    avatarSeed: text("avatar_seed").$defaultFn(() => nanoid()),

    isActive: boolean("is_active").default(true),
    lastActive: timestamp("last_active").defaultNow(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type FindrProfileType = InferSelectModel<typeof findrProfiles>;

/* =========================================================
   FINDR SWIPES
   - Track all swipe actions between users
========================================================= */

export const findrSwipes = pgTable(
    "findr_swipes",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => nanoid()),

        swiperId: text("swiper_id")
            .notNull()
            .references(() => users.id),

        targetId: text("target_id")
            .notNull()
            .references(() => users.id),

        action: swipeActionEnum("action").notNull(),

        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        // Ensure one swipe per user pair
        uniqueIndex("unique_swipe").on(table.swiperId, table.targetId),
    ]
);

export type FindrSwipeType = InferSelectModel<typeof findrSwipes>;

/* =========================================================
   FINDR MATCHES
   - Created when both users like each other
========================================================= */

export const findrMatches = pgTable("findr_matches", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => nanoid()),

    // Store user IDs in consistent order (alphabetically sorted)
    user1Id: text("user1_id")
        .notNull()
        .references(() => users.id),

    user2Id: text("user2_id")
        .notNull()
        .references(() => users.id),

    status: matchStatusEnum("status").notNull().default("active"),

    unmatchedBy: text("unmatched_by").references(() => users.id),

    matchedAt: timestamp("matched_at").notNull().defaultNow(),
    lastInteraction: timestamp("last_interaction").defaultNow(),
});

export type FindrMatchType = InferSelectModel<typeof findrMatches>;
