import Link from "next/link";

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

import { Badge } from "@/components/ui/badge";
import { getAllSubmissionsServer } from "@/lib/apiServices/submissionServices";
import StatusFilter from "@/components/mentor/componets/StatusFilter";
import ReviewActions from "@/components/mentor/componets/ReviewActions";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

interface ManageAssignmentPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}

const ManageAssignmentPage = async ({
    searchParams,
}: ManageAssignmentPageProps) => {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page) || 1);
    const limit = 10;

    const allowedStatuses = ["all", "pending", "approved", "rejected"];

    const status = allowedStatuses.includes(params.status || "all")
        ? params.status || "all"
        : "all";

    const { submissions, pagination } = await getAllSubmissionsServer({
        page,
        limit,
        status,
    });

    const getStatusVariant = (
        status: string
    ): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case "approved":
                return "default";

            case "rejected":
                return "destructive";

            default:
                return "secondary";
        }
    };

    const createPageUrl = (pageNumber: number) => {
        const query = new URLSearchParams();

        query.set("page", String(pageNumber));

        if (status !== "all") {
            query.set("status", status);
        }

        return `/dashboard/mentor?${query.toString()}`;
    };

    return (
        <main className="space-y-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <section>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Manage Assignments
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Review student projects and provide feedback.
                    </p>
                </section>

                <StatusFilter value={status} />
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Student Assignments</CardTitle>

                    <CardDescription>
                        Review, approve or reject submitted projects.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        No assignments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>
                                            <section className="max-w-55 space-y-1">
                                                <p className="font-medium">
                                                    {submission.projectName}
                                                </p>

                                                <p className="line-clamp-1 text-xs text-muted-foreground">
                                                    {submission.description}
                                                </p>
                                            </section>
                                        </TableCell>

                                        <TableCell>
                                            <section className="space-y-1">
                                                <p className="font-medium">
                                                    {submission.user?.name || "Unknown"}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {submission.user?.email}
                                                </p>
                                            </section>
                                        </TableCell>

                                        <TableCell>
                                            {submission.category}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={getStatusVariant(submission.status)}>
                                                {submission.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            {new Date(submission.createdAt).toLocaleDateString(
                                                "en-US",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {submission.status === "pending" ? (
                                                <ReviewActions
                                                    submissionId={submission.id}
                                                    projectName={submission.projectName}
                                                />
                                            ) : (
                                                <Link className={cn(
                                                    "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors")}
                                                    href={`/dashboard/details/${submission.id}`}
                                                >
                                                    <Eye />
                                                </Link>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {pagination.totalPages > 1 && (
                <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                        {" · "}
                        {pagination.total} assignments
                    </p>

                    <section className="flex items-center gap-2">
                        <Link
                            href={createPageUrl(page - 1)}
                            aria-disabled={page <= 1}
                            tabIndex={page <= 1 ? -1 : undefined}
                            className={cn(
                                "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors",
                                page <= 1 && "pointer-events-none opacity-50"
                            )}
                        >
                            Previous
                        </Link>

                        <Link className={cn(
                            "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors", page >= pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "")}

                            href={createPageUrl(page + 1)}
                            aria-disabled={page >= pagination.totalPages}
                            tabIndex={
                                page >= pagination.totalPages ? -1 : undefined
                            }

                        >
                            Next
                        </Link>

                    </section>
                </footer>
            )}
        </main>
    );
};

export default ManageAssignmentPage;