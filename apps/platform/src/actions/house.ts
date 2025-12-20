"use server";

import { db } from "~/db/connect";
import { users } from "~/db/schema/auth-schema";
import { houses } from "~/db/schema/house-schema";
import { eq, sql, and } from "drizzle-orm";
import dbConnect from "~/lib/dbConnect";
import CommunityPost from "~/models/community";
import ProgressLog from "~/models/progress";

export type HouseName = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

/**
 * Get house details with stats
 */
export async function getHouseDetails(houseName: string) {
  try {
    // Get house info from PostgreSQL
    const houseData = await db
      .select()
      .from(houses)
      .where(eq(houses.name, houseName))
      .limit(1);

    if (!houseData || houseData.length === 0) {
      throw new Error("House not found");
    }

    const house = houseData[0];

    // Get member count
    const memberCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.house, houseName));

    const memberCount = Number(memberCountResult[0]?.count || 0);

    // Get MongoDB stats
    await dbConnect();

    // Get post count (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyPosts = await CommunityPost.countDocuments({
      house: houseName,
      createdAt: { $gte: oneWeekAgo },
    });

    // Get progress log count (last 7 days)
    const weeklyProgress = await ProgressLog.countDocuments({
      "author.house": houseName,
      date: { $gte: oneWeekAgo },
    });

    // Get total posts
    const totalPosts = await CommunityPost.countDocuments({
      house: houseName,
    });

    return {
      name: house.name,
      description: house.description,
      memberCount,
      weeklyPosts,
      weeklyProgress,
      totalPosts,
    };
  } catch (error) {
    console.error("Failed to get house details:", error);
    throw new Error("Failed to fetch house details");
  }
}

/**
 * Get all houses with basic info
 */
export async function getAllHouses() {
  try {
    const allHouses = await db.select().from(houses);

    const housesWithStats = await Promise.all(
      allHouses.map(async (house) => {
        const memberCountResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(users)
          .where(eq(users.house, house.name));

        return {
          ...house,
          memberCount: Number(memberCountResult[0]?.count || 0),
        };
      })
    );

    return housesWithStats;
  } catch (error) {
    console.error("Failed to get all houses:", error);
    throw new Error("Failed to fetch houses");
  }
}

/**
 * Get house members
 */
export async function getHouseMembers(houseName: string, limit: number = 20) {
  try {
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
        house: users.house,
      })
      .from(users)
      .where(eq(users.house, houseName))
      .limit(limit);

    return members;
  } catch (error) {
    console.error("Failed to get house members:", error);
    throw new Error("Failed to fetch house members");
  }
}

/**
 * Get house leaderboard (by progress logs)
 */
export async function getHouseLeaderboard(houseName: string, limit: number = 10) {
  try {
    await dbConnect();

    // Aggregate progress logs by user
    const leaderboard = await ProgressLog.aggregate([
      {
        $match: {
          "author.house": houseName,
        },
      },
      {
        $group: {
          _id: "$userId",
          name: { $first: "$author.name" },
          username: { $first: "$author.username" },
          totalLogs: { $sum: 1 },
          totalIntensity: { $sum: "$intensity" },
        },
      },
      {
        $sort: { totalIntensity: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    return leaderboard.map((entry) => ({
      userId: entry._id,
      name: entry.name,
      username: entry.username,
      totalLogs: entry.totalLogs,
      totalIntensity: entry.totalIntensity,
    }));
  } catch (error) {
    console.error("Failed to get house leaderboard:", error);
    throw new Error("Failed to fetch house leaderboard");
  }
}
