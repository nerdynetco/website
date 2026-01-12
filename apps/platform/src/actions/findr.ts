"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { and, eq, or, ne, notInArray, sql, desc } from "drizzle-orm";
import { auth } from "~/auth";
import { db } from "~/db/connect";
import { users } from "~/db/schema/auth-schema";
import {
    findrProfiles,
    findrSwipes,
    findrMatches,
    type FindrProfileType,
    type FindrMatchType,
} from "~/db/schema/findr-schema";

/* =========================================================
   PROFILE ACTIONS
========================================================= */

export type CreateFindrProfileInput = {
    bio?: string;
    role: "technical" | "non-technical" | "hybrid";
    skills: string[];
    lookingFor: string[];
    projectIdeas?: string[];
    interests?: string[];
    commitment?: "full-time" | "part-time" | "weekends" | "flexible";
};

/**
 * Create or update the current user's Findr profile
 */
export async function createOrUpdateFindrProfile(data: CreateFindrProfileInput) {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        throw new Error("You need to be logged in to create a Findr profile");
    }

    const userId = session.user.id;

    // Check if profile exists
    const existingProfile = await db
        .select()
        .from(findrProfiles)
        .where(eq(findrProfiles.userId, userId))
        .limit(1);

    if (existingProfile.length > 0) {
        // Update existing profile
        const [updated] = await db
            .update(findrProfiles)
            .set({
                bio: data.bio,
                role: data.role,
                skills: data.skills,
                lookingFor: data.lookingFor,
                projectIdeas: data.projectIdeas || [],
                interests: data.interests || [],
                commitment: data.commitment || "flexible",
                updatedAt: new Date(),
            })
            .where(eq(findrProfiles.userId, userId))
            .returning();

        revalidatePath("/findr");
        revalidatePath("/findr/profile");
        return updated;
    }

    // Create new profile
    const [profile] = await db
        .insert(findrProfiles)
        .values({
            userId,
            bio: data.bio,
            role: data.role,
            skills: data.skills,
            lookingFor: data.lookingFor,
            projectIdeas: data.projectIdeas || [],
            interests: data.interests || [],
            commitment: data.commitment || "flexible",
        })
        .returning();

    revalidatePath("/findr");
    revalidatePath("/findr/profile");
    return profile;
}

/**
 * Get the current user's Findr profile
 */
export async function getMyFindrProfile(): Promise<FindrProfileType | null> {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        return null;
    }

    const [profile] = await db
        .select()
        .from(findrProfiles)
        .where(eq(findrProfiles.userId, session.user.id))
        .limit(1);

    return profile || null;
}

/**
 * Get a Findr profile by user ID (for viewing others)
 */
export async function getFindrProfile(userId: string): Promise<FindrProfileType | null> {
    const [profile] = await db
        .select()
        .from(findrProfiles)
        .where(eq(findrProfiles.userId, userId))
        .limit(1);

    return profile || null;
}

/* =========================================================
   DISCOVERY ACTIONS
========================================================= */

export type DiscoverFilters = {
    role?: "technical" | "non-technical" | "hybrid";
    skills?: string[];
    limit?: number;
};

export type DiscoverProfile = FindrProfileType & {
    user: {
        id: string;
        name: string | null;
        username: string | null;
        house: string | null;
        image: string | null;
    };
};

/**
 * Get profiles to swipe on (excluding already swiped and self)
 */
export async function getDiscoverProfiles(
    filters?: DiscoverFilters
): Promise<DiscoverProfile[]> {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        throw new Error("You need to be logged in to discover profiles");
    }

    const userId = session.user.id;
    const limit = filters?.limit || 10;

    // Get IDs of users we've already swiped on
    const swipedUsers = await db
        .select({ targetId: findrSwipes.targetId })
        .from(findrSwipes)
        .where(eq(findrSwipes.swiperId, userId));

    const swipedUserIds = swipedUsers.map((s) => s.targetId);

    // Build query
    let query = db
        .select({
            // Profile fields
            id: findrProfiles.id,
            userId: findrProfiles.userId,
            bio: findrProfiles.bio,
            role: findrProfiles.role,
            skills: findrProfiles.skills,
            lookingFor: findrProfiles.lookingFor,
            projectIdeas: findrProfiles.projectIdeas,
            interests: findrProfiles.interests,
            commitment: findrProfiles.commitment,
            githubUsername: findrProfiles.githubUsername,
            githubCommits: findrProfiles.githubCommits,
            githubPRs: findrProfiles.githubPRs,
            githubLanguages: findrProfiles.githubLanguages,
            githubScore: findrProfiles.githubScore,
            githubUpdatedAt: findrProfiles.githubUpdatedAt,
            avatarSeed: findrProfiles.avatarSeed,
            isActive: findrProfiles.isActive,
            lastActive: findrProfiles.lastActive,
            createdAt: findrProfiles.createdAt,
            updatedAt: findrProfiles.updatedAt,
            // User fields
            user: {
                id: users.id,
                name: users.name,
                username: users.username,
                house: users.house,
                image: users.image,
            },
        })
        .from(findrProfiles)
        .innerJoin(users, eq(findrProfiles.userId, users.id))
        .where(
            and(
                eq(findrProfiles.isActive, true),
                ne(findrProfiles.userId, userId),
                swipedUserIds.length > 0
                    ? notInArray(findrProfiles.userId, swipedUserIds)
                    : undefined,
                filters?.role ? eq(findrProfiles.role, filters.role) : undefined
            )
        )
        .orderBy(desc(findrProfiles.githubScore), desc(findrProfiles.lastActive))
        .limit(limit);

    const profiles = await query;
    return profiles as DiscoverProfile[];
}

/* =========================================================
   SWIPE ACTIONS
========================================================= */

export type SwipeResult = {
    success: boolean;
    isMatch: boolean;
    matchId?: string;
};

/**
 * Record a swipe action and check for match
 */
export async function swipe(
    targetUserId: string,
    action: "like" | "pass" | "super_like"
): Promise<SwipeResult> {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        throw new Error("You need to be logged in to swipe");
    }

    const userId = session.user.id;

    if (userId === targetUserId) {
        throw new Error("Cannot swipe on yourself");
    }

    // Record the swipe
    await db
        .insert(findrSwipes)
        .values({
            swiperId: userId,
            targetId: targetUserId,
            action,
        })
        .onConflictDoUpdate({
            target: [findrSwipes.swiperId, findrSwipes.targetId],
            set: { action, createdAt: new Date() },
        });

    // If it's a pass, no match check needed
    if (action === "pass") {
        return { success: true, isMatch: false };
    }

    // Check if target has already liked us
    const [reciprocalSwipe] = await db
        .select()
        .from(findrSwipes)
        .where(
            and(
                eq(findrSwipes.swiperId, targetUserId),
                eq(findrSwipes.targetId, userId),
                or(
                    eq(findrSwipes.action, "like"),
                    eq(findrSwipes.action, "super_like")
                )
            )
        )
        .limit(1);

    if (!reciprocalSwipe) {
        return { success: true, isMatch: false };
    }

    // It's a match! Create match record
    // Sort user IDs for consistency
    const [user1Id, user2Id] = [userId, targetUserId].sort();

    // Check if match already exists
    const [existingMatch] = await db
        .select()
        .from(findrMatches)
        .where(
            and(
                eq(findrMatches.user1Id, user1Id),
                eq(findrMatches.user2Id, user2Id)
            )
        )
        .limit(1);

    if (existingMatch) {
        return { success: true, isMatch: true, matchId: existingMatch.id };
    }

    // Create new match
    const [match] = await db
        .insert(findrMatches)
        .values({
            user1Id,
            user2Id,
        })
        .returning();

    revalidatePath("/findr");
    revalidatePath("/findr/matches");

    return { success: true, isMatch: true, matchId: match.id };
}

/* =========================================================
   MATCH ACTIONS  
========================================================= */

export type MatchWithUser = FindrMatchType & {
    matchedUser: {
        id: string;
        name: string | null;
        username: string | null;
        house: string | null;
        image: string | null;
    };
    matchedProfile: FindrProfileType | null;
};

/**
 * Get all matches for the current user
 */
export async function getMatches(): Promise<MatchWithUser[]> {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        throw new Error("You need to be logged in to view matches");
    }

    const userId = session.user.id;

    // Get matches where user is either user1 or user2
    const matches = await db
        .select()
        .from(findrMatches)
        .where(
            and(
                eq(findrMatches.status, "active"),
                or(
                    eq(findrMatches.user1Id, userId),
                    eq(findrMatches.user2Id, userId)
                )
            )
        )
        .orderBy(desc(findrMatches.matchedAt));

    // Fetch matched user details for each match
    const matchesWithUsers: MatchWithUser[] = await Promise.all(
        matches.map(async (match) => {
            const matchedUserId = match.user1Id === userId ? match.user2Id : match.user1Id;

            const [matchedUser] = await db
                .select({
                    id: users.id,
                    name: users.name,
                    username: users.username,
                    house: users.house,
                    image: users.image,
                })
                .from(users)
                .where(eq(users.id, matchedUserId))
                .limit(1);

            const matchedProfile = await getFindrProfile(matchedUserId);

            return {
                ...match,
                matchedUser,
                matchedProfile,
            };
        })
    );

    return matchesWithUsers;
}

/**
 * Unmatch with a user
 */
export async function unmatch(matchId: string): Promise<{ success: boolean }> {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        throw new Error("You need to be logged in to unmatch");
    }

    const userId = session.user.id;

    // Verify user is part of this match
    const [match] = await db
        .select()
        .from(findrMatches)
        .where(eq(findrMatches.id, matchId))
        .limit(1);

    if (!match) {
        throw new Error("Match not found");
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new Error("You are not part of this match");
    }

    // Update match status
    await db
        .update(findrMatches)
        .set({
            status: "unmatched",
            unmatchedBy: userId,
        })
        .where(eq(findrMatches.id, matchId));

    revalidatePath("/findr/matches");

    return { success: true };
}

/**
 * Update last active timestamp for current user's profile
 */
export async function updateLastActive(): Promise<void> {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) return;

    await db
        .update(findrProfiles)
        .set({ lastActive: new Date() })
        .where(eq(findrProfiles.userId, session.user.id));
}

/**
 * Toggle profile active status (pause/unpause matching)
 */
export async function toggleProfileActive(isActive: boolean): Promise<FindrProfileType> {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session) {
        throw new Error("You need to be logged in");
    }

    const [profile] = await db
        .update(findrProfiles)
        .set({ isActive, updatedAt: new Date() })
        .where(eq(findrProfiles.userId, session.user.id))
        .returning();

    if (!profile) {
        throw new Error("Profile not found");
    }

    revalidatePath("/findr");
    revalidatePath("/findr/profile");

    return profile;
}
