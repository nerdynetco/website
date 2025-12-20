"use server";

import { headers } from "next/headers";
import { auth } from "~/auth";
import { db } from "~/db";
import { reports, moderationActions } from "~/db/schema/moderation-schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Report content (post, comment, or user)
 */
export async function reportContent(
  contentType: "post" | "comment" | "user",
  contentId: string,
  reportType: "spam" | "harassment" | "inappropriate" | "misinformation" | "other",
  reason?: string
) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new Error("You need to be logged in to report content");
  }

  try {
    await db.insert(reports).values({
      contentType,
      contentId,
      reporterId: session.user.id,
      reportType,
      reason,
      status: "pending",
    });

    return { success: true, message: "Report submitted successfully" };
  } catch (error: any) {
    console.error("Failed to submit report:", error);
    throw new Error(error.message || "Failed to submit report");
  }
}

/**
 * Get all reports (moderators only)
 */
export async function getReports(status?: "pending" | "reviewing" | "resolved" | "dismissed") {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || (session.user.role !== "admin" && session.user.role !== "moderator")) {
    throw new Error("Unauthorized");
  }

  try {
    const query = status
      ? db.select().from(reports).where(eq(reports.status, status)).orderBy(desc(reports.createdAt))
      : db.select().from(reports).orderBy(desc(reports.createdAt));

    const allReports = await query;
    return allReports;
  } catch (error: any) {
    console.error("Failed to fetch reports:", error);
    throw new Error(error.message || "Failed to fetch reports");
  }
}

/**
 * Update report status (moderators only)
 */
export async function updateReportStatus(
  reportId: string,
  status: "pending" | "reviewing" | "resolved" | "dismissed",
  reviewNotes?: string
) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || (session.user.role !== "admin" && session.user.role !== "moderator")) {
    throw new Error("Unauthorized");
  }

  try {
    await db
      .update(reports)
      .set({
        status,
        reviewedBy: session.user.id,
        reviewNotes,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, reportId));

    revalidatePath("/moderation");

    return { success: true, message: "Report status updated" };
  } catch (error: any) {
    console.error("Failed to update report:", error);
    throw new Error(error.message || "Failed to update report");
  }
}

/**
 * Take moderation action (moderators only)
 */
export async function takeModerationAction(
  reportId: string,
  action: "removed" | "warned" | "banned" | "dismissed",
  reason?: string
) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || (session.user.role !== "admin" && session.user.role !== "moderator")) {
    throw new Error("Unauthorized");
  }

  try {
    // Record the action
    await db.insert(moderationActions).values({
      reportId,
      moderatorId: session.user.id,
      action,
      reason,
    });

    // Update report status
    await db
      .update(reports)
      .set({
        status: "resolved",
        reviewedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, reportId));

    revalidatePath("/moderation");

    return { success: true, message: `Action '${action}' taken successfully` };
  } catch (error: any) {
    console.error("Failed to take moderation action:", error);
    throw new Error(error.message || "Failed to take moderation action");
  }
}

/**
 * Get moderation stats (moderators only)
 */
export async function getModerationStats() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || (session.user.role !== "admin" && session.user.role !== "moderator")) {
    throw new Error("Unauthorized");
  }

  try {
    const allReports = await db.select().from(reports);

    const stats = {
      total: allReports.length,
      pending: allReports.filter((r) => r.status === "pending").length,
      reviewing: allReports.filter((r) => r.status === "reviewing").length,
      resolved: allReports.filter((r) => r.status === "resolved").length,
      dismissed: allReports.filter((r) => r.status === "dismissed").length,
    };

    return stats;
  } catch (error: any) {
    console.error("Failed to fetch moderation stats:", error);
    throw new Error(error.message || "Failed to fetch moderation stats");
  }
}
