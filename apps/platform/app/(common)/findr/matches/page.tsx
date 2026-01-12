import { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMatches, type MatchWithUser } from "~/actions/findr";
import HouseBadge, { getHouseEmoji } from "@/components/common/house-badge";
import { Users, Heart, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Matches | Findr",
    description: "Your co-founder matches",
};

function getAvatarUrl(seed: string | null): string {
    return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed || "default"}&backgroundColor=transparent`;
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
}

async function MatchesContent() {
    const matches = await getMatches();

    if (matches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-24 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Heart className="size-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    Keep swiping to find your perfect co-founder match!
                </p>
                <Button asChild>
                    <Link href="/findr">Start Swiping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}

function MatchCard({ match }: { match: MatchWithUser }) {
    const { matchedUser, matchedProfile } = match;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all group">
            <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={getAvatarUrl(matchedProfile?.avatarSeed || null)}
                            alt="Avatar"
                            className="size-20 rounded-xl bg-muted p-1.5"
                        />
                        {matchedUser.house && (
                            <div className="absolute -bottom-1 -right-1">
                                <span className="text-lg">{getHouseEmoji(matchedUser.house)}</span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                                {matchedUser.name || "Anonymous Builder"}
                            </h3>
                            {matchedUser.house && (
                                <HouseBadge house={matchedUser.house} size="sm" showIcon={false} />
                            )}
                        </div>

                        {matchedUser.username && (
                            <p className="text-sm text-muted-foreground mb-2">
                                @{matchedUser.username}
                            </p>
                        )}

                        {/* Skills preview */}
                        {matchedProfile && (matchedProfile.skills as string[])?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {(matchedProfile.skills as string[]).slice(0, 3).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                                {(matchedProfile.skills as string[]).length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{(matchedProfile.skills as string[]).length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Matched time */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            Matched {formatRelativeTime(match.matchedAt)}
                        </div>
                    </div>
                </div>

                {/* Action */}
                <div className="border-t p-3 bg-muted/30">
                    <Button variant="ghost" className="w-full justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <MessageCircle className="size-4" />
                        Send Message
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function MatchesSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <Skeleton className="size-20 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <div className="flex gap-1">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function MatchesPage() {
    return (
        <div className="container max-w-4xl py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Users className="size-8 text-pink-500" />
                        Your Matches
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Connect with your matched co-founders
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/findr">Keep Swiping</Link>
                </Button>
            </div>

            <Suspense fallback={<MatchesSkeleton />}>
                <MatchesContent />
            </Suspense>
        </div>
    );
}
