"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import HouseBadge, { getHouseEmoji } from "@/components/common/house-badge";
import { Code2, Briefcase, Sparkles, Github, Flame, Users } from "lucide-react";
import type { DiscoverProfile } from "~/actions/findr";

interface ProfileCardProps {
    profile: DiscoverProfile;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSuperLike?: () => void;
}

// Generate DiceBear avatar URL
function getAvatarUrl(seed: string | null, style: string = "bottts-neutral"): string {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed || "default"}&backgroundColor=transparent`;
}

// Role icon and color mapping
const roleConfig = {
    technical: {
        icon: Code2,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        label: "Technical",
    },
    "non-technical": {
        icon: Briefcase,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        label: "Non-Technical",
    },
    hybrid: {
        icon: Sparkles,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        label: "Hybrid",
    },
};

export default function ProfileCard({ profile }: ProfileCardProps) {
    const role = roleConfig[profile.role];
    const RoleIcon = role.icon;

    return (
        <Card className="w-full max-w-md overflow-hidden border-2 bg-gradient-to-b from-background to-muted/20 shadow-xl">
            <CardContent className="p-0">
                {/* Avatar Section */}
                <div className="relative h-56 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                    >
                        <img
                            src={getAvatarUrl(profile.avatarSeed, "bottts-neutral")}
                            alt="Avatar"
                            className="size-40 rounded-2xl bg-background/50 backdrop-blur-sm p-2 shadow-lg"
                        />
                        {/* GitHub Score Badge */}
                        {profile.githubScore && profile.githubScore > 0 && (
                            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-background border-2 border-green-500/30 px-2.5 py-1 text-xs font-bold shadow-md">
                                <Github className="size-3.5 text-green-500" />
                                <span className="text-green-600 dark:text-green-400">{profile.githubScore}</span>
                            </div>
                        )}
                    </motion.div>

                    {/* House Badge - Top Right */}
                    {profile.user.house && (
                        <div className="absolute top-3 right-3">
                            <HouseBadge house={profile.user.house} size="lg" />
                        </div>
                    )}

                    {/* Role Badge - Top Left */}
                    <div className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full ${role.bgColor} px-3 py-1.5`}>
                        <RoleIcon className={`size-4 ${role.color}`} />
                        <span className={`text-sm font-medium ${role.color}`}>{role.label}</span>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-5 space-y-4">
                    {/* Name & Username */}
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            {profile.user.name || "Anonymous Builder"}
                            {profile.user.house && (
                                <span className="text-lg">{getHouseEmoji(profile.user.house)}</span>
                            )}
                        </h3>
                        {profile.user.username && (
                            <p className="text-muted-foreground">@{profile.user.username}</p>
                        )}
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {profile.bio}
                        </p>
                    )}

                    {/* Skills */}
                    {profile.skills && (profile.skills as string[]).length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <Code2 className="size-3" /> Skills
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {(profile.skills as string[]).slice(0, 5).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                                {(profile.skills as string[]).length > 5 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{(profile.skills as string[]).length - 5}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Looking For */}
                    {profile.lookingFor && (profile.lookingFor as string[]).length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                <Users className="size-3" /> Looking for
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {(profile.lookingFor as string[]).slice(0, 4).map((item) => (
                                    <Badge key={item} variant="outline" className="text-xs border-primary/30 text-primary">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* GitHub Stats */}
                    {profile.githubUsername && (
                        <div className="flex items-center gap-4 pt-2 border-t">
                            <div className="flex items-center gap-1.5 text-sm">
                                <Github className="size-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{profile.githubCommits || 0} commits</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm">
                                <Flame className="size-4 text-orange-500" />
                                <span className="text-muted-foreground">{profile.githubPRs || 0} PRs</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
