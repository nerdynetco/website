"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SwipeDeck from "./components/swipe-deck";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Heart, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { DiscoverProfile } from "~/actions/findr";
import type { FindrProfileType } from "~/db/schema/findr-schema";
import { updateLastActive } from "~/actions/findr";

interface FindrMainClientProps {
    profile: FindrProfileType;
    discoverProfiles: DiscoverProfile[];
}

export default function FindrMainClient({ profile, discoverProfiles }: FindrMainClientProps) {
    const router = useRouter();

    // Update last active on mount
    useEffect(() => {
        updateLastActive().catch(console.error);
    }, []);

    const handleEmpty = () => {
        // Refresh to get more profiles
        router.refresh();
    };

    return (
        <div className="container max-w-lg py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        Findr
                    </h1>
                    <Badge variant="secondary" className="text-xs">
                        {profile.isActive ? "Active" : "Paused"}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/findr/matches">
                            <Heart className="size-5" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/findr/profile">
                            <Settings className="size-5" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Profile status */}
            {!profile.isActive && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm">
                    <p className="font-medium">Your profile is paused</p>
                    <p className="text-xs mt-1 opacity-80">
                        Others can&apos;t see you. Go to settings to resume matching.
                    </p>
                </div>
            )}

            {/* Swipe Deck or Empty State */}
            {discoverProfiles.length > 0 ? (
                <SwipeDeck initialProfiles={discoverProfiles} onEmpty={handleEmpty} />
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="size-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                        <Sparkles className="size-12 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">You&apos;ve seen everyone!</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Check back later or adjust your preferences to see more builders.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => router.refresh()}>
                            <RefreshCw className="size-4 mr-2" />
                            Refresh
                        </Button>
                        <Button asChild>
                            <Link href="/findr/matches">
                                <Users className="size-4 mr-2" />
                                View Matches
                            </Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Bottom nav hint */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg">
                <Link
                    href="/findr"
                    className="flex flex-col items-center gap-0.5 text-primary"
                >
                    <Heart className="size-5 fill-current" />
                    <span className="text-[10px] font-medium">Discover</span>
                </Link>
                <Link
                    href="/findr/matches"
                    className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Users className="size-5" />
                    <span className="text-[10px]">Matches</span>
                </Link>
                <Link
                    href="/findr/profile"
                    className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Settings className="size-5" />
                    <span className="text-[10px]">Profile</span>
                </Link>
            </div>
        </div>
    );
}
