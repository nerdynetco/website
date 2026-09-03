"use client";

import dynamic from "next/dynamic";
import type { ProgressLogTypeWithId } from "~/models/progress";
import ProgressHeatmapSkeleton from "./heatmap-skeleton";

const ProgressHeatmap = dynamic(() => import("./heatmap"), {
  ssr: false,
  loading: () => <ProgressHeatmapSkeleton />,
});

export default function ProgressHeatmapLazy({
  logs,
  streak,
}: {
  logs: ProgressLogTypeWithId[];
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastLogDate: Date | null;
  };
}) {
  return <ProgressHeatmap logs={logs} streak={streak} />;
}
