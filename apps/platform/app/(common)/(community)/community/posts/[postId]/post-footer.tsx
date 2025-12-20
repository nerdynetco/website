"use client";

import ShareButton from "@/components/common/share-button";
import VoteButtons from "@/components/common/vote-buttons";
import ReactionPicker from "@/components/common/reaction-picker";
import ReportButton from "@/components/common/report-button";
import { AuthActionButton } from "@/components/utils/link";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Heart,
  Send
} from "lucide-react";
import { useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";
import type { CommunityPostTypeWithId } from "src/models/community";
import { updatePost } from "~/actions/common.community";
import type { Session } from "~/auth";
import { appConfig } from "~/project.config";
import { formatNumber } from "~/utils/number";

interface FooterProps {
  post: CommunityPostTypeWithId;
  user?: Session["user"];
  className?: string;
}

export default function PostFooterOptimistic({ post, user, className }: FooterProps) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-border/40", className)}>
      <div className="flex items-center justify-between">
        
        {/* --- Left: Interaction Group --- */}
        <OptimisticFooterActionBar post={post} user={user} />

        {/* --- Right: Share Action --- */}
        <ShareButton
          data={{
            title: post.title,
            text: "Check out this discussion!",
            url: `${appConfig.url}/community/posts/${post._id}`,
          }}
          variant="ghost"
          size="sm"
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-2 transition-all"
        >
          <Send className="size-4" />
          <span className="text-xs font-medium hidden sm:inline">Share</span>
        </ShareButton>
      </div>
    </div>
  );
}

export function OptimisticFooterActionBar({ post, user }: FooterProps) {
  const [isPending, startTransition] = useTransition();

  // Calculate vote data
  const upvotes = post.upvotes?.length || 0;
  const downvotes = post.downvotes?.length || 0;
  const userVote = user
    ? post.upvotes?.includes(user.id)
      ? "upvote" as const
      : post.downvotes?.includes(user.id)
      ? "downvote" as const
      : null
    : null;

  // Calculate reaction data
  const reactions = {
    fire: post.reactions?.fire?.length || 0,
    rocket: post.reactions?.rocket?.length || 0,
    bulb: post.reactions?.bulb?.length || 0,
  };
  const userReactions = {
    fire: user ? post.reactions?.fire?.includes(user.id) || false : false,
    rocket: user ? post.reactions?.rocket?.includes(user.id) || false : false,
    bulb: user ? post.reactions?.bulb?.includes(user.id) || false : false,
  };

  const [optimisticPost, setOptimisticPost] = useOptimistic(
    post,
    (current, action: { type: "toggleLike" | "toggleSave"; userId: string }) => {
      if (action.type === "toggleLike") {
        const liked = current.likes?.includes(action.userId) || false;
        return {
          ...current,
          likes: liked
            ? current.likes.filter((id) => id !== action.userId)
            : [...current.likes, action.userId],
        };
      }
      if (action.type === "toggleSave") {
        const saved = current.savedBy.includes(action.userId);
        return {
          ...current,
          savedBy: saved
            ? current.savedBy.filter((id) => id !== action.userId)
            : [...current.savedBy, action.userId],
        };
      }
      return current;
    }
  );

  const handleLike = () => {
    if (!user?.id) return;
    startTransition(() => {
      setOptimisticPost({ type: "toggleLike", userId: user.id });
      void updatePost(post._id, { type: "toggleLike" }).catch((error) => {
        toast.error("Failed to like post");
      });
    });
  };

  const handleSave = () => {
    if (!user?.id) return;
    startTransition(() => {
      setOptimisticPost({ type: "toggleSave", userId: user.id });
      void updatePost(post._id, { type: "toggleSave" }).catch((error) => {
        toast.error("Failed to save post");
      });
    });
  };

  const isLiked = user && optimisticPost.likes.includes(user.id);
  const isSaved = user && optimisticPost.savedBy.includes(user.id);

  return (
    <div className="flex items-center gap-1">
      
      {/* VOTE BUTTONS */}
      {user ? (
        <VoteButtons
          itemId={post._id}
          itemType="post"
          initialUpvotes={upvotes}
          initialDownvotes={downvotes}
          initialUserVote={userVote}
          variant="compact"
        />
      ) : (
        <AuthActionButton
          variant="ghost"
          size="sm"
          authorized={false}
          dialog={{
            title: "Join the conversation",
            description: "Sign in to vote on posts.",
          }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground"
        >
          <span className="text-xs font-semibold">{upvotes - downvotes}</span>
        </AuthActionButton>
      )}

      {/* REACTIONS */}
      {user && (
        <ReactionPicker
          itemId={post._id}
          itemType="post"
          initialReactions={reactions}
          initialUserReactions={userReactions}
          variant="compact"
        />
      )}

      {/* REPORT BUTTON */}
      {user && (
        <ReportButton
          contentType="post"
          contentId={post._id}
          variant="ghost"
        />
      )}

      {/* SAVE BUTTON */}
      <AuthActionButton
        variant="ghost"
        size="sm"
        authorized={!!user}
        dialog={{
          title: "Save for later",
          description: "Sign in to bookmark posts to your profile.",
        }}
        onClick={handleSave}
        className={cn(
          "group flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all hover:bg-emerald-500/10 active:scale-95",
          isSaved ? "text-emerald-500" : "text-muted-foreground hover:text-emerald-500"
        )}
      >
        <Bookmark 
            className={cn("size-4 transition-transform group-hover:scale-110", isSaved && "fill-current scale-110")} 
        />
        <span className={cn("text-xs font-semibold tabular-nums", !isSaved && "hidden sm:inline")}>
          {isSaved ? "Saved" : "Save"}
        </span>
      </AuthActionButton>

      {/* COMMENT COUNT (Visual Only for now) */}
      {/* <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer">
         <MessageCircle className="size-4" />
         <span className="text-xs font-semibold tabular-nums">0</span>
      </div> */}

    </div>
  );
}