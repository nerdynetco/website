"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "~/auth";
import dbConnect from "~/lib/dbConnect";
import CommunityPost, { CommunityComment } from "~/models/community";

/**
 * Edit a post (only by author)
 */
export async function editPost(postId: string, title: string, content: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to edit a post");
  }

  try {
    await dbConnect();

    const post = await CommunityPost.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user is the author
    if (post.author.id !== session.user.id) {
      throw new Error("You can only edit your own posts");
    }

    post.title = title;
    post.content = content;
    post.updatedAt = new Date();

    await post.save();

    revalidatePath("/community");
    revalidatePath(`/community/posts/${postId}`);

    return { success: true, message: "Post updated successfully" };
  } catch (error: any) {
    console.error("Failed to edit post:", error);
    throw new Error(error.message || "Failed to edit post");
  }
}

/**
 * Delete a post (only by author)
 */
export async function deletePost(postId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to delete a post");
  }

  try {
    await dbConnect();

    const post = await CommunityPost.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user is the author
    if (post.author.id !== session.user.id) {
      throw new Error("You can only delete your own posts");
    }

    // Delete all comments associated with this post
    await CommunityComment.deleteMany({ postId: postId });

    // Delete the post
    await CommunityPost.findByIdAndDelete(postId);

    revalidatePath("/community");

    return { success: true, message: "Post deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete post:", error);
    throw new Error(error.message || "Failed to delete post");
  }
}

/**
 * Edit a comment (only by author)
 */
export async function editComment(commentId: string, content: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to edit a comment");
  }

  try {
    await dbConnect();

    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user is the author
    if (comment.author.id !== session.user.id) {
      throw new Error("You can only edit your own comments");
    }

    comment.content = content;
    comment.updatedAt = new Date();

    await comment.save();

    revalidatePath("/community");

    return { success: true, message: "Comment updated successfully" };
  } catch (error: any) {
    console.error("Failed to edit comment:", error);
    throw new Error(error.message || "Failed to edit comment");
  }
}

/**
 * Delete a comment (only by author)
 */
export async function deleteComment(commentId: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to delete a comment");
  }

  try {
    await dbConnect();

    const comment = await CommunityComment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user is the author
    if (comment.author.id !== session.user.id) {
      throw new Error("You can only delete your own comments");
    }

    // Delete all replies to this comment
    if (comment.replies && comment.replies.length > 0) {
      await CommunityComment.deleteMany({ _id: { $in: comment.replies } });
    }

    // Delete the comment
    await CommunityComment.findByIdAndDelete(commentId);

    revalidatePath("/community");

    return { success: true, message: "Comment deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete comment:", error);
    throw new Error(error.message || "Failed to delete comment");
  }
}
