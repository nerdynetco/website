"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { reactToPost, reactToComment } from "~/actions/reactions";
import toast from "react-hot-toast";
import { Smile } from "lucide-react";
import { REACTIONS, ReactionType } from "~/constants/reactions";

interface ReactionPickerProps {
  itemId: string;
  itemType: "post" | "comment";
  initialReactions: {
    fire: number;
    rocket: number;
    bulb: number;
  };
  initialUserReactions: {
    fire: boolean;
    rocket: boolean;
    bulb: boolean;
  };
  variant?: "default" | "compact";
}

export default function ReactionPicker({
  itemId,
  itemType,
  initialReactions,
  initialUserReactions,
  variant = "default",
}: ReactionPickerProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReactions, setUserReactions] = useState(initialUserReactions);
  const [isPending, startTransition] = useTransition();
  const [showPicker, setShowPicker] = useState(false);

  const handleReaction = async (reactionType: ReactionType) => {
    // Optimistic update
    const previousState = { reactions, userReactions };

    const wasReacted = userReactions[reactionType];
    
    setReactions((prev) => ({
      ...prev,
      [reactionType]: wasReacted ? prev[reactionType] - 1 : prev[reactionType] + 1,
    }));
    
    setUserReactions((prev) => ({
      ...prev,
      [reactionType]: !wasReacted,
    }));

    startTransition(async () => {
      try {
        const result =
          itemType === "post"
            ? await reactToPost(itemId, reactionType)
            : await reactToComment(itemId, reactionType);

        // Update with server response
        setReactions(result.reactions);
        setUserReactions(result.userReactions);
        setShowPicker(false);
      } catch (error: any) {
        // Revert on error
        setReactions(previousState.reactions);
        setUserReactions(previousState.userReactions);
        toast.error(error.message || "Failed to react");
      }
    });
  };

  const totalReactions = reactions.fire + reactions.rocket + reactions.bulb;
  const hasReacted = userReactions.fire || userReactions.rocket || userReactions.bulb;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1">
        {(["fire", "rocket", "bulb"] as ReactionType[]).map((type) => {
          const count = reactions[type];
          const isActive = userReactions[type];
          
          if (count === 0 && !showPicker) return null;

          return (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2 gap-1",
                isActive && "bg-primary/10 text-primary"
              )}
              onClick={() => handleReaction(type)}
              disabled={isPending}
            >
              <span className="text-sm">{REACTIONS[type].emoji}</span>
              {count > 0 && (
                <span className="text-xs font-medium">{count}</span>
              )}
            </Button>
          );
        })}
        
        {!showPicker && totalReactions === 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => setShowPicker(true)}
          >
            <Smile className="size-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1.5 rounded-full px-3 py-1.5 transition-all",
          hasReacted && "bg-primary/10 text-primary"
        )}
        onClick={() => setShowPicker(!showPicker)}
      >
        <Smile className="size-4" />
        {totalReactions > 0 && (
          <span className="text-xs font-semibold">{totalReactions}</span>
        )}
      </Button>

      {/* Reaction Picker Popup */}
      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 z-20 flex gap-1 p-2 bg-popover border rounded-lg shadow-lg">
            {(["fire", "rocket", "bulb"] as ReactionType[]).map((type) => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 text-2xl hover:scale-110 transition-transform",
                  userReactions[type] && "bg-primary/10"
                )}
                onClick={() => handleReaction(type)}
                disabled={isPending}
                title={REACTIONS[type].label}
              >
                {REACTIONS[type].emoji}
              </Button>
            ))}
          </div>
        </>
      )}

      {/* Active Reactions Display */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-1 mt-1">
          {(["fire", "rocket", "bulb"] as ReactionType[]).map((type) => {
            const count = reactions[type];
            if (count === 0) return null;

            return (
              <button
                key={type}
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors",
                  userReactions[type]
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted border-transparent hover:border-border"
                )}
                onClick={() => handleReaction(type)}
                disabled={isPending}
              >
                <span>{REACTIONS[type].emoji}</span>
                <span className="font-medium">{count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
