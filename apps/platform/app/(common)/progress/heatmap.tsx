"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { Flame, TrendingUp, Calendar } from "lucide-react";
import { useTheme } from "next-themes";
import type { ProgressLogTypeWithId } from "~/models/progress";

interface ProgressHeatmapProps {
  logs: ProgressLogTypeWithId[];
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastLogDate: Date | null;
  };
}

export default function ProgressHeatmap({ logs, streak }: ProgressHeatmapProps) {
  const { theme } = useTheme();

  // Transform logs into activity data
  const activityData: Activity[] = transformLogsToActivity(logs);

  // Calculate total days with activity
  const totalActiveDays = new Set(
    logs.map((log) => new Date(log.date).toISOString().split("T")[0])
  ).size;

  // Calculate total logs
  const totalLogs = logs.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="size-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streak.currentStreak}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {streak.currentStreak === 1 ? "day" : "days"} in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="size-4 text-green-500" />
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streak.longestStreak}</div>
            <p className="text-xs text-muted-foreground mt-1">
              personal best
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="size-4 text-blue-500" />
              Active Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalActiveDays}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalLogs} total logs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>365-Day Progress Chart</CardTitle>
          <CardDescription>
            Your building activity over the last year
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityData.length > 0 ? (
            <div className="overflow-x-auto">
              <ActivityCalendar
                data={activityData}
                theme={{
                  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
                  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                }}
                colorScheme={theme === "dark" ? "dark" : "light"}
                blockSize={12}
                blockMargin={4}
                fontSize={14}
                labels={{
                  totalCount: "{{count}} logs in the last year",
                }}
                // Tooltip handled by default hover behavior
              />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No progress logged yet. Start building today! 🚀</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="size-3 rounded-sm"
                    style={{
                      backgroundColor:
                        theme === "dark"
                          ? ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"][level]
                          : ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"][level],
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Intensity: ⭐ (1) to ⭐⭐⭐⭐ (4)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Transform progress logs into activity calendar format
 */
function transformLogsToActivity(logs: ProgressLogTypeWithId[]): Activity[] {
  // Group logs by date and sum intensity
  const dateMap = new Map<string, number>();

  logs.forEach((log) => {
    const dateStr = new Date(log.date).toISOString().split("T")[0];
    const currentCount = dateMap.get(dateStr) || 0;
    dateMap.set(dateStr, currentCount + log.intensity);
  });

  // Convert to activity array
  const activities: Activity[] = [];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Fill in all dates in the last year
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = new Date(d).toISOString().split("T")[0];
    const count = dateMap.get(dateStr) || 0;
    
    activities.push({
      date: dateStr,
      count: count,
      level: count === 0 ? 0 : Math.min(Math.ceil(count / 2), 4), // Map intensity to level 0-4
    });
  }

  return activities;
}

/**
 * Loading skeleton for heatmap
 */
export function ProgressHeatmapSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-3 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
