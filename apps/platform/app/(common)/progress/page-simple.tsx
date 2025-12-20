import type { Metadata } from "next";
import { getSession } from "~/auth/server";
import { redirect } from "next/navigation";
import ProgressLogForm from "./log-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Progress Tracker",
  description: "Log your daily building progress",
};

export default async function ProgressPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/progress");
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
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

        {/* Info Card */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">💡 Pro Tip</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • Log progress daily to build your streak and unlock badges
            </p>
            <p>
              • Use quick log for fast updates or detailed form for more context
            </p>
            <p>
              • Your progress will be visible on your profile heatmap
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
