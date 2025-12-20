"use server";

import dbConnect from "~/lib/dbConnect";
import CommunityPost from "~/models/community";
import type { CommunityPostTypeWithId } from "~/models/community";

/**
 * Search community posts by title, content, or author
 */
export async function searchPosts(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<CommunityPostTypeWithId[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    await dbConnect();

    const searchRegex = new RegExp(query.trim(), "i"); // Case-insensitive

    const posts = await CommunityPost.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { "author.name": searchRegex },
        { "author.username": searchRegex },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to search posts:", error);
    return [];
  }
}

/**
 * Get search suggestions based on partial query
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    await dbConnect();

    const searchRegex = new RegExp(`^${query.trim()}`, "i");

    // Get unique titles that match
    const posts = await CommunityPost.find({
      title: searchRegex,
    })
      .select("title")
      .limit(5)
      .sort({ createdAt: -1 });

    const suggestions = posts.map((post: any) => post.title);
    return [...new Set(suggestions)]; // Remove duplicates
  } catch (error) {
    console.error("Failed to get search suggestions:", error);
    return [];
  }
}
