"use server";

import { db } from "~/db/connect";
import { pointTransactions, weeklyHouseStandings, POINT_VALUES } from "~/db/schema/points-schema";
import { users } from "~/db/schema/auth-schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Award points to a user for an activity
 */
export async function awardPoints(
  userId: string,
  house: string,
  reason: keyof typeof POINT_VALUES,
  description?: string
) {
  try {
    const points = POINT_VALUES[reason];

    // Create point transaction
    await db.insert(pointTransactions).values({
      userId,
      house,
      points,
      reason,
      description,
    });

    // Update weekly standings
    await updateWeeklyStandings(house);

    return { success: true, points };
  } catch (error) {
    console.error("Failed to award points:", error);
    return { success: false, points: 0 };
  }
}

/**
 * Get current week boundaries (Monday to Sunday)
 */
function getCurrentWeekBoundaries() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

/**
 * Update weekly house standings
 */
async function updateWeeklyStandings(house: string) {
  const { weekStart, weekEnd } = getCurrentWeekBoundaries();

  // Calculate total points for the week
  const weeklyPoints = await db
    .select({
      totalPoints: sql<number>`COALESCE(SUM(${pointTransactions.points}), 0)`,
    })
    .from(pointTransactions)
    .where(
      and(
        eq(pointTransactions.house, house),
        gte(pointTransactions.createdAt, weekStart),
        lte(pointTransactions.createdAt, weekEnd)
      )
    );

  const totalPoints = Number(weeklyPoints[0]?.totalPoints || 0);

  // Count members
  const memberCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.house, house));

  // Check if standing exists
  const existing = await db
    .select()
    .from(weeklyHouseStandings)
    .where(
      and(
        eq(weeklyHouseStandings.house, house),
        eq(weeklyHouseStandings.weekStart, weekStart)
      )
    )
    .limit(1);

  if (existing && existing.length > 0) {
    // Update existing
    await db
      .update(weeklyHouseStandings)
      .set({
        totalPoints,
        memberCount: Number(memberCount[0]?.count || 0),
        updatedAt: new Date(),
      })
      .where(eq(weeklyHouseStandings.id, existing[0].id));
  } else {
    // Create new
    await db.insert(weeklyHouseStandings).values({
      house,
      weekStart,
      weekEnd,
      totalPoints,
      memberCount: Number(memberCount[0]?.count || 0),
    });
  }
}

/**
 * Get weekly house leaderboard
 */
export async function getWeeklyHouseLeaderboard() {
  try {
    const { weekStart } = getCurrentWeekBoundaries();

    const standings = await db
      .select()
      .from(weeklyHouseStandings)
      .where(eq(weeklyHouseStandings.weekStart, weekStart))
      .orderBy(desc(weeklyHouseStandings.totalPoints));

    return standings.map((standing, index) => ({
      ...standing,
      rank: index + 1,
      pointsPerMember: standing.memberCount > 0 
        ? Math.round(standing.totalPoints / standing.memberCount) 
        : 0,
    }));
  } catch (error) {
    console.error("Failed to get weekly leaderboard:", error);
    return [];
  }
}

/**
 * Get all-time house standings
 */
export async function getAllTimeHouseStandings() {
  try {
    const standings = await db
      .select({
        house: pointTransactions.house,
        totalPoints: sql<number>`COALESCE(SUM(${pointTransactions.points}), 0)`,
      })
      .from(pointTransactions)
      .groupBy(pointTransactions.house)
      .orderBy(desc(sql`COALESCE(SUM(${pointTransactions.points}), 0)`));

    return standings.map((standing, index) => ({
      house: standing.house,
      totalPoints: Number(standing.totalPoints),
      rank: index + 1,
    }));
  } catch (error) {
    console.error("Failed to get all-time standings:", error);
    return [];
  }
}

/**
 * Get user's point history
 */
export async function getUserPointHistory(userId: string, limit: number = 20) {
  try {
    const history = await db
      .select()
      .from(pointTransactions)
      .where(eq(pointTransactions.userId, userId))
      .orderBy(desc(pointTransactions.createdAt))
      .limit(limit);

    return history;
  } catch (error) {
    console.error("Failed to get user point history:", error);
    return [];
  }
}

/**
 * Get user's total points
 */
export async function getUserTotalPoints(userId: string) {
  try {
    const result = await db
      .select({
        totalPoints: sql<number>`COALESCE(SUM(${pointTransactions.points}), 0)`,
      })
      .from(pointTransactions)
      .where(eq(pointTransactions.userId, userId));

    return Number(result[0]?.totalPoints || 0);
  } catch (error) {
    console.error("Failed to get user total points:", error);
    return 0;
  }
}

/**
 * Get house's top contributors this week
 */
export async function getHouseTopContributors(house: string, limit: number = 10) {
  try {
    const { weekStart, weekEnd } = getCurrentWeekBoundaries();

    const contributors = await db
      .select({
        userId: pointTransactions.userId,
        totalPoints: sql<number>`COALESCE(SUM(${pointTransactions.points}), 0)`,
        name: users.name,
        username: users.username,
        image: users.image,
      })
      .from(pointTransactions)
      .innerJoin(users, eq(pointTransactions.userId, users.id))
      .where(
        and(
          eq(pointTransactions.house, house),
          gte(pointTransactions.createdAt, weekStart),
          lte(pointTransactions.createdAt, weekEnd)
        )
      )
      .groupBy(pointTransactions.userId, users.name, users.username, users.image)
      .orderBy(desc(sql`COALESCE(SUM(${pointTransactions.points}), 0)`))
      .limit(limit);

    return contributors.map((contributor, index) => ({
      ...contributor,
      totalPoints: Number(contributor.totalPoints),
      rank: index + 1,
    }));
  } catch (error) {
    console.error("Failed to get house top contributors:", error);
    return [];
  }
}
