"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMySubmissionsRequest } from "@/lib/api/submission";
import { Submission } from "@/lib/validators/submission.validation";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getMySubmissionsRequest();
        setSubmissions(response.submissions || []);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-changes";
      case "PENDING":
        return "status-pending";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading" role="status">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading your submissions...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page submissions-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" /> STUDENT WORKSPACE
          </div>
          <h1>My submissions</h1>
          <p>Keep track of the projects you have shared for review.</p>
        </div>
        <Badge variant="outline" className="submission-heading-meta">
          {submissions.length} {submissions.length === 1 ? "project" : "projects"}
        </Badge>
      </div>

      <div className="submission-table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Project</TableHead>
              <TableHead className="min-w-[260px]">Description</TableHead>
              <TableHead className="min-w-[140px]">Category</TableHead>
              <TableHead className="min-w-[130px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-9 w-9 opacity-50" />
                    <p>No submissions yet. Your shared projects will appear here.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-semibold text-foreground">
                    {submission.projectName}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {submission.description}
                  </TableCell>
                  <TableCell>
                    <span className="category-chip">{submission.category}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`status-badge ${getStatusClass(submission.status)}`}
                    >
                      {submission.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
