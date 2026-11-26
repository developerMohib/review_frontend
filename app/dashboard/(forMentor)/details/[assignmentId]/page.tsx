import Link from "next/link";
import { Suspense } from "react";

import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  GitBranch,
  Globe,
  MessageSquareText,
  UserRound,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import ReviewActions from "@/components/mentor/componets/ReviewActions";

import { getSubmissionByIdServer } from "@/lib/apiServices/submissionServices";

// -------------------------------------
// Types
// -------------------------------------

interface DetailsPageProps {
  params: Promise<{
    assignmentId: string;
  }>;
}

// -------------------------------------
// Helpers
// -------------------------------------

const statusVariant = (status: string) => {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";

  return "secondary";
};

// -------------------------------------
// Loading UI
// -------------------------------------

function DetailsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="h-6 w-48 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="h-6 w-40 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
            <div className="h-8 w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// -------------------------------------
// Async Server Component
// -------------------------------------

async function DetailsContent({
  params,
}: DetailsPageProps) {
  const { assignmentId } = await params;

  const submission = await getSubmissionByIdServer(assignmentId);

  if (!submission) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader className="text-center">
          <CardTitle>Submission not found</CardTitle>

          <CardDescription>
            This assignment may have been removed or the link is invalid.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/assignment-manage" />}
          >
            <ArrowLeft />
            Back to assignments
          </Button>
        </CardContent>
      </Card>
    );
  }

  const studentName =
    submission.user?.name || "Unknown student";

  const initials = studentName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="mx-auto max-w-6xl space-y-6">

      {/* Header */}

      <header className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard/assignment-manage" />}
            className="-ml-2 text-muted-foreground"
          >
            <ArrowLeft />
            Back to assignments
          </Button>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant(submission.status)}>
                {submission.status}
              </Badge>

              <Badge variant="outline">
                {submission.category || "Uncategorized"}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {submission.projectName}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

        {/* Left Section */}

        <div className="space-y-6">

          {/* Project Description */}

          <Card>
            <CardHeader>
              <CardTitle>Project description</CardTitle>

              <CardDescription>
                Details submitted by the student
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-wrap leading-7 text-foreground/90">
                {submission.description}
              </p>
            </CardContent>
          </Card>

          {/* Project Links */}

          <Card>
            <CardHeader>
              <CardTitle>Project links</CardTitle>

              <CardDescription>
                Repository and deployed application
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                nativeButton={false}
                className="justify-start"
                render={
                  <a
                    href={submission.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <GitBranch />
                Repository
                <ExternalLink className="ml-auto" />
              </Button>

              {submission.liveUrl ? (
                <Button
                  variant="outline"
                  nativeButton={false}
                  className="justify-start"
                  render={
                    <a
                      href={submission.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Globe />
                  Live preview
                  <ExternalLink className="ml-auto" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="justify-start"
                  disabled
                >
                  <Globe />
                  No live preview
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Mentor Feedback */}

          {submission.feedbacks &&
            submission.feedbacks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mentor feedback</CardTitle>

                  <CardDescription>
                    Latest review comments
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {submission.feedbacks.map((feedback) => (
                    <section
                      key={feedback.id}
                      className="rounded-lg border p-4"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {(feedback.mentor?.name || "Mentor")
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium">
                            {feedback.mentor?.name || "Mentor"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              feedback.createdAt
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap leading-6 text-foreground/90">
                        {feedback.comment}
                      </p>
                    </section>
                  ))}
                </CardContent>
              </Card>
            )}
        </div>

        {/* Right Sidebar */}

        <aside className="space-y-6">

          {/* Student Information */}

          <Card>
            <CardHeader>
              <CardTitle>Student</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback>
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {studentName}
                  </p>

                  <p className="truncate text-sm text-muted-foreground">
                    {submission.user?.email || "No email"}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <dl className="space-y-3 text-sm">

                <div className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-4" />
                    Submitted
                  </dt>

                  <dd className="font-medium">
                    {new Date(
                      submission.createdAt
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <UserRound className="size-4" />
                    Status
                  </dt>

                  <dd>
                    <Badge variant={statusVariant(submission.status)}>
                      {submission.status}
                    </Badge>
                  </dd>
                </div>

              </dl>
            </CardContent>
          </Card>

          {/* Review Actions */}

          {submission.status === "pending" ? (
            <Card>
              <CardHeader>
                <CardTitle>Review submission</CardTitle>

                <CardDescription>
                  Approve or reject this project with feedback.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ReviewActions
                  submissionId={submission.id}
                  projectName={submission.projectName}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <MessageSquareText className="mt-0.5 size-5 text-muted-foreground" />

                <div>
                  <p className="font-medium">
                    Review complete
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    This submission has already been {submission.status}.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        </aside>
      </div>
    </main>
  );
}

// -------------------------------------
// Page Component
// -------------------------------------

export default function DetailsPage({
  params,
}: DetailsPageProps) {
  return (
    <Suspense fallback={<DetailsLoading />}>
      <DetailsContent params={params} />
    </Suspense>
  );
}