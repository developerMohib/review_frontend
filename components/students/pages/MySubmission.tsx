// components/students/MySubmissions.tsx
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Submission } from "@/lib/validators/submission.validation";

const statusClasses: Record<string, string> = {
  approved: "status-approved",
  rejected: "status-changes",
  pending: "status-pending",
};

export default function MySubmissions({ submissions }: { submissions: Submission[] }) {
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
              <TableHead className="min-w-50">Project</TableHead>
              <TableHead className="min-w-65">Description</TableHead>
              <TableHead className="min-w-35">Category</TableHead>
              <TableHead className="min-w-32.5">Status</TableHead>
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
              submissions.map((s) => {
                const status = s.status.toLowerCase();
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold text-foreground">{s.projectName}</TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">{s.description}</TableCell>
                    <TableCell><span className="category-chip">{s.category}</span></TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`status-badge ${statusClasses[status] ?? ""}`}>
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}