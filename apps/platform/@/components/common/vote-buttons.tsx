"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { voteOnPost, voteOnComment } from "~/actions/voting";
import toast from "react-hot-toast";

interface VoteButtonsProps {
  itemId: string;
  itemType: "post" | "comment";
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote: "upvote" | "downvote" | null;
  variant?: "default" | "compact";
}

export default function VoteButtons({
  itemId,
  itemType,
  initialUpvotes,
  initialDownvotes,
  initialUserVote,
  variant = "default",
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(initialUserVote);
  const [isPending, startTransition] = useTransition();

  const score = upvotes - downvotes;

  const handleVote = async (voteType: "upvote" | "downvote") => {
    // Optimistic update
    const previousState = { upvotes, downvotes, userVote };

    if (userVote === voteType) {
      // Remove vote
      if (voteType === "upvote") {
        setUpvotes((prev) => prev - 1);
      } else {
        setDownvotes((prev) => prev - 1);
      }
      setUserVote(null);
    } else {
      // Change or add vote
      if (userVote === "upvote") {
        setUpvotes((prev) => prev - 1);
      } else if (userVote === "downvote") {
        setDownvotes((prev) => prev - 1);
      }

      if (voteType === "upvote") {
        setUpvotes((prev) => prev + 1);
      } else {
        setDownvotes((prev) => prev + 1);
      }
      setUserVote(voteType);
    }

    startTransition(async () => {
      try {
        const result =
          itemType === "post"
            ? await voteOnPost(itemId, voteType)
            : await voteOnComment(itemId, voteType);

        // Update with server response
        setUpvotes(result.upvotes);
        setDownvotes(result.downvotes);
        setUserVote(result.userVote as "upvote" | "downvote" | null);
      } catch (error: any) {
        // Revert on error
        setUpvotes(previousState.upvotes);
        setDownvotes(previousState.downvotes);
        setUserVote(previousState.userVote);
        toast.error(error.message || "Failed to vote");
      }
    });
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2",
            userVote === "upvote" && "text-orange-500 bg-orange-500/10"
          )}
          onClick={() => handleVote("upvote")}
          disabled={isPending}
        >
          <ArrowUp className="size-3" />
        </Button>
        <span className={cn(
          "text-sm font-medium min-w-[2rem] text-center",
          score > 0 && "text-orange-500",
          score < 0 && "text-blue-500"
        )}>
          {score}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2",
            userVote === "downvote" && "text-blue-500 bg-blue-500/10"
          )}
          onClick={() => handleVote("downvote")}
          disabled={isPending}
        >
          <ArrowDown className="size-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 rounded-full",
          userVote === "upvote" && "text-orange-500 bg-orange-500/10 hover:bg-orange-500/20"
        )}
        onClick={() => handleVote("upvote")}
        disabled={isPending}
      >
        <ArrowUp className="size-4" />
      </Button>
      <span
        className={cn(
          "text-sm font-bold min-w-[2rem] text-center",
          score > 0 && "text-orange-500",
          score < 0 && "text-blue-500"
        )}
      >
        {score}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 rounded-full",
          userVote === "downvote" && "text-blue-500 bg-blue-500/10 hover:bg-blue-500/20"
        )}
        onClick={() => handleVote("downvote")}
        disabled={isPending}
      >
        <ArrowDown className="size-4" />
      </Button>
    </div>
  );
}
