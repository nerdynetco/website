"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import type { DiscoverProfile } from "~/actions/findr";
import confetti from "canvas-confetti";

interface MatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    matchedProfile: DiscoverProfile | null;
}

function getAvatarUrl(seed: string | null): string {
    return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed || "default"}&backgroundColor=transparent`;
}

export default function MatchModal({ isOpen, onClose, matchedProfile }: MatchModalProps) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Delay content for dramatic effect
            setTimeout(() => setShowContent(true), 200);

            // Trigger confetti
            const duration = 2000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ["#ec4899", "#8b5cf6", "#3b82f6"],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ["#ec4899", "#8b5cf6", "#3b82f6"],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        } else {
            setShowContent(false);
        }
    }, [isOpen]);

    if (!matchedProfile) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md overflow-hidden border-0 bg-gradient-to-br from-pink-500/90 via-purple-500/90 to-indigo-500/90 backdrop-blur-xl">
                <DialogTitle className="sr-only">It&apos;s a Match!</DialogTitle>

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                >
                    <X className="size-4" />
                </button>

                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex flex-col items-center py-6 text-white"
                        >
                            {/* Hearts Animation */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="relative mb-6"
                            >
                                <div className="absolute inset-0 animate-ping">
                                    <Heart className="size-16 text-white/30 fill-white/30" />
                                </div>
                                <Heart className="size-16 text-white fill-white" />
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-bold mb-2 text-center"
                            >
                                It&apos;s a Match!
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/80 text-center mb-8"
                            >
                                You and {matchedProfile.user.name || "this builder"} have liked each other
                            </motion.p>

                            {/* Avatar */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="relative mb-8"
                            >
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                                <img
                                    src={getAvatarUrl(matchedProfile.avatarSeed)}
                                    alt="Matched user avatar"
                                    className="relative size-32 rounded-full bg-white/10 p-3 ring-4 ring-white/30"
                                />
                            </motion.div>

                            {/* Matched User Info */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-center mb-8"
                            >
                                <h3 className="text-xl font-semibold">
                                    {matchedProfile.user.name || "Anonymous Builder"}
                                </h3>
                                {matchedProfile.user.username && (
                                    <p className="text-white/70">@{matchedProfile.user.username}</p>
                                )}
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="flex flex-col sm:flex-row gap-3 w-full"
                            >
                                <Button
                                    variant="secondary"
                                    className="flex-1 h-12 bg-white text-purple-600 hover:bg-white/90 font-semibold"
                                    onClick={() => {
                                        // TODO: Navigate to chat/connect
                                        onClose();
                                    }}
                                >
                                    <MessageCircle className="size-5 mr-2" />
                                    Send Message
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex-1 h-12 text-white hover:bg-white/20 font-semibold"
                                    onClick={onClose}
                                >
                                    Keep Swiping
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
