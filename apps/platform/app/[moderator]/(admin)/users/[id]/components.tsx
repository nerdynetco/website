"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistance } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import {
  AlertTriangle,
  AtSign,
  Copy,
  Fingerprint,
  GraduationCap,
  Laptop,
  Save,
  Shield,
  Smartphone,
  Trash2,
  UserCog
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { updateUser } from "~/actions/dashboard.admin";
import { deleteUserResourcesById } from "~/actions/user.core";
import { authClient } from "~/auth/client";
import { emailSchema, genderSchema, ROLES } from "~/constants";
import { DEPARTMENTS_LIST } from "~/constants/core.departments";
import type { users } from "~/db/schema";

// Types
type UserType = InferSelectModel<typeof users>;

// Updated Schema matching your table
const formSchema = z.object({
  // Identity
  username: z.string().min(3, "Username must be at least 3 characters"),
  displayUsername: z.string().optional(),
  
  // Academic
  gender: genderSchema,
  department: z.string({ required_error: "Department is required" }),
  
  // Access
  role: z.string(), // Primary Role
});

// ----------------------------------------------------------------------
// 1. PAGE HEADER
// ----------------------------------------------------------------------
export function UserHeader({ user }: { user: UserType }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b pb-6">
            <Avatar>
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {(user.name ?? "U")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono text-foreground/80">
                        <AtSign className="h-3.5 w-3.5 opacity-70" /> {user.username}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>{user.email}</span>
                    <Badge variant={user.emailVerified ? "outline" : "destructive"} className="h-5 text-[10px] ml-2">
                        {user.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                </div>
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// 2. SIDEBAR
// ----------------------------------------------------------------------
export function UserSidebar({ user }: { user: UserType }) {
    const handleImpersonate = async () => {
        const toastId = toast.loading("Switching identity...");
        try {
            await authClient.admin.impersonateUser({ userId: user.id });
            toast.success(`Now impersonating ${user.name}`, { id: toastId });
            window.location.href = "/dashboard"; 
        } catch (error) {
            toast.error("Impersonation failed", { id: toastId });
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure? This deletes ALL user data permanently.")) return;
        const toastId = toast.loading("Deleting user...");
        try {
            await deleteUserResourcesById(user.id);
            await authClient.admin.removeUser({ userId: user.id });
            toast.success("User deleted successfully", { id: toastId });
            window.location.href = "/admin/users";
        } catch (error) {
            toast.error("Failed to delete user", { id: toastId });
        }
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meta Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted/40 p-3 rounded-md border flex items-center justify-between gap-2">
                        <div className="space-y-0.5 overflow-hidden">
                            <p className="text-[10px] text-muted-foreground font-medium uppercase">User ID</p>
                            <p className="font-mono text-xs truncate" title={user.id}>{user.id}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => {
                            navigator.clipboard.writeText(user.id);
                            toast.success("Copied ID");
                        }}>
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b border-dashed">
                            <span className="text-muted-foreground">Created</span>
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-dashed">
                            <span className="text-muted-foreground">Updated</span>
                            <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/20 shadow-none bg-destructive/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-background hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={handleImpersonate}>
                        <UserCog className="h-4 w-4 mr-2" /> Impersonate
                    </Button>
                    <Button variant="destructive" className="w-full justify-start" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}



// ----------------------------------------------------------------------
// 5. SESSION MANAGER
// ----------------------------------------------------------------------
function SessionManager({ user }: { user: UserType }) {
    const [sessions, setSessions] = useState<any[]>([]);
    
    useEffect(() => {
        authClient.admin.listUserSessions({ userId: user.id })
            .then(res => setSessions(res.data?.sessions || []))
            .catch(console.error);
    }, [user.id]);

    const handleRevoke = (token: string) => {
        authClient.admin.revokeUserSession({ sessionToken: token })
            .then(() => {
                setSessions(prev => prev.filter(p => p.token !== token));
                toast.success("Session revoked");
            });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Active Devices</CardTitle>
                    <CardDescription>Manage sessions logged into {user.email}.</CardDescription>
                </div>
                {sessions.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => {
                        authClient.admin.revokeUserSessions({ userId: user.id })
                           .then(() => {
                               setSessions([]);
                               toast.success("All sessions revoked");
                           });
                    }}>
                        Revoke All
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/50">
                        <Shield className="h-10 w-10 mb-2 opacity-20" />
                        <p>No active sessions found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map(session => (
                            <div key={session.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        {session.userAgent?.toLowerCase().includes("mobile") ? 
                                            <Smartphone className="h-6 w-6" /> : 
                                            <Laptop className="h-6 w-6" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-md" title={session.userAgent}>
                                            {session.userAgent || "Unknown Device"}
                                        </p>
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                                            <span>IP: <span className="font-mono">{session.ipAddress}</span></span>
                                            <span>•</span>
                                            <span className={new Date() > new Date(session.expiresAt) ? "text-destructive" : "text-emerald-600"}>
                                                Expires {formatDistance(new Date(session.expiresAt), new Date(), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleRevoke(session.token)}
                                >
                                    Revoke
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}