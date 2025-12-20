"use server";

import { db } from "~/db/connect";
import { badgeTypes, userBadges, BADGE_DEFINITIONS } from "~/db/schema/badge-schema";
import { eq, and } from "drizzle-orm";

/**
 * Initialize badge types in database (run once)
 */
export async function initializeBadgeTypes() {
  try {
    const existingBadges = await db.select().from(badgeTypes);

    if (existingBadges.length === 0) {
      // Insert all badge definitions
      const badgeValues = Object.values(BADGE_DEFINITIONS);
      await db.insert(badgeTypes).values(badgeValues);
      return { success: true, message: "Badge types initialized" };
    }

    return { success: true, message: "Badge types already exist" };
  } catch (error) {
    console.error("Failed to initialize badge types:", error);
    return { success: false, message: "Failed to initialize badge types" };
  }
}

/**
 * Award a badge to a user
 */
export async function awardBadge(userId: string, badgeName: string) {
  try {
    // Get badge type
    const badges = await db
      .select()
      .from(badgeTypes)
      .where(eq(badgeTypes.name, badgeName))
      .limit(1);
    console.log("Badges found:", badges);

      return { success: false, message: "Badge type not found",badge: null};
    // if (!badges || badges.length === 0) {
    //   throw new Error("Badge type not found");
    // }

    const badgeId = badges[0].id;

    // Check if user already has this badge
    const existing = await db
      .select()
      .from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeId, badgeId)
        )
      )
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, message: "Badge already awarded" };
    }

    // Award the badge
    await db.insert(userBadges).values({
      userId,
      badgeId,
    });

    return {
      success: true,
      message: `Badge "${badges[0].title}" awarded!`,
      badge: badges[0],
    };
  } catch (error) {
    console.error("Failed to award badge:", error);
    return { success: false, message: "Failed to award badge",badge: null};
  }
}

/**
 * Get user's badges
 */
export async function getUserBadges(userId: string) {
  try {
    const badges = await db
      .select({
        id: userBadges.id,
        badgeId: userBadges.badgeId,
        awardedAt: userBadges.awardedAt,
        name: badgeTypes.name,
        title: badgeTypes.title,
        description: badgeTypes.description,
        icon: badgeTypes.icon,
        category: badgeTypes.category,
      })
      .from(userBadges)
      .innerJoin(badgeTypes, eq(userBadges.badgeId, badgeTypes.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(userBadges.awardedAt);

    return badges;
  } catch (error) {
    console.error("Failed to get user badges:", error);
    return [];
  }
}

/**
 * Check and award streak badges based on current streak
 */
export async function checkAndAwardStreakBadges(userId: string, currentStreak: number) {
  const badgesToAward: string[] = [];

  if (currentStreak >= 100) {
    badgesToAward.push(BADGE_DEFINITIONS.STREAK_100.name);
  }
  if (currentStreak >= 30) {
    badgesToAward.push(BADGE_DEFINITIONS.STREAK_30.name);
  }
  if (currentStreak >= 7) {
    badgesToAward.push(BADGE_DEFINITIONS.STREAK_7.name);
  }

  const results = [];
  for (const badgeName of badgesToAward) {
    const result = await awardBadge(userId, badgeName);
    if (result?.success && result?.badge) {
      results.push(result.badge);
    }
  }

  return results;
}

/**
 * Check and award log count badges
 */
export async function checkAndAwardLogBadges(userId: string, totalLogs: number) {
  const badgesToAward: string[] = [];

  if (totalLogs >= 100) {
    badgesToAward.push(BADGE_DEFINITIONS.LOGS_100.name);
  }
  if (totalLogs >= 50) {
    badgesToAward.push(BADGE_DEFINITIONS.LOGS_50.name);
  }
  if (totalLogs >= 1) {
    badgesToAward.push(BADGE_DEFINITIONS.FIRST_LOG.name);
  }

  const results = [];
  for (const badgeName of badgesToAward) {
    const result = await awardBadge(userId, badgeName);
    if (result?.success && result?.badge) {
      results.push(result.badge);
    }
  }

  return results;
}

/**
 * Get badge progress for a user
 */
export async function getBadgeProgress(userId: string, currentStreak: number, totalLogs: number) {
  const userBadgesList = await getUserBadges(userId);
  const earnedBadgeNames = new Set(userBadgesList.map(b => b.name));

  const progress = [
    {
      badge: BADGE_DEFINITIONS.STREAK_7,
      earned: earnedBadgeNames.has(BADGE_DEFINITIONS.STREAK_7.name),
      progress: Math.min(currentStreak, 7),
      total: 7,
    },
    {
      badge: BADGE_DEFINITIONS.STREAK_30,
      earned: earnedBadgeNames.has(BADGE_DEFINITIONS.STREAK_30.name),
      progress: Math.min(currentStreak, 30),
      total: 30,
    },
    {
      badge: BADGE_DEFINITIONS.STREAK_100,
      earned: earnedBadgeNames.has(BADGE_DEFINITIONS.STREAK_100.name),
      progress: Math.min(currentStreak, 100),
      total: 100,
    },
    {
      badge: BADGE_DEFINITIONS.LOGS_50,
      earned: earnedBadgeNames.has(BADGE_DEFINITIONS.LOGS_50.name),
      progress: Math.min(totalLogs, 50),
      total: 50,
    },
    {
      badge: BADGE_DEFINITIONS.LOGS_100,
      earned: earnedBadgeNames.has(BADGE_DEFINITIONS.LOGS_100.name),
      progress: Math.min(totalLogs, 100),
      total: 100,
    },
  ];

  return progress;
}
