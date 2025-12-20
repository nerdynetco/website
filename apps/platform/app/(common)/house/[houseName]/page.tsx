import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import HouseBadge, { getHouseEmoji, getHouseColors } from "@/components/common/house-badge";
import { getHouseDetails, getHouseMembers, getHouseLeaderboard } from "~/actions/house";
import { getHouseTopContributors } from "~/actions/points";
import { Users, TrendingUp, MessageSquare, Calendar, Trophy } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{
    houseName: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { houseName } = await params;
  return {
    title: `${houseName} House`,
    description: `${houseName} house profile, members, and activity`,
  };
}

async function HouseContent({ houseName }: { houseName: string }) {
  const [houseDetails, members, leaderboard, topContributors] = await Promise.all([
    getHouseDetails(houseName),
    getHouseMembers(houseName, 12),
    getHouseLeaderboard(houseName, 5),
    getHouseTopContributors(houseName, 5),
  ]);

  const colors = getHouseColors(houseName);
  const emoji = getHouseEmoji(houseName);

  return (
    <div className="space-y-6">
      {/* House Header */}
      <Card className={`border-2 ${colors.border}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{emoji}</span>
                <div>
                  <CardTitle className="text-3xl">{houseDetails.name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {houseDetails.description || "A proud house of builders"}
                  </CardDescription>
                </div>
              </div>
            </div>
            <HouseBadge house={houseName} size="lg" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="size-4" />
                <span>Members</span>
              </div>
              <div className="text-2xl font-bold mt-1">{houseDetails.memberCount}</div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MessageSquare className="size-4" />
                <span>Posts (7d)</span>
              </div>
              <div className="text-2xl font-bold mt-1">{houseDetails.weeklyPosts}</div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <TrendingUp className="size-4" />
                <span>Progress (7d)</span>
              </div>
              <div className="text-2xl font-bold mt-1">{houseDetails.weeklyProgress}</div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="size-4" />
                <span>Total Posts</span>
              </div>
              <div className="text-2xl font-bold mt-1">{houseDetails.totalPosts}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-yellow-500" />
              Top Contributors This Week
            </CardTitle>
            <CardDescription>Members earning the most points for the house</CardDescription>
          </CardHeader>
          <CardContent>
            {topContributors.length > 0 ? (
              <div className="space-y-4">
                {topContributors.map((contributor) => (
                  <div key={contributor.userId} className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-muted font-bold text-sm">
                      {contributor.rank === 1 && "🥇"}
                      {contributor.rank === 2 && "🥈"}
                      {contributor.rank === 3 && "🥉"}
                      {contributor.rank > 3 && contributor.rank}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/profile/${contributor.username}`}
                        className="font-medium hover:underline"
                      >
                        {contributor.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        @{contributor.username}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{contributor.totalPoints}</div>
                      <div className="text-xs text-muted-foreground">
                        points
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No activity yet. Be the first!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Members
            </CardTitle>
            <CardDescription>
              {houseDetails.memberCount} builders in this house
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {members.map((member) => (
                <Link
                  key={member.id}
                  href={`/profile/${member.username}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                <Avatar className="size-12 border-2 border-border">
                  <AvatarImage
                    src={member.image ?? undefined}
                    alt={member.name ?? "User avatar"}
                  />
                  <AvatarFallback>
                    {(member.name ?? "User")
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                  <div className="text-center">
                    <p className="text-sm font-medium truncate max-w-full">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      @{member.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {houseDetails.memberCount > members.length && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                and {houseDetails.memberCount - members.length} more...
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* House Feed Link */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              View posts and discussions from {houseName} members
            </p>
            <Link
              href={`/community?house=${houseName}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <MessageSquare className="size-4" />
              View House Feed
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HouseContentSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

export default async function HousePage({ params }: Props) {
  const { houseName } = await params;

  // Validate house name
  const validHouses = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];
  if (!validHouses.includes(houseName)) {
    notFound();
  }

  return (
    <div className="container max-w-6xl py-8">
      <Suspense fallback={<HouseContentSkeleton />}>
        <HouseContent houseName={houseName} />
      </Suspense>
    </div>
  );
}
