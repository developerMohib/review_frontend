"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";
import {
  PaginationData,
  Submission,
  SubmissionStats,
  SubmissionStatus,
} from "@/lib/validators/submission.validation";
import { getAllSubmissionsRequest, updateSubmissionStatusRequest } from "@/lib/api/submission";

export type FilterStatus = "all" | SubmissionStatus;

type PageNumber = number | "ellipsis";

export default function MentorDashboard() {
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const response = await getAllSubmissionsRequest({
          page: currentPage,
          limit: 10,
          status: statusFilter,
        });

        setSubmissions(response.submissions);
        setPagination(response.pagination);
        setStats(response.stats);
      } catch (error) {
        console.error("Failed to load submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentPage, statusFilter]);

  const handleStatusUpdate = async (
  submissionId: string,
  newStatus: "approved" | "rejected"
) => {
  try {
    setLoading(true);

    await updateSubmissionStatusRequest(submissionId, newStatus);

    const response = await getAllSubmissionsRequest({
      page: currentPage,
      limit: 10,
      status: statusFilter,
    });
console.log(response)
    setSubmissions(response.submissions);
    setPagination(response.pagination);
    setStats(response.stats);
  } catch (error) {
    console.error("Failed to update submission status:", error);
  } finally {
    setLoading(false);
  }
};

  const getRangeStart = () => {
    if (pagination.total === 0) return 0;
    return (currentPage - 1) * pagination.limit + 1;
  };

  const getRangeEnd = () => {
    return Math.min(currentPage * pagination.limit, pagination.total);
  };

  const getPageNumbers = (): PageNumber[] => {
    const { totalPages } = pagination;

    if (totalPages <= 0) return [];

    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: PageNumber[] = [1];

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pages.push("ellipsis");
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  if (loading && submissions.length === 0) {
    return (
      <div
        className="dashboard-loading flex flex-col items-center justify-center h-64"
        role="status"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">Loading project reviews...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page mentor-review-page space-y-6">
      <div className="page-heading">
        <div>
          <div className="eyebrow flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="eyebrow-dot w-2 h-2 rounded-full bg-primary" />
            MENTOR WORKSPACE
          </div>

          <h1 className="text-2xl font-bold mt-1">Review projects</h1>
          <p className="text-muted-foreground mt-1">
            Explore student work and help each project move forward.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="review-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submissions"
          value={stats.total}
          indicatorColor="text-blue-600"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          indicatorColor="text-amber-600"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          indicatorColor="text-green-600"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          indicatorColor="text-red-600"
        />
      </div>

      {/* Controls */}
      <div className="review-controls flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Review queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse submissions and their current status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filter by status
          </span>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as FilterStatus);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="review-table-wrap border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Project Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No submissions found for this filter.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <span>{submission.projectName}</span>

                      <a
                        href={submission.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-orange-600 hover:underline"
                      >
                        View Repo
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {submission.category || "N/A"}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={submission.status} />
                  </TableCell>

                  <TableCell className="text-right">
                    {submission.status.toUpperCase() === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() =>
                            handleStatusUpdate(submission.id, "approved")
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleStatusUpdate(submission.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Reviewed
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {getRangeStart()}–{getRangeEnd()}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {pagination.total}
          </span>{" "}
          results
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || loading}
          >
            First
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((previous) => Math.max(1, previous - 1))
            }
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>

          {getPageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm" 
                onClick={() => setCurrentPage(page)}
                disabled={loading}
                className={`"min-w-[36px]" ${page=== currentPage ? "text-orange-700": "text-black"}`}
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((previous) =>
                Math.min(pagination.totalPages, previous + 1)
              )
            }
            disabled={
              currentPage === pagination.totalPages ||
              pagination.totalPages === 0 ||
              loading
            }
          >
            Next
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(pagination.totalPages)}
            disabled={
              currentPage === pagination.totalPages ||
              pagination.totalPages === 0 ||
              loading
            }
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  indicatorColor,
}: {
  title: string;
  value: number;
  indicatorColor: string;
}) {
  return (
    <Card className="review-stat-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className={`text-2xl font-bold ${indicatorColor}`}>{value}</div>
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
    <Badge
      variant="outline"
      className={`status-badge ${statusClasses[upperStatus] || ""} capitalize`}
    >
      {status.toLowerCase()}
    </Badge>
  );
}