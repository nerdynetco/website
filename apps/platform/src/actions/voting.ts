"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "~/auth";
import dbConnect from "~/lib/dbConnect";
import CommunityPost from "~/models/community";
import { CommunityComment } from "~/models/community";
import { awardPoints } from "./points";
import { db } from "~/db/connect";
import { users } from "~/db/schema/auth-schema";
import { eq } from "drizzle-orm";

type VoteType = "upvote" | "downvote";

/**
 * Vote on a community post
 */
export async function voteOnPost(postId: string, voteType: VoteType) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to vote");
  }

  try {
    await dbConnect();

    const post = await CommunityPost.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const userId = session.user.id;
    const hasUpvoted = post.upvotes.includes(userId);
    const hasDownvoted = post.downvotes.includes(userId);

    // Remove from both arrays first
    post.upvotes = post.upvotes.filter((id: string) => id !== userId);
    post.downvotes = post.downvotes.filter((id: string) => id !== userId);

    // Add to the appropriate array if not removing vote
    if (voteType === "upvote" && !hasUpvoted) {
      post.upvotes.push(userId);
    } else if (voteType === "downvote" && !hasDownvoted) {
      post.downvotes.push(userId);
    }

    await post.save();

    // Award points for upvoting (engagement)
    if (voteType === "upvote" && !hasUpvoted) {
      const user = await db
        .select({ house: users.house })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user && user.length > 0 && user[0].house) {
        await awardPoints(userId, user[0].house, "POST_LIKED", `Upvoted post: ${post.title}`);
      }
    }

    revalidatePath("/community");
    revalidatePath(`/community/posts/${postId}`);

    return {
      success: true,
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
      userVote: post.upvotes.includes(userId) ? "upvote" : post.downvotes.includes(userId) ? "downvote" : null,
    };
  } catch (error: any) {
    console.error("Failed to vote on post:", error);
    throw new Error(error.message || "Failed to vote on post");
  }
}

/**
 * Vote on a comment
 */
export async function voteOnComment(commentId: string, voteType: VoteType) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to vote");
  }

  try {
    await dbConnect();

    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const userId = session.user.id;
    const hasUpvoted = comment.upvotes.includes(userId);
    const hasDownvoted = comment.downvotes.includes(userId);

    // Remove from both arrays first
    comment.upvotes = comment.upvotes.filter((id: string) => id !== userId);
    comment.downvotes = comment.downvotes.filter((id: string) => id !== userId);

    // Add to the appropriate array if not removing vote
    if (voteType === "upvote" && !hasUpvoted) {
      comment.upvotes.push(userId);
    } else if (voteType === "downvote" && !hasDownvoted) {
      comment.downvotes.push(userId);
    }

    await comment.save();

    // Award points for upvoting comments (engagement)
    if (voteType === "upvote" && !hasUpvoted) {
      const user = await db
        .select({ house: users.house })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user && user.length > 0 && user[0].house) {
        await awardPoints(userId, user[0].house, "COMMENT_LIKED", "Upvoted comment");
      }
    }

    revalidatePath("/community");

    return {
      success: true,
      upvotes: comment.upvotes.length,
      downvotes: comment.downvotes.length,
      userVote: comment.upvotes.includes(userId) ? "upvote" : comment.downvotes.includes(userId) ? "downvote" : null,
    };
  } catch (error: any) {
    console.error("Failed to vote on comment:", error);
    throw new Error(error.message || "Failed to vote on comment");
  }
}

/**
 * Get vote counts for a post
 */
export async function getPostVotes(postId: string, userId?: string) {
  try {
    await dbConnect();

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return { upvotes: 0, downvotes: 0, userVote: null, score: 0 };
    }

    const upvotes = post.upvotes.length;
    const downvotes = post.downvotes.length;
    const score = upvotes - downvotes;
    const userVote = userId
      ? post.upvotes.includes(userId)
        ? "upvote"
        : post.downvotes.includes(userId)
        ? "downvote"
        : null
      : null;

    return { upvotes, downvotes, userVote, score };
  } catch (error) {
    console.error("Failed to get post votes:", error);
    return { upvotes: 0, downvotes: 0, userVote: null, score: 0 };
  }
}

/**
 * Get vote counts for a comment
 */
export async function getCommentVotes(commentId: string, userId?: string) {
  try {
    await dbConnect();

    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      return { upvotes: 0, downvotes: 0, userVote: null, score: 0 };
    }

    const upvotes = comment.upvotes.length;
    const downvotes = comment.downvotes.length;
    const score = upvotes - downvotes;
    const userVote = userId
      ? comment.upvotes.includes(userId)
        ? "upvote"
        : comment.downvotes.includes(userId)
        ? "downvote"
        : null
      : null;

    return { upvotes, downvotes, userVote, score };
  } catch (error) {
    console.error("Failed to get comment votes:", error);
    return { upvotes: 0, downvotes: 0, userVote: null, score: 0 };
  }
}
