"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileCard from "./profile-card";
import MatchModal from "./match-modal";
import { swipe, type DiscoverProfile, type SwipeResult } from "~/actions/findr";
import { toast } from "sonner";

interface SwipeDeckProps {
    initialProfiles: DiscoverProfile[];
    onEmpty?: () => void;
}

export default function SwipeDeck({ initialProfiles, onEmpty }: SwipeDeckProps) {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null);
    const [matchResult, setMatchResult] = useState<{ profile: DiscoverProfile; matchId: string } | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

    // Overlay indicators
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
    const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

    const currentProfile = profiles[currentIndex];

    const handleSwipe = useCallback(
        async (direction: "left" | "right" | "up") => {
            if (isAnimating || !currentProfile) return;

            setIsAnimating(true);
            setSwipeDirection(direction);

            const action = direction === "left" ? "pass" : direction === "right" ? "like" : "super_like";

            try {
                const result: SwipeResult = await swipe(currentProfile.userId, action);

                if (result.isMatch && result.matchId) {
                    setMatchResult({ profile: currentProfile, matchId: result.matchId });
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to record swipe");
            }

            // Move to next profile
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
                setSwipeDirection(null);
                setIsAnimating(false);
                x.set(0);
                y.set(0);

                if (currentIndex + 1 >= profiles.length) {
                    onEmpty?.();
                }
            }, 300);
        },
        [currentProfile, currentIndex, profiles.length, isAnimating, x, y, onEmpty]
    );

    const handleDragEnd = useCallback(
        (_: any, info: PanInfo) => {
            const { offset, velocity } = info;
            const swipeThreshold = 100;
            const velocityThreshold = 500;

            const xSwipe = Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold;
            const ySwipe = offset.y < -swipeThreshold || velocity.y < -velocityThreshold;

            if (ySwipe && offset.y < 0) {
                handleSwipe("up");
            } else if (xSwipe) {
                handleSwipe(offset.x > 0 ? "right" : "left");
            } else {
                // Reset position
                x.set(0);
                y.set(0);
            }
        },
        [handleSwipe, x, y]
    );

    if (!currentProfile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-24 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Heart className="size-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
                <p className="text-muted-foreground max-w-sm">
                    You&apos;ve seen everyone for now. Check back later for new builders!
                </p>
                <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => window.location.reload()}
                >
                    <RotateCcw className="size-4 mr-2" />
                    Refresh
                </Button>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center gap-6">
            {/* Card Stack */}
            <div className="relative w-full max-w-md h-[520px]">
                <AnimatePresence>
                    {/* Background cards (next 2) */}
                    {profiles.slice(currentIndex + 1, currentIndex + 3).reverse().map((profile, index) => (
                        <motion.div
                            key={profile.id}
                            className="absolute inset-0"
                            initial={{ scale: 0.95 - index * 0.03, y: 10 + index * 5 }}
                            animate={{ scale: 0.97 - index * 0.03, y: 5 + index * 5 }}
                            style={{ zIndex: -index - 1 }}
                        >
                            <div className="opacity-60 pointer-events-none">
                                <ProfileCard profile={profile} />
                            </div>
                        </motion.div>
                    ))}

                    {/* Current card */}
                    <motion.div
                        key={currentProfile.id}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.9}
                        onDragEnd={handleDragEnd}
                        style={{ x, y, rotate, opacity }}
                        animate={
                            swipeDirection
                                ? {
                                    x: swipeDirection === "left" ? -500 : swipeDirection === "right" ? 500 : 0,
                                    y: swipeDirection === "up" ? -500 : 0,
                                    opacity: 0,
                                    transition: { duration: 0.3 },
                                }
                                : undefined
                        }
                    >
                        <ProfileCard profile={currentProfile} />

                        {/* Swipe Indicators */}
                        <motion.div
                            className="absolute top-8 left-8 rotate-[-20deg] border-4 border-green-500 rounded-lg px-4 py-2 text-green-500 font-bold text-2xl uppercase"
                            style={{ opacity: likeOpacity }}
                        >
                            Like
                        </motion.div>
                        <motion.div
                            className="absolute top-8 right-8 rotate-[20deg] border-4 border-red-500 rounded-lg px-4 py-2 text-red-500 font-bold text-2xl uppercase"
                            style={{ opacity: nopeOpacity }}
                        >
                            Nope
                        </motion.div>
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-blue-500 rounded-lg px-4 py-2 text-blue-500 font-bold text-2xl uppercase"
                            style={{ opacity: superLikeOpacity }}
                        >
                            Super Like!
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
                <Button
                    size="lg"
                    variant="outline"
                    className="size-16 rounded-full border-2 border-red-500/50 hover:border-red-500 hover:bg-red-500/10 transition-all"
                    onClick={() => handleSwipe("left")}
                    disabled={isAnimating}
                >
                    <X className="size-8 text-red-500" />
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    className="size-14 rounded-full border-2 border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                    onClick={() => handleSwipe("up")}
                    disabled={isAnimating}
                >
                    <Sparkles className="size-6 text-blue-500" />
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    className="size-16 rounded-full border-2 border-green-500/50 hover:border-green-500 hover:bg-green-500/10 transition-all"
                    onClick={() => handleSwipe("right")}
                    disabled={isAnimating}
                >
                    <Heart className="size-8 text-green-500" />
                </Button>
            </div>

            {/* Instructions */}
            <p className="text-sm text-muted-foreground text-center">
                Swipe right to like • Left to pass • Up to super like
            </p>

            {/* Match Modal */}
            <MatchModal
                isOpen={!!matchResult}
                onClose={() => setMatchResult(null)}
                matchedProfile={matchResult?.profile || null}
            />
        </div>
    );
}
