import type { Metadata } from "next";
import { getSession } from "~/auth/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ProgressHeatmap, { ProgressHeatmapSkeleton } from "app/(common)/progress/heatmap";
import { getYearProgressLogs, calculateStreak } from "~/actions/progress";
import { getUserBadges, getBadgeProgress } from "~/actions/badges";
import dbConnect from "~/lib/dbConnect";
import ProgressLog from "~/models/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import HouseBadge from "@/components/common/house-badge";
import BadgeDisplay, { BadgeProgress } from "@/components/common/badge-display";
import { db } from "~/db/connect";
import { users } from "~/db/schema/auth-schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your builder profile and progress",
};

async function ProfileContent({ userId }: { userId: string }) {
  // Fetch user data
  const userData = await db
    .select({
      name: users.name,
      username: users.username,
      email: users.email,
      image: users.image,
      house: users.house,
      createdAt: users.createdAt,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userData || userData.length === 0) {
    redirect("/auth/sign-in");
  }

  const user = userData[0];

  // Fetch progress data
  await dbConnect();
  const totalLogs = await ProgressLog.countDocuments({ userId });
  
  const [logs, streak, badges] = await Promise.all([
    getYearProgressLogs(userId),
    calculateStreak(userId),
    getUserBadges(userId),
  ]);
  
  const badgeProgress = await getBadgeProgress(userId, streak.currentStreak, totalLogs);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="size-24 border-4 border-border">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? "User avatar"}
              />
              <AvatarFallback className="text-2xl">
                {(user.name ?? "User")
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.house && <HouseBadge house={user.house} size="md" />}
                <Badge variant="outline" className="gap-1">
                  <User className="size-3" />
                  {user.role}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="size-3" />
                  Builder since {memberSince}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <BadgeDisplay badges={badges} />

      {/* Badge Progress */}
      <BadgeProgress progress={badgeProgress} />

      {/* Progress Heatmap */}
      <ProgressHeatmap logs={logs} streak={streak} />
    </div>
  );
}

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/profile");
  }

  return (
    <div className="container max-w-6xl py-8">
      <Suspense fallback={<ProgressHeatmapSkeleton />}>
        <ProfileContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
