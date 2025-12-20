"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CircleCheckBig, Dot, MousePointerClick } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Session } from "~/auth/client";
import type { PollType } from "~/models/poll";

export function PollDisplay({
  poll,
  user,
  pollRefId,
  settings
}: PollingProps) {
  return (
    <div className="grid gap-3 mt-4">
      {poll.options.map((option) => {
        const { percent, count } = parseVotes(poll.votes, option);
        const { disabled, voted } = notAllowed(poll.votes, poll.options, settings?.multipleChoice, user, option);

        return (
          <div
            key={pollRefId + "_" + option}
            className="relative w-full rounded-lg border overflow-hidden group"
          >
            {/* Progress background */}
            <div
              className={cn(
                "absolute left-0 top-0 h-full transition-all duration-500",
                voted ? "bg-primary/30" : "bg-primary/15"
              )}
              style={{ width: `${count > 0 ? Math.max(1, percent) : 0}%` }}
            />

            {/* Option Row */}
            <button
              aria-label={`Vote for ${option}`}
              disabled={disabled}
              className={cn(
                "relative z-10 flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition-colors",
                {
                  "cursor-not-allowed opacity-50": disabled,
                  "hover:bg-muted/50": !disabled,
                }
              )}
            >
              <div className="flex items-center gap-2">
                {voted && <Check className="h-4 w-4 text-primary shrink-0" />}
                <span>{option}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{percent.toFixed(1)}%</span>
                <span className="hidden sm:inline">({count})</span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

interface PollingProps {
  poll: PollType;
  settings?: {
    multipleChoice?: boolean;
  }
  user: Session["user"];
  updateVotes: (option: string) => Promise<PollType>;
  pollRefId?: string;
}

export default function PollingFunctional({ poll, user, updateVotes, settings, pollRefId }: PollingProps) {
  const [votes, setVotes] = useState<PollType["votes"]>(poll.votes);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (option: string) => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      const updatedPoll = await updateVotes(option);
      setVotes(updatedPoll.votes);
      toast.success("Vote submitted!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit vote");
    } finally {
      setIsVoting(false);
    }
  };

  const handleSync = useCallback(async () => {
    try {
      // Sync logic if needed
    } catch (error) {
      console.error("Failed to sync poll:", error);
    }
  }, []);

  useEffect(() => {
    handleSync();
  }, [handleSync]);

  return (
    <div className="grid gap-3 mt-4">
      {poll.options.map((option) => {
        const { percent, count } = parseVotes(votes, option);
        const { disabled, voted, message } = notAllowed(votes, poll.options, settings?.multipleChoice, user, option);
        const hasVoted = voted;

        return (
          <motion.div
            key={pollRefId + "_" + option}
            className={cn(
              "relative overflow-hidden rounded-xl border border-border bg-muted",
              hasVoted && "border border-primary"
            )}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Progress bar */}
            <motion.div
              className={cn("absolute left-0 top-0 h-full bg-primary/20", hasVoted && "bg-primary/30")}
              initial={{ width: 0 }}
              animate={{ width: `${count > 0 ? Math.max(1, percent) : 0}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            <div className="relative z-10 p-4 flex flex-row items-start justify-between rounded-md shadow-none transition-all">
              <div className="flex-1 grid gap-1.5">
                <div className="font-semibold flex items-center gap-2 text-sm">
                  {option}
                </div>
                <div className="flex gap-1 text-xs text-muted-foreground font-medium">
                  <span>{percent.toFixed(1)}%</span>
                  <Dot className="inline-block -mx-1 size-4" />
                  <span>{count} {count === 1 ? "vote" : "votes"}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant={hasVoted ? "default" : "outline"}
                disabled={disabled || isVoting}
                onClick={() => handleVote(option)}
                className={cn(
                  "shrink-0 gap-2 transition-all",
                  hasVoted && "bg-primary text-primary-foreground"
                )}
              >
                {hasVoted ? (
                  <CircleCheckBig className="shrink-0" />
                ) : (
                  <MousePointerClick className="shrink-0" />
                )}
                <span>{hasVoted ? "Voted" : "Vote"}</span>
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* Utils */
function notAllowed(
  votes: PollType["votes"],
  options: string[],
  multipleChoice: boolean | undefined,
  user: Session["user"],
  option: string
) {
  if (!user) return { disabled: true, message: "Login to vote", voted: false };

  const hasVotedForThis = votes.some((v) => v.option === option && v.userId === user.id);
  const hasVotedForAny = votes.some((v) => v.userId === user.id);

  if (!multipleChoice && hasVotedForAny && !hasVotedForThis) {
    return { disabled: true, message: "You can only vote once", voted: false };
  }
  
  return { disabled: false, message: "", voted: hasVotedForThis };
}

function parseVotes(
  votes: PollType["votes"],
  option: string
) {
  const totalVotes = votes.length;
  const count = votes.filter((v) => v.option === option).length;
  const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
  return { count, percent };
}
