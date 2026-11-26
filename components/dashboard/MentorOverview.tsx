import {
    ClipboardCheck,
    CheckCircle2,
    XCircle,
    Clock,
    FolderKanban,
    TrendingUp,
    ArrowRight,
    GraduationCap,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import { getAllSubmissionsServer } from "@/lib/apiServices/submissionServices";


const statusStyles: Record<string, string> = {
    approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    rejected: "border-red-500/20 bg-red-500/10 text-red-600",
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-600",
};


const MentorOverview = async () => {

    // Fetch latest submissions and aggregated statistics
    const {
        submissions,
        stats,
    } = await getAllSubmissionsServer({
        page: 1,
        limit: 4,
        status: "all",
    });


    // Normalize backend statistics
    // Expected API response: { approved, rejected, pending }
    const reviewStats = stats as {
        approved?: number;
        rejected?: number;
        pending?: number;
        totalApproved?: number;
        totalRejected?: number;
        totalPending?: number;
    };

    const approvedReviews =
        reviewStats.approved ?? reviewStats.totalApproved ?? 0;

    const rejectedReviews =
        reviewStats.rejected ?? reviewStats.totalRejected ?? 0;

    const pendingReviews =
        reviewStats.pending ?? reviewStats.totalPending ?? 0;

    const totalReviews = approvedReviews + rejectedReviews;

    const approvalRate = totalReviews > 0
        ? Math.round((approvedReviews / totalReviews) * 100)
        : 0;


    // Dynamic statistics
    const statsCards = [
        {
            title: "Total Reviews",
            value: totalReviews,
            description: "Projects reviewed by you",
            icon: ClipboardCheck,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            title: "Approved",
            value: approvedReviews,
            description: "Projects successfully approved",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Rejected",
            value: rejectedReviews,
            description: "Projects needing improvements",
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
        {
            title: "Pending",
            value: pendingReviews,
            description: "Waiting for review",
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];


    return (
        <Card className="space-y-6 border-0 bg-transparent p-0 shadow-none">

            {/* Welcome Section */}
            <Card className="overflow-hidden border-primary/10 bg-linear-to-r from-primary/10 via-primary/5 to-transparent shadow-none">

                <CardContent className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">

                    <CardContent className="space-y-2 p-0">

                        <Badge variant="secondary" className="w-fit gap-1">
                            <GraduationCap className="size-3.5" />
                            Mentor Workspace
                        </Badge>

                        <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Mentor Overview 👋
                        </CardTitle>

                        <CardDescription className="max-w-xl leading-relaxed">
                            Your guidance helps students grow. Keep track of your
                            reviews, monitor student progress, and help developers
                            improve their skills.
                        </CardDescription>

                    </CardContent>

                    <CardContent className="flex items-center gap-3 rounded-xl border bg-background/70 p-4">

                        <ClipboardCheck className="size-8 text-primary" />

                        <CardContent className="space-y-1 p-0">
                            <CardDescription className="text-xs">
                                Total reviewed
                            </CardDescription>

                            <CardTitle className="text-2xl">
                                {totalReviews} Projects
                            </CardTitle>
                        </CardContent>

                    </CardContent>

                </CardContent>
            </Card>


            {/* Statistics */}
            <Card className="border-0 bg-transparent p-0 shadow-none">

                <CardHeader className="px-0">
                    <CardTitle className="text-lg">
                        Review Overview
                    </CardTitle>

                    <CardDescription>
                        Your project review statistics at a glance.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">

                    {statsCards.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Card key={stat.title} className="shadow-sm">

                                <CardContent className="space-y-4 p-5">

                                    <CardContent className="flex items-center justify-between p-0">

                                        <CardDescription className="font-medium">
                                            {stat.title}
                                        </CardDescription>

                                        <CardContent className={`flex size-10 items-center justify-center rounded-lg ${stat.bg} p-0`}>
                                            <Icon className={`size-5 ${stat.color}`} />
                                        </CardContent>

                                    </CardContent>

                                    <CardContent className="space-y-1 p-0">

                                        <CardTitle className="text-3xl font-bold">
                                            {stat.value}
                                        </CardTitle>

                                        <CardDescription className="text-xs">
                                            {stat.description}
                                        </CardDescription>

                                    </CardContent>

                                </CardContent>

                            </Card>
                        );
                    })}

                </CardContent>
            </Card>


            {/* Performance */}
            <Card>

                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="size-5 text-primary" />
                        Review Performance
                    </CardTitle>

                    <CardDescription>
                        Your overall project approval performance.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">

                    <CardContent className="flex items-center justify-between p-0">

                        <CardContent className="space-y-1 p-0">

                            <CardDescription>
                                Approval Rate
                            </CardDescription>

                            <CardTitle className="text-3xl font-bold">
                                {approvalRate}%
                            </CardTitle>

                        </CardContent>

                        <Badge variant="outline" className="gap-1 text-emerald-600">
                            <TrendingUp className="size-3.5" />
                            Performance
                        </Badge>

                    </CardContent>

                    <Progress value={approvalRate} className="h-2" />

                    <CardContent className="flex justify-between p-0 text-sm">

                        <CardDescription>
                            {approvedReviews} approved projects
                        </CardDescription>

                        <CardDescription>
                            {totalReviews} total reviews
                        </CardDescription>

                    </CardContent>

                </CardContent>
            </Card>


            {/* Recent Reviews */}
            <Card>

                <CardHeader className="flex flex-row items-center justify-between gap-3">

                    <CardContent className="space-y-1 p-0">

                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FolderKanban className="size-5 text-primary" />
                            Recent Submissions
                        </CardTitle>

                        <CardDescription>
                            Latest projects submitted by students.
                        </CardDescription>

                    </CardContent>

                    <Link
                        href="/dashboard/reviews"
                        className="flex shrink-0 items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        View All
                        <ArrowRight className="size-4" />
                    </Link>

                </CardHeader>


                <CardContent className="p-0">

                    <Table>

                        <TableHeader>
                            <TableRow>
                                <TableHead>Project</TableHead>

                                <TableHead className="hidden sm:table-cell">
                                    Student
                                </TableHead>

                                <TableHead className="hidden md:table-cell">
                                    Category
                                </TableHead>

                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>


                        <TableBody>

                            {submissions.length === 0 ? (

                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        No submissions found.
                                    </TableCell>
                                </TableRow>

                            ) : (

                                submissions.map((submission) => {

                                    const status = submission.status.toLowerCase();

                                    return (
                                        <TableRow key={submission.id}>

                                            <TableCell className="font-medium">
                                                {submission.projectName}
                                            </TableCell>

                                            <TableCell className="hidden sm:table-cell">
                                                {submission.user?.name ?? "Unknown"}
                                            </TableCell>

                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="secondary">
                                                    {submission.category}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={statusStyles[status] ?? ""}
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

        </Card>
    );
};

export default MentorOverview;