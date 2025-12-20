"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { checkAndAwardStreakBadges, checkAndAwardLogBadges } from "./badges";
import { awardPoints } from "./points";
import { auth } from "~/auth";
import { db } from "~/db/connect";
import { users } from "~/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import dbConnect from "~/lib/dbConnect";
import ProgressLog, {
  rawProgressLogSchema,
  type RawProgressLogType,
  type ProgressLogTypeWithId,
  PROGRESS_CATEGORIES,
} from "~/models/progress";
import CommunityPost from "~/models/community";

/**
 * Create a new progress log entry
 */
export async function createProgressLog(
  logData: Omit<RawProgressLogType, "userId"> & { autoShare?: boolean }
) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to log progress");
  }

  // Get user details including house
  const user = await db
    .select({
      house: users.house,
      name: users.name,
      username: users.username,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user || user.length === 0) {
    throw new Error("User not found");
  }

  const userData = user[0];

  const shouldAutoShare = logData.autoShare ?? false;
  
  // Validate the log data
  const parsed = rawProgressLogSchema.safeParse({
    ...logData,
    userId: session.user.id,
    autoShared: false,
    autoShare: undefined, // Remove from validation
  });

  if (!parsed.success) {
    throw new Error("Invalid progress log data");
  }

  try {
    await dbConnect();

    // Create the progress log
    const progressLog = new ProgressLog({
      ...parsed.data,
      author: {
        id: session.user.id,
        name: userData.name,
        username: userData.username,
        house: userData.house || undefined,
      },
    });

    await progressLog.save();

    // Auto-share to community if requested
    if (
      shouldAutoShare &&
      userData.house &&
      userData.name &&
      userData.username
    ) {
      try {
        await autoShareProgressToFeed(progressLog, {
          house: userData.house,
          name: userData.name,
          username: userData.username,
        });
      } catch (error) {
        console.error("Failed to auto-share progress:", error);
        // Don't fail the whole operation if sharing fails
      }
    }

    // Check and award badges
    try {
      const totalLogs = await ProgressLog.countDocuments({ userId: session.user.id });
      const streakData = await calculateStreak(session.user.id);
      
      await checkAndAwardStreakBadges(session.user.id, streakData.currentStreak);
      await checkAndAwardLogBadges(session.user.id, totalLogs);
    } catch (error) {
      console.error("Failed to check/award badges:", error);
      // Don't fail the whole operation if badge awarding fails
    }

    // Award house points for progress log
    if (userData.house) {
      try {
        await awardPoints(
          session.user.id,
          userData.house,
          "PROGRESS_LOG",
          `Progress log: ${parsed.data.category}`
        );
      } catch (error) {
        console.error("Failed to award points:", error);
      }
    }

    revalidatePath("/progress");
    revalidatePath("/profile");
    revalidatePath("/community");

    return JSON.parse(JSON.stringify(progressLog)) as ProgressLogTypeWithId;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error(
        "You've already logged progress for this category today"
      );
    }
    throw new Error("Failed to create progress log");
  }
}

/**
 * Quick "I built today" - creates a simple progress log
 */
export async function quickBuildLog(category: string, intensity: number = 2) {
  if (!PROGRESS_CATEGORIES.includes(category as any)) {
    throw new Error("Invalid category");
  }

  return createProgressLog({
    date: new Date(),
    category: category as any,
    intensity,
    note: undefined,
    projectId: undefined,
    autoShared: true, // Quick logs are auto-shared by default
  });
}

/**
 * Get progress logs for a user
 */
export async function getUserProgressLogs(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<ProgressLogTypeWithId[]> {
  try {
    await dbConnect();

    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const logs = await ProgressLog.find(query).sort({ date: -1 }).lean();

    return JSON.parse(JSON.stringify(logs)) as ProgressLogTypeWithId[];
  } catch (error) {
    throw new Error("Failed to fetch progress logs");
  }
}

/**
 * Get progress logs for the last 365 days (for heatmap)
 */
export async function getYearProgressLogs(
  userId: string
): Promise<ProgressLogTypeWithId[]> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return getUserProgressLogs(userId, oneYearAgo);
}

/**
 * Calculate streak for a user
 */
export async function calculateStreak(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastLogDate: Date | null;
}> {
  try {
    await dbConnect();

    const logs = await ProgressLog.find({ userId })
      .sort({ date: -1 })
      .select("date")
      .lean();

    if (logs.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastLogDate: null };
    }

    // Get unique dates (since multiple logs can be on same day)
    const uniqueDates = Array.from(
      new Set(
        logs.map((log) => new Date(log.date).toISOString().split("T")[0])
      )
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    // Check if current streak is active
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;

      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const diffDays = Math.floor(
          (prevDate.getTime() - currDate.getTime()) / 86400000
        );

        if (diffDays === 1) {
          currentStreak++;
          tempStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / 86400000
      );

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      currentStreak,
      longestStreak,
      lastLogDate: logs[0].date,
    };
  } catch (error) {
    throw new Error("Failed to calculate streak");
  }
}

/**
 * Internal helper to auto-share progress when creating a log
 */
async function autoShareProgressToFeed(
  progressLog: any,
  userData: { house: string | null; name: string; username: string }
) {
  if (!userData.house) {
    return; // Can't share without a house
  }

  await dbConnect();

  // Create community post
  const postContent = progressLog.note
    ? `🚀 **${progressLog.category}** progress today!\n\n${progressLog.note}\n\n*Intensity: ${"⭐".repeat(progressLog.intensity)}*`
    : `🚀 Made progress on **${progressLog.category}** today! ${"⭐".repeat(progressLog.intensity)}`;

  const communityPost = new CommunityPost({
    title: `${userData.name} built today!`,
    content: postContent,
    category: "General",
    author: {
      id: progressLog.userId,
      name: userData.name,
      username: userData.username,
    },
    house: userData.house,
    views: 0,
    likes: [],
    savedBy: [],
  });

  await communityPost.save();

  // Mark progress as shared
  progressLog.autoShared = true;
  await progressLog.save();
}

/**
 * Manually share progress to house feed (for existing logs)
 */
export async function shareProgressToFeed(progressLogId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in");
  }

  try {
    await dbConnect();

    const progressLog = await ProgressLog.findById(progressLogId);

    if (!progressLog) {
      throw new Error("Progress log not found");
    }

    if (progressLog.userId !== session.user.id) {
      throw new Error("Unauthorized");
    }

    if (progressLog.autoShared) {
      throw new Error("Progress already shared");
    }

    // Get user details
    const user = await db
      .select({ house: users.house })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || user.length === 0 || !user[0].house) {
      throw new Error("User not found or house not assigned");
    }

    // Create community post
    const postContent = progressLog.note
      ? `🚀 **${progressLog.category}** progress today!\n\n${progressLog.note}\n\n*Intensity: ${"⭐".repeat(progressLog.intensity)}*`
      : `🚀 Made progress on **${progressLog.category}** today! ${"⭐".repeat(progressLog.intensity)}`;

    const communityPost = new CommunityPost({
      title: `${progressLog.author.name} built today!`,
      content: postContent,
      category: "General",
      author: {
        id: progressLog.author.id,
        name: progressLog.author.name,
        username: progressLog.author.username,
      },
      house: user[0].house,
      views: 0,
      likes: [],
      savedBy: [],
    });

    await communityPost.save();

    // Mark progress as shared
    progressLog.autoShared = true;
    await progressLog.save();

    revalidatePath("/community");
    revalidatePath("/progress");

    return JSON.parse(JSON.stringify(communityPost));
  } catch (error: any) {
    throw new Error(error.message || "Failed to share progress");
  }
}

/**
 * Delete a progress log
 */
export async function deleteProgressLog(logId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in");
  }

  try {
    await dbConnect();

    const log = await ProgressLog.findById(logId);

    if (!log) {
      throw new Error("Progress log not found");
    }

    if (log.userId !== session.user.id) {
      throw new Error("Unauthorized");
    }

    await ProgressLog.findByIdAndDelete(logId);

    revalidatePath("/progress");
    revalidatePath("/profile");

    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete progress log");
  }
}
