import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { getReports, getModerationStats } from "~/actions/moderation";
import { getSession } from "~/auth/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function ModerationDashboard(props: {
  searchParams: Promise<{
    status?: "pending" | "reviewing" | "resolved" | "dismissed";
  }>;
}) {
  const session = await getSession();
  
  // Check if user is moderator or admin
  if (!session || (session.user.role !== "admin" && session.user.role !== "moderator")) {
    redirect("/community");
  }

  const searchParams = await props.searchParams;
  const statusFilter = searchParams.status;

  const stats = await getModerationStats();
  const reports = await getReports(statusFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="size-4 text-yellow-500" />;
      case "reviewing":
        return <AlertTriangle className="size-4 text-orange-500" />;
      case "resolved":
        return <CheckCircle className="size-4 text-green-500" />;
      case "dismissed":
        return <XCircle className="size-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "spam":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "harassment":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "inappropriate":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "misinformation":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-lg border bg-primary/10 text-primary">
          <Shield className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Moderation Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage reports and keep the community safe
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Shield className="size-8 text-muted-foreground/50" />
          </div>
        </Card>
        <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <Clock className="size-8 text-yellow-500/50" />
          </div>
        </Card>
        <Card className="p-4 border-orange-500/20 bg-orange-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400">Reviewing</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.reviewing}</p>
            </div>
            <AlertTriangle className="size-8 text-orange-500/50" />
          </div>
        </Card>
        <Card className="p-4 border-green-500/20 bg-green-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Resolved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
            </div>
            <CheckCircle className="size-8 text-green-500/50" />
          </div>
        </Card>
        <Card className="p-4 border-gray-500/20 bg-gray-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dismissed</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.dismissed}</p>
            </div>
            <XCircle className="size-8 text-gray-500/50" />
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={!statusFilter ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/moderation">All Reports</Link>
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/moderation?status=pending">Pending</Link>
        </Button>
        <Button
          variant={statusFilter === "reviewing" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/moderation?status=reviewing">Reviewing</Link>
        </Button>
        <Button
          variant={statusFilter === "resolved" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/moderation?status=resolved">Resolved</Link>
        </Button>
        <Button
          variant={statusFilter === "dismissed" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/moderation?status=dismissed">Dismissed</Link>
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <Card className="p-12 text-center">
            <Shield className="size-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No reports found</h3>
            <p className="text-sm text-muted-foreground">
              {statusFilter
                ? `No ${statusFilter} reports at the moment.`
                : "No reports have been submitted yet."}
            </p>
          </Card>
        ) : (
          reports.map((report: any) => (
            <Card key={report.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <Badge variant="outline" className={getReportTypeColor(report.reportType)}>
                      {report.reportType}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {report.contentType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {report.reason && (
                    <p className="text-sm text-muted-foreground">{report.reason}</p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Reporter: {report.reporterId}</span>
                    {report.reviewedBy && (
                      <span>• Reviewed by: {report.reviewedBy}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/community/posts/${report.contentId}`} target="_blank">
                      View Content
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={`/moderation/${report.id}`}>
                      Review
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
