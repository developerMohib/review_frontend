import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
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

import type { Submission } from "@/lib/validators/submission.validation";
import { truncateWords } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  approved: "status-approved",
  rejected: "status-changes",
  pending: "status-pending",
};
export default function MySubmissions({
  submissions,
}: {
  submissions: Submission[];
}) {
  return (
    <Card className="dashboard-page submissions-page border-0 shadow-none border-none">

      {/* Page Heading */}
      <CardHeader className="flex flex-row items-center justify-between gap-4 px-0">

        <CardContent className="space-y-2 p-0">

          <CardDescription className="flex items-center gap-2 text-xs font-semibold tracking-wider">
            <span className="size-2 rounded-full bg-primary" />
            STUDENT WORKSPACE
          </CardDescription>

          <CardTitle className="text-2xl font-bold tracking-tight">
            My submissions
          </CardTitle>

          <CardDescription>
            Keep track of the projects you have shared for review.
          </CardDescription>

        </CardContent>

        <Badge variant="outline" className="shrink-0">
          {submissions.length}{" "}
          {submissions.length === 1 ? "project" : "projects"}
        </Badge>

      </CardHeader>

      {/* Submission Table */}
      <CardContent className="overflow-hidden rounded-xl border p-0">

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead >
                S/N
              </TableHead>
              <TableHead >
                Project Title
              </TableHead>

              <TableHead className="min-w-65">
                Description
              </TableHead>

              <TableHead>
                Category
              </TableHead>

              <TableHead>
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">

                  <CardContent className="flex flex-col items-center justify-center gap-2 text-muted-foreground">

                    <FileText className="size-9 opacity-50" />

                    <CardDescription>
                      No submissions yet. Your shared projects will appear here.
                    </CardDescription>

                  </CardContent>

                </TableCell>
              </TableRow>
            ) : (
              submissions?.map((s, idx) => {
                const status = s.status.toLowerCase();

                return (
                  <TableRow key={s.id}>

                    <TableCell className="font-semibold text-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {s.projectName}
                    </TableCell>

                    <TableCell className="max-w-md truncate text-muted-foreground text-wrap">
                      {truncateWords(s.description, 5)}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {s.category}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`status-badge ${statusClasses[status] ?? ""}`}
                      >
                        {status}
                      </Badge>
                    </TableCell>

                  </TableRow>
                );
              })
            )}

          </TableBody>

        </Table>

      </CardContent>

    </Card>
  );
}
