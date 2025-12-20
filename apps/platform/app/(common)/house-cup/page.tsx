import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import HouseBadge, { getHouseEmoji } from "@/components/common/house-badge";
import { getWeeklyHouseLeaderboard, getAllTimeHouseStandings } from "~/actions/points";
import { Trophy, TrendingUp, Users, Calendar } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "House Cup",
  description: "Weekly and all-time house standings",
};

async function HouseCupContent() {
  const [weeklyStandings, allTimeStandings] = await Promise.all([
    getWeeklyHouseLeaderboard(),
    getAllTimeHouseStandings(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
          <Trophy className="size-10 text-yellow-500" />
          House Cup
        </h1>
        <p className="text-muted-foreground text-lg">
          Compete with your house to win the weekly cup
        </p>
      </div>

      {/* Weekly Leaderboard */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            This Week&apos;s Standings
          </CardTitle>
          <CardDescription>
            Week of {weeklyStandings[0]?.weekStart 
              ? new Date(weeklyStandings[0].weekStart).toLocaleDateString("en-US", { 
                  month: "long", 
                  day: "numeric" 
                })
              : "Current Week"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyStandings.length > 0 ? (
            <div className="space-y-4">
              {weeklyStandings.map((standing) => (
                <Link
                  key={standing.house}
                  href={`/house/${standing.house}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                    {/* Rank */}
                    <div className="flex items-center justify-center size-12 rounded-full bg-muted font-bold text-xl">
                      {standing.rank === 1 && "🥇"}
                      {standing.rank === 2 && "🥈"}
                      {standing.rank === 3 && "🥉"}
                      {standing.rank > 3 && standing.rank}
                    </div>

                    {/* House Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{getHouseEmoji(standing.house)}</span>
                        <h3 className="text-lg font-bold">{standing.house}</h3>
                        <HouseBadge house={standing.house} size="sm" showIcon={false} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {standing.memberCount} members
                        </span>
                        <span>
                          {standing.pointsPerMember} pts/member
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {standing.totalPoints}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="size-16 mx-auto mb-4 opacity-20" />
              <p>No activity this week yet</p>
              <p className="text-sm mt-1">Be the first to earn points for your house!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All-Time Standings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            All-Time Standings
          </CardTitle>
          <CardDescription>Total points earned since the beginning</CardDescription>
        </CardHeader>
        <CardContent>
          {allTimeStandings.length > 0 ? (
            <div className="space-y-3">
              {allTimeStandings.map((standing) => (
                <Link
                  key={standing.house}
                  href={`/house/${standing.house}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex items-center justify-center size-10 rounded-full bg-muted font-bold">
                      {standing.rank}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{getHouseEmoji(standing.house)}</span>
                      <span className="font-semibold">{standing.house}</span>
                      <HouseBadge house={standing.house} size="sm" showIcon={false} />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{standing.totalPoints}</div>
                      <div className="text-xs text-muted-foreground">total</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No points earned yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">💡 How to Earn Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">+5</Badge>
              <span>Log daily progress</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">+10</Badge>
              <span>Create a community post</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">+2</Badge>
              <span>Comment on posts</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">+1</Badge>
              <span>Like posts or comments</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">+20</Badge>
              <span>Achieve 7-day streak</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">+50</Badge>
              <span>Achieve 30-day streak</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">+150</Badge>
              <span>Achieve 100-day streak</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">+10</Badge>
              <span>Earn a badge</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HouseCupSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HouseCupPage() {
  return (
    <div className="container max-w-4xl py-8">
      <Suspense fallback={<HouseCupSkeleton />}>
        <HouseCupContent />
      </Suspense>
    </div>
  );
}
