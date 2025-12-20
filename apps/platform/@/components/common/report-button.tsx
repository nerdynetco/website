"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { useState, useTransition } from "react";
import { reportContent } from "~/actions/moderation";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportButtonProps {
  contentType: "post" | "comment" | "user";
  contentId: string;
  variant?: "ghost" | "outline" | "default";
}

export default function ReportButton({
  contentType,
  contentId,
  variant = "ghost",
}: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [reportType, setReportType] = useState<
    "spam" | "harassment" | "inappropriate" | "misinformation" | "other"
  >("spam");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reportType) {
      toast.error("Please select a report type");
      return;
    }

    startTransition(async () => {
      try {
        await reportContent(contentType, contentId, reportType, reason);
        toast.success("Report submitted successfully");
        setOpen(false);
        setReason("");
        setReportType("spam");
      } catch (error: any) {
        toast.error(error.message || "Failed to submit report");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" className="gap-1.5">
          <Flag className="size-3" />
          <span className="text-xs">Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report {contentType}</DialogTitle>
          <DialogDescription>
            Help us keep the community safe by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select
              value={reportType}
              onValueChange={(value: any) => setReportType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                <SelectItem value="misinformation">Misinformation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Additional Details (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide more context about why you're reporting this..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
