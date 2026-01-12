import { Badge } from "@/components/ui/badge";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

type HouseName = "KERNEL" | "FRACTAL" | "SIGNAL" | "VECTOR";

interface HouseBadgeProps {
  house: HouseName | string | null;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const houseColors: Record<HouseName, { bg: string; text: string; border: string; glow: string }> = {
  KERNEL: {
    bg: "bg-gradient-to-r from-red-500/15 to-orange-500/10 dark:from-red-500/25 dark:to-orange-500/15",
    text: "text-red-600 dark:text-red-300 font-semibold",
    border: "border-red-500/40 dark:border-red-400/30",
    glow: "shadow-[0_0_12px_-3px_rgba(239,68,68,0.4)]",
  },
  FRACTAL: {
    bg: "bg-gradient-to-r from-emerald-500/15 to-green-500/10 dark:from-emerald-500/25 dark:to-green-500/15",
    text: "text-emerald-600 dark:text-emerald-300 font-semibold",
    border: "border-emerald-500/40 dark:border-emerald-400/30",
    glow: "shadow-[0_0_12px_-3px_rgba(16,185,129,0.4)]",
  },
  SIGNAL: {
    bg: "bg-gradient-to-r from-blue-500/15 to-cyan-500/10 dark:from-blue-500/25 dark:to-cyan-500/15",
    text: "text-blue-600 dark:text-blue-300 font-semibold",
    border: "border-blue-500/40 dark:border-blue-400/30",
    glow: "shadow-[0_0_12px_-3px_rgba(59,130,246,0.4)]",
  },
  VECTOR: {
    bg: "bg-gradient-to-r from-amber-500/15 to-yellow-500/10 dark:from-amber-500/25 dark:to-yellow-500/15",
    text: "text-amber-600 dark:text-amber-300 font-semibold",
    border: "border-amber-500/40 dark:border-amber-400/30",
    glow: "shadow-[0_0_12px_-3px_rgba(245,158,11,0.4)]",
  },
};

const sizeClasses = {
  sm: "text-xs px-1.5 py-0.5 gap-1",
  md: "text-sm px-2 py-1 gap-1.5",
  lg: "text-base px-3 py-1.5 gap-2",
};

const iconSizes = {
  sm: "size-2.5",
  md: "size-3",
  lg: "size-3.5",
};

export default function HouseBadge({
  house,
  size = "sm",
  showIcon = true,
  className,
}: HouseBadgeProps) {
  if (!house) return null;

  const isValidHouse = house in houseColors;
  const colors = isValidHouse
    ? houseColors[house as HouseName]
    : {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
      glow: "",
    };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border transition-all duration-200 hover:scale-105",
        colors.bg,
        colors.text,
        colors.border,
        colors.glow,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Home className={iconSizes[size]} />}
      {house}
    </Badge>
  );
}

/**
 * Get house color classes for theming
 */
export function getHouseColors(house: HouseName | string | null) {
  if (!house || !(house in houseColors)) {
    return {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
      accent: "bg-accent",
    };
  }

  return houseColors[house as HouseName];
}

/**
 * House icon/emoji mapping
 */
export const houseEmojis: Record<HouseName, string> = {
  KERNEL: "🦁",
  FRACTAL: "🐍",
  SIGNAL: "🦅",
  VECTOR: "🦡",
};

export function getHouseEmoji(house: HouseName | string | null): string {
  if (!house || !(house in houseEmojis)) {
    return "🏠";
  }
  return houseEmojis[house as HouseName];
}
