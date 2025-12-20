import { InferSelectModel, SQL } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { houses } from "./house-schema";

/* =========================================================
   ENUMS
========================================================= */

export const userGenderEnum = pgEnum("user_gender_enum", [
  "male",
  "female",
  "not_specified",
]);

/* =========================================================
   USERS
   - OAuth-safe
   - Profile completed via onboarding
========================================================= */

export const users = pgTable("users", {
  /* ---- Identity ---- */
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  email: text("email").unique(),
  name: text("name"),
  image: text("image"),

  emailVerified: boolean("emailVerified")
    .notNull()
    .default(false),

  /* ---- Profile / Domain ---- */
  username: text("username").unique(),
  displayUsername: text("displayUsername")
    .notNull()
    .default("not_specified"),

  role: text("role")
    .notNull()
    .default("user"),

  gender: userGenderEnum("gender")
    .notNull()
    .default("not_specified"),

  house: text("house")
    .references(() => houses.name)
    .default(null as unknown as SQL<string | null>),

  hasCompletedSorting: boolean("hasCompletedSorting")
    .notNull()
    .default(false),

  /* ---- Moderation ---- */
  banned: boolean("banned")
    .notNull()
    .default(false),

  banReason: text("ban_reason").default("not_specified"),
banExpires: timestamp("ban_expires").defaultNow()
    .default(null as unknown as SQL<Date | null>),
  /* ---- Timestamps ---- */
  createdAt: timestamp("createdAt")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow(),
});

export type UserType = InferSelectModel<typeof users>;

/* =========================================================
   SESSIONS
========================================================= */

export const sessions = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  token: text("token")
    .notNull()
    .unique(),

  userId: text("userId")
    .notNull()
    .references(() => users.id),

  expiresAt: timestamp("expiresAt").notNull(),

  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  impersonatedBy: text("impersonatedBy"),

  createdAt: timestamp("createdAt")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow(),
});

/* =========================================================
   ACCOUNTS (OAuth / Credentials)
========================================================= */

export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: text("userId")
    .notNull()
    .references(() => users.id),

  providerId: text("providerId").notNull(),
  accountId: text("accountId").notNull(),

  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  scope: text("scope"),

  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),

  password: text("password"), // only for credentials provider

  createdAt: timestamp("createdAt")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow(),
});

/* =========================================================
   VERIFICATIONS (magic links, reset tokens, etc.)
========================================================= */

export const verifications = pgTable("verifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  identifier: text("identifier").notNull(),
  value: text("value").notNull(),

  expiresAt: timestamp("expiresAt").notNull(),

  createdAt: timestamp("createdAt")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow(),
});

/* =========================================================
   EMAIL VERIFICATIONS (optional but useful)
========================================================= */

export const emailVerifications = pgTable("email_verifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: text("userId")
    .notNull()
    .references(() => users.id),

  email: text("email").notNull(),

  token: text("token")
    .notNull()
    .unique(),

  verified: boolean("verified")
    .notNull()
    .default(false),

  expiresAt: timestamp("expiresAt").notNull(),

  createdAt: timestamp("createdAt")
    .notNull()
    .defaultNow(),
});
