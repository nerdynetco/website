import { db } from "~/db/connect"; // adjust path to your drizzle instance
import { houses, questions, answers } from "~/db/schema"; // adjust path to your schema
import { quizQuestions, houseDescriptions } from "./quiz-data";
import type { House } from "./quiz-data";

/**
 * Seed Houses
 */
async function seedHouses() {
  const houseEntries = Object.entries(houseDescriptions).map(
    ([name, description]) => ({
      name: name as House,
      description,
    })
  );

  await db.insert(houses).values(houseEntries).onConflictDoNothing();
}

/**
 * Seed Questions + Answers
 */
async function seedQuestionsAndAnswers() {
  for (const q of quizQuestions) {
    // Insert question
    const [insertedQuestion] = await db
      .insert(questions)
      .values({
        text: q.question,
      })
      .returning({ id: questions.id });

    const questionId = insertedQuestion.id;

    // Insert answers/options
    const answerEntries = q.options.map((opt) => ({
      questionId,
      text: opt.text,
      house: opt.house,
      score: 1, // simple vote system
    }));

    await db.insert(answers).values(answerEntries);
  }
}

/**
 * Main Seed Runner
 */
export async function seedHogwartsQuiz() {
  console.log("🪄 Seeding Hogwarts Houses...");
  await seedHouses();

  console.log("📜 Seeding Questions & Answers...");
  await seedQuestionsAndAnswers();

  console.log("✅ Hogwarts Quiz Seed Complete");
}

// Run directly if executed as script
if (require.main === module) {
  seedHogwartsQuiz()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed", err);
      process.exit(1);
    });
}
