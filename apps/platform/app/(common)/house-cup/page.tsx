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
              {weeklyStandings.map((standing) => {
                const houseGradients: Record<string, string> = {
                  KERNEL: "from-red-500/10 via-transparent to-transparent border-red-500/20",
                  FRACTAL: "from-emerald-500/10 via-transparent to-transparent border-emerald-500/20",
                  SIGNAL: "from-blue-500/10 via-transparent to-transparent border-blue-500/20",
                  VECTOR: "from-amber-500/10 via-transparent to-transparent border-amber-500/20",
                };
                const gradient = houseGradients[standing.house] || "";

                return (
                  <Link
                    key={standing.house}
                    href={`/house/${standing.house}`}
                    className="block group"
                  >
                    <div className={`relative flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r ${gradient} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}>
                      {/* Rank */}
                      <div className="flex items-center justify-center size-12 rounded-xl bg-background/50 backdrop-blur font-bold text-xl shadow-sm">
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
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          {standing.totalPoints}
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
              {allTimeStandings.map((standing) => {
                const houseGradients: Record<string, string> = {
                  KERNEL: "from-red-500/5 to-transparent border-red-500/15",
                  FRACTAL: "from-emerald-500/5 to-transparent border-emerald-500/15",
                  SIGNAL: "from-blue-500/5 to-transparent border-blue-500/15",
                  VECTOR: "from-amber-500/5 to-transparent border-amber-500/15",
                };
                const gradient = houseGradients[standing.house] || "";

                return (
                  <Link
                    key={standing.house}
                    href={`/house/${standing.house}`}
                    className="block"
                  >
                    <div className={`flex items-center gap-4 p-3 rounded-lg border bg-gradient-to-r ${gradient} hover:shadow-md transition-all duration-200`}>
                      <div className="flex items-center justify-center size-10 rounded-lg bg-background/50 font-bold">
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
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No points earned yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="text-base">💡</span> How to Earn Points
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { points: 5, action: "Log progress", icon: "📝" },
            { points: 10, action: "Community post", icon: "✍️" },
            { points: 2, action: "Comment", icon: "💬" },
            { points: 1, action: "Like", icon: "❤️" },
            { points: 20, action: "7-day streak", icon: "🔥" },
            { points: 50, action: "30-day streak", icon: "⚡" },
            { points: 150, action: "100-day streak", icon: "🏆" },
            { points: 10, action: "Earn badge", icon: "🎖️" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50 border border-border/50 text-sm hover:bg-muted transition-colors"
            >
              <span>{item.icon}</span>
              <span className="text-muted-foreground">{item.action}</span>
              <span className="font-semibold text-primary">+{item.points}</span>
            </div>
          ))}
        </div>
      </div>
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
