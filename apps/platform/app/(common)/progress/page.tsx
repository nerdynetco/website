import type { Metadata } from "next";
import { getSession } from "~/auth/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ProgressLogForm from "./log-form";
import ProgressHeatmap, { ProgressHeatmapSkeleton } from "./heatmap";
import { getYearProgressLogs, calculateStreak } from "~/actions/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Progress Tracker",
  description: "Log your daily building progress",
};

async function ProgressStats({ userId }: { userId: string }) {
  const [logs, streak] = await Promise.all([
    getYearProgressLogs(userId),
    calculateStreak(userId),
  ]);

  return <ProgressHeatmap logs={logs} streak={streak} />;
}

export default async function ProgressPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/progress");
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="size-8" />
            Progress Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your daily building progress and maintain your streak
          </p>
        </div>

        {/* Progress Form */}
        <ProgressLogForm />

        <Separator className="my-8" />

        {/* Progress Stats & Heatmap */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Progress</h2>
          <Suspense fallback={<ProgressHeatmapSkeleton />}>
            <ProgressStats userId={session.user.id} />
          </Suspense>
        </div>

        {/* Info Card */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • Log progress daily to build your streak and unlock badges
            </p>
            <p>
              • Use quick log for fast updates or detailed form for more context
            </p>
            <p>
              • Your progress heatmap shows intensity with darker colors
            </p>
            <p>
              • Keep your streak alive - even small progress counts!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
