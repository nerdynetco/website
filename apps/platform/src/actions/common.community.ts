"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";
import { awardPoints } from "./points";
import { auth } from "~/auth";
import {
  rawCommunityPostSchema,
    RawCommunityPostType,
} from "~/constants/common.community";
import dbConnect from "~/lib/dbConnect";
import CommunityPost, {
    CommunityComment,
    CommunityPostTypeWithId,
    rawCommunityCommentSchema,
} from "~/models/community";

import { db } from "~/db/connect";
import { users } from "~/db/schema/auth-schema";
import { eq } from "drizzle-orm";
// Create a new post
export async function createPost(postData: RawCommunityPostType) {
  const parsed = rawCommunityPostSchema.safeParse(JSON.parse(JSON.stringify(postData)));
  if (!parsed.success) {
    return Promise.reject("Invalid post data");
  }
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    return Promise.reject("You need to be logged in to create a post");
  }

  const user = await db
    .select({ house: users.house })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user || user.length === 0 || !user[0].house) {
    return Promise.reject("User not found or house not assigned.");
  }

  try {
    await dbConnect();
    const cumPost = {
      ...parsed.data,
      author: {
        id: session.user.id,
        name: session.user.name,
        username: session.user.username,
      },
      views:0,
      house: user[0].house,
    }
    console.log("Creating post with data:", cumPost);
    const post = await CommunityPost.create(cumPost);
    console.log("Post before save:", post);
    await post.save();
    console.log("Post after save:", post);
    
    // Award house points for creating a post
    try {
      await awardPoints(
        session.user.id,
        user[0].house,
        "POST_CREATED",
        `Post: ${parsed.data.title}`
      );
    } catch (error) {
      console.error("Failed to award points:", error);
    }
    
    revalidatePath(`/community`);
    console.log("Revalidated /community path");
    return Promise.resolve("Post created successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to create post");
  }
}

// Get posts by category and pagination
export async function getCommunityPosts(
  page: number = 1,
  limit: number = 10,
  category?: string,
  house?: string,
  sortBy: "new" | "hot" | "top" = "new"
): Promise<CommunityPostTypeWithId[]> {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    return Promise.reject("You need to be logged in to view posts");
  }

  const user = await db
    .select({ house: users.house })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user || user.length === 0 || !user[0].house) {
    return Promise.reject("User not found or house not assigned.");
  }

  try {
    await dbConnect();
    
    // Build query
    const query: any = {
      category: category === "all" ? { $exists: true } : category,
    };
    
    // Add house filter if specified
    if (house) {
      query.house = house;
    }
    
    // Determine sort order
    let sortQuery: any;
    switch (sortBy) {
      case "hot":
        // Hot: Recent posts with high engagement (upvotes + reactions + comments)
        // Use a simple score: upvotes - downvotes + reactions + views/100
        sortQuery = { createdAt: -1 }; // Fallback to new for now, will add scoring
        break;
      case "top":
        // Top: Most upvoted posts
        sortQuery = { createdAt: -1 }; // Fallback, will calculate score
        break;
      case "new":
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    let posts = await CommunityPost.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit * 2) // Fetch more for sorting
      .populate("author", "name email rollNo");

    // Apply custom sorting for hot and top
    if (sortBy === "hot" || sortBy === "top") {
      posts = posts.map((post: any) => {
        const upvotes = post.upvotes?.length || 0;
        const downvotes = post.downvotes?.length || 0;
        const reactions = (post.reactions?.fire?.length || 0) + 
                         (post.reactions?.rocket?.length || 0) + 
                         (post.reactions?.bulb?.length || 0);
        const views = post.views || 0;
        const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
        
        let score;
        if (sortBy === "hot") {
          // Hot algorithm: (upvotes - downvotes + reactions + views/100) / (age + 2)^1.5
          score = (upvotes - downvotes + reactions + views / 100) / Math.pow(ageInHours + 2, 1.5);
        } else {
          // Top: Just net votes + reactions
          score = upvotes - downvotes + reactions;
        }
        
        return { ...post.toObject(), _score: score };
      }).sort((a: any, b: any) => b._score - a._score);
    }

    // Limit to requested amount
    posts = posts.slice(0, limit);
    
    return Promise.resolve(JSON.parse(JSON.stringify(posts)));
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch posts");
  }
}

// Get a single post by ID
export async function getPostById(
  id: string,
  cached: boolean
): Promise<CommunityPostTypeWithId | null> {
  try {
    await dbConnect();
    const postExists = await CommunityPost.findById(id);
    if (!postExists) {
      return Promise.resolve(null);
    }
    const post = await CommunityPost.findById(id)
    if (!cached) {
      post.views += 1;
      await post.save();
    }
    return Promise.resolve(JSON.parse(JSON.stringify(post)));
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch post");
  }
}

// Update post (likes, saves, views)
type UpdateAction =
  | { type: "toggleLike" }
  | { type: "toggleSave" }
  | { type: "incrementViews" }
  | {
      type: "edit";
      data: Partial<Pick<CommunityPostTypeWithId, "title" | "content">>;
    };

export async function updatePost(id: string, action: UpdateAction) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) throw new Error("You need to be logged in to update a post");

  await dbConnect();

  const post = await CommunityPost.findById(id);
  if (!post) throw new Error("Post not found");

  switch (action.type) {
    case "toggleLike": {
      const idx = post.likes.indexOf(session.user.id);
      if (idx === -1) {
        post.likes.push(session.user.id);
      } else {
        post.likes.splice(idx, 1);
      }
      break;
    }

    case "toggleSave": {
      const idx = post.savedBy.indexOf(session.user.id);
      if (idx === -1) {
        post.savedBy.push(session.user.id);
      } else {
        post.savedBy.splice(idx, 1);
      }
      break;
    }

    case "incrementViews": {
      post.views += 1;
      break;
    }

    case "edit": {
      if (post.author.id !== session.user.id && session.user.role !== "admin") {
        throw new Error("You are not authorized to edit this post");
      }
      Object.assign(post, JSON.parse(JSON.stringify(action.data)));
      break;
    }

    default:
      throw new Error("Unknown update action");
  }

  await post.save();

  revalidatePath(`/community/posts/${id}`);
  revalidatePath(`/community`);

  return JSON.parse(JSON.stringify(post)) as CommunityPostTypeWithId;
}
export async function deletePost(id: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    return Promise.reject("You need to be logged in to update a post");
  }

  try {
    await dbConnect();
    const post = await CommunityPost.findById(id);
    if (!post) {
      return Promise.reject("Post not found");
    }

    // Check if the user is the author of the post
    if (post.author.id !== session.user.id && session.user.role !== "admin") {
      return Promise.reject("You are not authorized to delete this post");
    }
    await post.deleteOne();
    // Also delete all comments related to this post
    await CommunityComment.deleteMany({ postId: id });
    revalidatePath(`/community`);
    return Promise.resolve("Post deleted successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to delete post");
  }
}

// Create a new comment
export async function createComment(
  commentData: z.infer<typeof rawCommunityCommentSchema>
) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    return Promise.reject("You need to be logged in to create a comment");
  }

  try {
    await dbConnect();
    const comment = new CommunityComment({
      ...commentData,
      author: session.user.id,
    });
    await comment.save();
    revalidatePath(`/community/posts/${commentData.postId}`);
    return Promise.resolve("Comment created successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to create comment");
  }
}

// Get comments for a post (with pagination or lazy loading)
export async function getCommentsForPost(
  postId: string,
  page: number,
  limit: number
) {
  try {
    await dbConnect();
    const comments = await CommunityComment.find({ postId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("replies")
      .populate("author", "name email");
    return Promise.resolve(JSON.parse(JSON.stringify(comments)));
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch comments");
  }
}
