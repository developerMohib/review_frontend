"use client";

import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpenCheck,
    Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "../ui/alert";

const StudentOverview = () => {

    return (
        <div className="space-y-6">

            {/* Grid */}
            <section className="grid gap-6 lg:grid-cols-3">
                {/* Latest project */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                        <div className="space-y-1.5">
                            <CardTitle>Your latest project</CardTitle>
                            <CardDescription>A little progress is still progress.</CardDescription>
                        </div>

                        <Link className={cn(
                            "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors")} href="/dashboard/submission">
                            View details
                            <ArrowRight size={14} />
                        </Link>
                    </CardHeader>

                    <CardContent>
                        {/* Empty state */}
                        <div className="flex items-start gap-4 rounded-xl border border-dashed bg-muted/40 p-5">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <BookOpenCheck size={20} />
                            </div>

                            <div className="space-y-1.5">
                                <Badge variant="outline" className="uppercase tracking-wider">
                                    No projects yet
                                </Badge>
                                <h3 className="font-semibold">Start your first project</h3>
                                <p className="text-sm text-muted-foreground">
                                    Share your idea with the community and get valuable feedback
                                    from mentors.
                                </p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Alert>
                            <Sparkles className="size-4" />
                            <AlertDescription>
                                Ready to submit your first project? Click the button above to
                                get started!
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                </Card>

                {/* Encouragement */}
                <Card className="relative overflow-hidden border-0 bg-linear-to-br from-primary/15 via-primary/5 to-transparent">
                    <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl" />

                    <CardHeader className="relative space-y-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Sparkles size={19} />
                        </div>

                        <Badge variant="secondary" className="w-fit uppercase tracking-wider">
                            Keep the momentum
                        </Badge>

                        <CardTitle className="text-2xl leading-tight">
                            Small steps.
                            <br />
                            Big things.
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="relative">
                        <p className="text-sm text-muted-foreground">
                            Your next project could be the one that changes everything. Start
                            when you’re ready.
                        </p>
                    </CardContent>

                    <CardFooter className="relative">
                        <Link href="/dashboard/submit" className={cn(
                            "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors")} >
                            Share another idea
                            <ArrowUpRight size={15} />
                        </Link>
                    </CardFooter>
                </Card>
            </section>

            <p className="text-center text-xs text-muted-foreground">
                Welcome to your workspace · Start building amazing projects today.
            </p>
        </div>
    );
};

export default StudentOverview;