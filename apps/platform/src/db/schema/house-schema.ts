import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const houses = pgTable("houses", {
  name: text("name").primaryKey(),
  description: text("description"),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  text: text("text").notNull(),
  house: text("house")
    .references(() => houses.name)
    .notNull(),
  score: integer("score").notNull(),
});
