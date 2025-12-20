import { Badge } from "@/components/ui/badge";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

type HouseName = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

interface HouseBadgeProps {
  house: HouseName | string | null;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const houseColors: Record<HouseName, { bg: string; text: string; border: string }> = {
  Gryffindor: {
    bg: "bg-red-500/10 dark:bg-red-500/20",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/30",
  },
  Slytherin: {
    bg: "bg-green-500/10 dark:bg-green-500/20",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-500/30",
  },
  Ravenclaw: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/30",
  },
  Hufflepuff: {
    bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-500/30",
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
      };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        colors.bg,
        colors.text,
        colors.border,
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
  Gryffindor: "🦁",
  Slytherin: "🐍",
  Ravenclaw: "🦅",
  Hufflepuff: "🦡",
};

export function getHouseEmoji(house: HouseName | string | null): string {
  if (!house || !(house in houseEmojis)) {
    return "🏠";
  }
  return houseEmojis[house as HouseName];
}
