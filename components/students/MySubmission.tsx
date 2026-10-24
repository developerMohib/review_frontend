"use client";

import { useEffect, useState } from "react";
import { getMySubmissionsRequest } from "@/lib/api/submission";
import { Submission } from "@/lib/validators/submission.validation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText } from "lucide-react";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getMySubmissionsRequest();
        // আপনার API রেসপন্স স্ট্রাকচার অনুযায়ী এটি অ্যাডজাস্ট করুন
        setSubmissions(response.submissions || []);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // স্ট্যাটাস অনুযায়ী Badge-এর রং নির্ধারণ করার হেল্পার ফাংশন
  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "default"; // সাধারণত সবুজ বা প্রাইমারি কালার
      case "REJECTED":
        return "destructive"; // লাল কালার
      case "PENDING":
        return "secondary"; // হলুদ/ধূসর কালার
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Loading your submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">My Submissions</h2>
        <Badge variant="outline" className="font-normal">
          Total: {submissions.length}
        </Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Project Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px] text-center">Category</TableHead>
              <TableHead className="w-[150px] text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-8 w-8 opacity-50" />
                    <p>No submissions found. Start by submitting a new project!</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {submission.projectName}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-md truncate">
                    {submission.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-md truncate">
                    {submission.category}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(submission.status)} className="capitalize">
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