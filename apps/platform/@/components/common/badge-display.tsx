import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeItem {
  id?: number;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  awardedAt?: Date | string;
}

interface BadgeDisplayProps {
  badges: BadgeItem[];
  showTitle?: boolean;
  compact?: boolean;
}

export default function BadgeDisplay({ badges, showTitle = true, compact = false }: BadgeDisplayProps) {
  if (badges.length === 0 && !showTitle) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <div
            key={badge.id || index}
            className="group relative"
            title={`${badge.title}: ${badge.description}`}
          >
            <div className="size-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-md hover:scale-110 transition-transform">
              {badge.icon}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-yellow-500" />
            Badges
          </CardTitle>
          <CardDescription>
            {badges.length > 0
              ? `Earned ${badges.length} ${badges.length === 1 ? "badge" : "badges"}`
              : "Complete challenges to earn badges"}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={badge.id || index}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="size-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
                  {badge.icon}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{badge.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.description}
                  </p>
                  {badge.awardedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(badge.awardedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="size-12 mx-auto mb-3 opacity-20" />
            <p>No badges earned yet</p>
            <p className="text-sm mt-1">Keep building to unlock achievements!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BadgeProgressProps {
  progress: {
    badge: {
      name: string;
      title: string;
      description: string;
      icon: string;
      requirement: number | null;
    };
    earned: boolean;
    progress: number;
    total: number;
  }[];
}

export function BadgeProgress({ progress }: BadgeProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="size-5 text-yellow-500" />
          Badge Progress
        </CardTitle>
        <CardDescription>Track your progress towards earning badges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progress.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center text-xl",
                      item.earned
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                        : "bg-muted"
                    )}
                  >
                    {item.earned ? item.badge.icon : <Lock className="size-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.badge.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.badge.description}
                    </p>
                  </div>
                </div>
                <Badge variant={item.earned ? "default" : "outline"}>
                  {item.progress}/{item.total}
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    item.earned
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                      : "bg-primary"
                  )}
                  style={{ width: `${(item.progress / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
