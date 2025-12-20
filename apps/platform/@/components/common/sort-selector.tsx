"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, TrendingUp, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "new";

  const handleSort = (sort: "new" | "hot" | "top") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`?${params.toString()}`);
  };

  const sorts = [
    { value: "hot", label: "Hot", icon: Flame, color: "text-orange-500" },
    { value: "new", label: "New", icon: Clock, color: "text-blue-500" },
    { value: "top", label: "Top", icon: TrendingUp, color: "text-green-500" },
  ] as const;

  return (
    <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/50">
      {sorts.map((sort) => {
        const Icon = sort.icon;
        const isActive = currentSort === sort.value;
        
        return (
          <Button
            key={sort.value}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "gap-1.5 h-7 px-3 text-xs",
              !isActive && "hover:bg-background"
            )}
            onClick={() => handleSort(sort.value)}
          >
            <Icon className={cn("size-3", isActive ? "" : sort.color)} />
            {sort.label}
          </Button>
        );
      })}
    </div>
  );
}
