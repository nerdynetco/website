"use server";

import { db } from "~/db/connect";
import { answers, questions, houses } from "~/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "~/auth/server";
import { users } from "~/db/schema/auth-schema";

export async function getSortingQuestions() {
  const allQuestions = await db.select().from(questions);
  const allAnswers = await db.select().from(answers);

  const questionsWithAnswers = allQuestions.map((q) => ({
    ...q,
    options: allAnswers.filter((a) => a.questionId === q.id),
  }));

  return questionsWithAnswers;
}

export async function submitSortingAnswers(
  selectedAnswers: { questionId: number; answerId: number }[]
) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("User not authenticated.");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user || user.length === 0) {
    throw new Error("User not found.");
  }

  if (user[0].hasCompletedSorting) {
    throw new Error("Sorting already completed.");
  }

  const allAnswers = await db.select().from(answers);
  const houseScores: Record<string, number> = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };

  for (const selection of selectedAnswers) {
    const answer = allAnswers.find(
      (a) => a.questionId === selection.questionId && a.id === selection.answerId
    );

    if (answer) {
      houseScores[answer.house] += answer.score;
    }
  }

  let assignedHouse: string | null = null;
  let maxScore = -1;

  // Determine the house with the highest score
  for (const houseName in houseScores) {
    if (houseScores[houseName] > maxScore) {
      maxScore = houseScores[houseName];
      assignedHouse = houseName;
    } else if (houseScores[houseName] === maxScore) {
      // Tie-breaking logic: alphabetical order
      if (assignedHouse === null || houseName < assignedHouse) {
        assignedHouse = houseName;
      }
    }
  }

  if (!assignedHouse) {
    throw new Error("Could not assign a house.");
  }

  // Update user's house and hasCompletedSorting status
  await db
    .update(users)
    .set({
      house: assignedHouse,
      hasCompletedSorting: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  return { assignedHouse };
}
