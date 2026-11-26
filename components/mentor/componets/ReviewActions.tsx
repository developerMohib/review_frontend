"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { updateSubmissionStatusRequest } from "@/lib/apiServices/submissionServices";

interface ReviewActionsProps {
  submissionId: string;
  projectName: string;
}

export default function ReviewActions({
  submissionId,
  projectName,
}: ReviewActionsProps) {
  const router = useRouter();

  const [status, setStatus] = useState<"approved" | "rejected" | null>(
    null
  );

  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setStatus(null);
    setComment("");
    setError("");
  };

  const submit = async () => {
    if (!status || !comment.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");

      await updateSubmissionStatusRequest(
        submissionId,
        status,
        comment.trim()
      );

      close();

      router.refresh();
    } catch (error) {
      console.error("Error submitting review:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={() => setStatus("approved")}
        >
          Approve
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => setStatus("rejected")}
        >
          Reject
        </Button>
      </section>

      <Dialog
        open={status !== null}
        onOpenChange={(open) => !open && close()}
      >
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>
              {status === "approved" ? "Approve" : "Reject"} Project
            </DialogTitle>

            <DialogDescription>
              You are about to {status}{" "}
              <span className="font-semibold text-foreground">
                {projectName}
              </span>
              . Please provide your feedback below.
            </DialogDescription>
          </DialogHeader>

          <section className="space-y-2 py-4">
            <label
              htmlFor="review-comment"
              className="text-sm font-medium"
            >
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

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {!comment.trim() && (
              <p className="text-xs text-muted-foreground">
                Feedback is required to proceed.
              </p>
            )}
          </section>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={close}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              onClick={submit}
              disabled={!comment.trim() || isSubmitting}
              className={
                status === "approved"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : ""
              }
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Confirm {status === "approved" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}