"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "~/auth";
import { ReactionType } from "~/constants/reactions";
import dbConnect from "~/lib/dbConnect";
import CommunityPost from "~/models/community";
import { CommunityComment } from "~/models/community";



/**
 * Toggle reaction on a post
 */
export async function reactToPost(postId: string, reactionType: ReactionType) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to react");
  }

  try {
    await dbConnect();

    const post = await CommunityPost.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const userId = session.user.id;
    
    // Initialize reactions if not exists
    if (!post.reactions) {
      post.reactions = { fire: [], rocket: [], bulb: [] };
    }

    const hasReacted = post.reactions[reactionType]?.includes(userId);

    if (hasReacted) {
      // Remove reaction
      post.reactions[reactionType] = post.reactions[reactionType].filter(
        (id: string) => id !== userId
      );
    } else {
      // Add reaction
      if (!post.reactions[reactionType]) {
        post.reactions[reactionType] = [];
      }
      post.reactions[reactionType].push(userId);
    }

    await post.save();

    revalidatePath("/community");
    revalidatePath(`/community/posts/${postId}`);

    return {
      success: true,
      reactions: {
        fire: post.reactions.fire?.length || 0,
        rocket: post.reactions.rocket?.length || 0,
        bulb: post.reactions.bulb?.length || 0,
      },
      userReactions: {
        fire: post.reactions.fire?.includes(userId) || false,
        rocket: post.reactions.rocket?.includes(userId) || false,
        bulb: post.reactions.bulb?.includes(userId) || false,
      },
    };
  } catch (error: any) {
    console.error("Failed to react to post:", error);
    throw new Error(error.message || "Failed to react to post");
  }
}

/**
 * Toggle reaction on a comment
 */
export async function reactToComment(commentId: string, reactionType: ReactionType) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to react");
  }

  try {
    await dbConnect();

    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const userId = session.user.id;
    
    // Initialize reactions if not exists
    if (!comment.reactions) {
      comment.reactions = { fire: [], rocket: [], bulb: [] };
    }

    const hasReacted = comment.reactions[reactionType]?.includes(userId);

    if (hasReacted) {
      // Remove reaction
      comment.reactions[reactionType] = comment.reactions[reactionType].filter(
        (id: string) => id !== userId
      );
    } else {
      // Add reaction
      if (!comment.reactions[reactionType]) {
        comment.reactions[reactionType] = [];
      }
      comment.reactions[reactionType].push(userId);
    }

    await comment.save();

    revalidatePath("/community");

    return {
      success: true,
      reactions: {
        fire: comment.reactions.fire?.length || 0,
        rocket: comment.reactions.rocket?.length || 0,
        bulb: comment.reactions.bulb?.length || 0,
      },
      userReactions: {
        fire: comment.reactions.fire?.includes(userId) || false,
        rocket: comment.reactions.rocket?.includes(userId) || false,
        bulb: comment.reactions.bulb?.includes(userId) || false,
      },
    };
  } catch (error: any) {
    console.error("Failed to react to comment:", error);
    throw new Error(error.message || "Failed to react to comment");
  }
}

/**
 * Get reactions for a post
 */
export async function getPostReactions(postId: string, userId?: string) {
  try {
    await dbConnect();

    const post = await CommunityPost.findById(postId);

    if (!post || !post.reactions) {
      return {
        reactions: { fire: 0, rocket: 0, bulb: 0 },
        userReactions: { fire: false, rocket: false, bulb: false },
      };
    }

    return {
      reactions: {
        fire: post.reactions.fire?.length || 0,
        rocket: post.reactions.rocket?.length || 0,
        bulb: post.reactions.bulb?.length || 0,
      },
      userReactions: userId
        ? {
            fire: post.reactions.fire?.includes(userId) || false,
            rocket: post.reactions.rocket?.includes(userId) || false,
            bulb: post.reactions.bulb?.includes(userId) || false,
          }
        : { fire: false, rocket: false, bulb: false },
    };
  } catch (error) {
    console.error("Failed to get post reactions:", error);
    return {
      reactions: { fire: 0, rocket: 0, bulb: 0 },
      userReactions: { fire: false, rocket: false, bulb: false },
    };
  }
}
