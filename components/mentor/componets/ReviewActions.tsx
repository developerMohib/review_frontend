"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { updateSubmissionStatusRequest } from "@/lib/apiServices/submissionServices";

export default function ReviewActions({
  submissionId,
  projectName,
}: {
  submissionId: string;
  projectName: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"approved" | "rejected" | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => { setStatus(null); setComment(""); };

  const submit = async () => {
    if (!status || !comment.trim()) return;
    try {
      setIsSubmitting(true);
      await updateSubmissionStatusRequest(submissionId, status, comment.trim());
      close();
      router.refresh(); // re-runs the server component → fresh data + stats
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        router.replace(`/login?callbackUrl=${encodeURIComponent("/dashboard/mentor")}`);
        return;
      }
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setStatus("approved")}>
          Approve
        </Button>
        <Button size="sm" variant="destructive" onClick={() => setStatus("rejected")}>
          Reject
        </Button>
      </div>

      <Dialog open={status !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>{status === "approved" ? "Approve" : "Reject"} Project</DialogTitle>
            <DialogDescription>
              You are about to {status}{" "}
              <span className="font-semibold text-foreground">{projectName}</span>.
              Please provide your feedback below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="review-comment" className="text-sm font-medium mb-2 block">
              Mentor Comments <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="review-comment"
              placeholder="Write your feedback here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="resize-none"
            />
            {!comment.trim() && (
              <p className="text-xs text-muted-foreground mt-1">Feedback is required to proceed.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={isSubmitting}>Cancel</Button>
            <Button
              onClick={submit}
              disabled={!comment.trim() || isSubmitting}
              className={status === "approved" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm {status === "approved" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}