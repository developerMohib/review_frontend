"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

import {
  PaginationData,
  Submission,
  SubmissionStats,
  SubmissionStatus,
} from "@/lib/validators/submission.validation";
import { getAllSubmissionsRequest, updateSubmissionStatusRequest } from "@/lib/api/submission";
import { getPublicErrorMessage } from "@/lib/api/errors.public";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export type FilterStatus = "all" | SubmissionStatus;
type PageNumber = number | "ellipsis";

export default function MentorDashboard() {
  const router = useRouter();
  
  // Existing States
  const [stats, setStats] = useState<SubmissionStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // New Dialog States
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    submissionId: string | null;
    status: "approved" | "rejected" | null;
    projectName: string;
  }>({ open: false, submissionId: null, status: null, projectName: "" });
  
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnauthorized = useCallback(() => {
    setSessionExpired(true);
    setLoadError(null);
    setSubmissions([]);
    setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
    setPagination({ total: 0, page: 1, limit: 10, totalPages: 1 });
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      setSessionExpired(false);
      try {
        const response = await getAllSubmissionsRequest({ page: currentPage, limit: 10, status: statusFilter });
        if (!active) return;
        setSubmissions(response.submissions);
        setPagination(response.pagination);
        setStats(response.stats);
      } catch (error) {
        if (active) {
          if (isAxiosError(error) && error.response?.status === 401) {
            handleUnauthorized();
            return;
          }
          setLoadError(getPublicErrorMessage(error));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [currentPage, handleUnauthorized, retryCount, statusFilter]);

  // Dialog Handlers
  const openReviewDialog = (submissionId: string, status: "approved" | "rejected", projectName: string) => {
    setReviewDialog({ open: true, submissionId, status, projectName });
    setCommentText("");
  };

  const closeReviewDialog = () => {
    setReviewDialog({ open: false, submissionId: null, status: null, projectName: "" });
    setCommentText("");
  };

  const submitReview = async () => {
    if (!reviewDialog.submissionId || !reviewDialog.status || !commentText.trim()) return;

    try {
      setIsSubmitting(true);
      await updateSubmissionStatusRequest(reviewDialog.submissionId, reviewDialog.status, commentText.trim());

      const response = await getAllSubmissionsRequest({ page: currentPage, limit: 10, status: statusFilter });
      setSubmissions(response.submissions);
      setPagination(response.pagination);
      setStats(response.stats);
      setLoadError(null);
      closeReviewDialog();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      setLoadError(getPublicErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRangeStart = () => (pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1);
  const getRangeEnd = () => Math.min(currentPage * pagination.limit, pagination.total);

  const getPageNumbers = (): PageNumber[] => {
    const { totalPages } = pagination;
    if (totalPages <= 0) return [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const pages: PageNumber[] = [1];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    if (startPage > 2) pages.push("ellipsis");
    for (let page = startPage; page <= endPage; page++) pages.push(page);
    if (endPage < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">Loading project reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-primary" />
          MENTOR WORKSPACE
        </div>
        <h1 className="text-2xl font-bold mt-1">Review projects</h1>
        <p className="text-muted-foreground mt-1">Explore student work and help each project move forward.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Submissions" value={stats.total} color="text-blue-600" />
        <StatCard title="Pending Review" value={stats.pending} color="text-amber-600" />
        <StatCard title="Approved" value={stats.approved} color="text-green-600" />
        <StatCard title="Rejected" value={stats.rejected} color="text-red-600" />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Review queue</h2>
          <p className="text-sm text-muted-foreground">Browse submissions and their current status.</p>
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as FilterStatus); setCurrentPage(1); }}>
          <SelectTrigger className="w-45"><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error / Session Expired */}
      {(sessionExpired || loadError) && (
        <div className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-destructive">
            {sessionExpired ? "Session expired. Sign in again." : `Error: ${loadError}`}
          </p>
          {sessionExpired ? (
            <Button variant="outline" size="sm" onClick={() => router.replace(`/login?callbackUrl=${encodeURIComponent("/dashboard/mentor")}`)}>Sign in</Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setRetryCount((c) => c + 1)} disabled={loading}>Retry</Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-75">Project Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
            ) : submissions.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No submissions found.</TableCell></TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <span>{sub.projectName}</span>
                      <a href={sub.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-600 hover:underline">
                        View Repo <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{sub.category || "N/A"}</TableCell>
                  <TableCell><StatusBadge status={sub.status} /></TableCell>
                  <TableCell className="text-right">
                    {sub.status.toUpperCase() === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => openReviewDialog(sub.id, "approved", sub.projectName)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => openReviewDialog(sub.id, "rejected", sub.projectName)}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Reviewed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (আপনার আগের কোড) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{getRangeStart()}–{getRangeEnd()}</span> of <span className="font-medium">{pagination.total}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || loading}>First</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1 || loading}>Previous</Button>
          {getPageNumbers().map((page, i) =>
            page === "ellipsis" ? <span key={`e-${i}`} className="px-2">…</span> : (
              <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} disabled={loading} className={page === currentPage ? "text-orange-700" : "text-black"}>
                {page}
              </Button>
            )
          )}
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={currentPage === pagination.totalPages || loading}>Next</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(pagination.totalPages)} disabled={currentPage === pagination.totalPages || loading}>Last</Button>
        </div>
      </div>

      {/* Review Feedback Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => !open && closeReviewDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.status === "approved" ? "Approve" : "Reject"} Project
            </DialogTitle>
            <DialogDescription>
              You are about to {reviewDialog.status}{" "}
              <span className="font-semibold text-foreground">{reviewDialog.projectName}</span>. 
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
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={5}
              className="resize-none"
            />
            {!commentText.trim() && (
              <p className="text-xs text-muted-foreground mt-1">Feedback is required to proceed.</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeReviewDialog} disabled={isSubmitting}>Cancel</Button>
            <Button
              onClick={submitReview}
              disabled={!commentText.trim() || isSubmitting}
              className={reviewDialog.status === "approved" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm {reviewDialog.status === "approved" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const upperStatus = status.toUpperCase();
  const statusClasses: Record<string, string> = {
    pending: "status-pending",
    approved: "status-approved",
    rejected: "status-changes",
  };
  return (
    <Badge variant="outline" className={`status-badge ${statusClasses[upperStatus] || ""} capitalize`}>
      {status.toLowerCase()}
    </Badge>
  );
}