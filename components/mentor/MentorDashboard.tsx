"use client";

import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
import { Submission } from "@/lib/validators/submission.validation";
import { getAllSubmissionsRequest } from "@/lib/api/submission";


type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function ReviewDashboard() {
  const stats: SubmissionStats = { total: 0, pending: 0, approved: 0, rejected: 0 };
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  useEffect(() => {
    const load = async () => {
      try {
        const { submissions } = await getAllSubmissionsRequest();
        setSubmissions(submissions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setLoading, setSubmissions]);

  const handleStatusUpdate = async (
    submissionId: string,
    newStatus: "APPROVED" | "REJECTED",
  ): Promise<void> => {
    void submissionId;
    void newStatus;
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="dashboard-loading" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p>Loading project reviews...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page mentor-review-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" /> MENTOR WORKSPACE
          </div>
          <h1>Review projects</h1>
          <p>Explore student work and help each project move forward.</p>
        </div>
      </div>

      <div className="review-stats">
        <StatCard title="Total Submissions" value={stats.total} indicatorColor="text-blue-600" />
        <StatCard title="Pending Review" value={stats.pending} indicatorColor="text-amber-600" />
        <StatCard title="Approved" value={stats.approved} indicatorColor="text-green-600" />
        <StatCard title="Rejected" value={stats.rejected} indicatorColor="text-red-600" />
      </div>

      <div className="review-controls">
        <div>
          <h2>Review queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browse submissions and their current status.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by status</span>
          <Select 
            value={statusFilter} 
            onValueChange={(val) => {
              setStatusFilter(val as FilterStatus);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Projects</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="review-table-wrap">
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
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No submissions found for this filter.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <span>{sub.projectName}</span>
                      <a
                        href={sub.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-xs text-(--orange-dark) hover:underline"
                      >
                        View Repo <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{sub.category || "N/A"}</TableCell>
                  <TableCell>
                    <StatusBadge status={sub.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {sub.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(sub.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleStatusUpdate(sub.id, "REJECTED")}
                        >
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

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ title, value, indicatorColor }: { title: string; value: number; indicatorColor: string }) {
  return (
    <Card className="review-stat-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`review-stat-value ${indicatorColor}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusClasses: Record<string, string> = {
    PENDING: "status-pending",
    APPROVED: "status-approved",
    REJECTED: "status-changes",
  };
  
  return (
    <Badge variant="outline" className={`status-badge ${statusClasses[status] || ""} capitalize`}>
      {status.toLowerCase()}
    </Badge>
  );
}