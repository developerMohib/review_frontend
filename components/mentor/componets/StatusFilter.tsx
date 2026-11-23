"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StatusFilter({ value }: { value: string }) {
  const router = useRouter();

  return (
    <Select
      value={value}
      onValueChange={(v) =>
        router.push(v === "all" ? "/dashboard/mentor" : `/dashboard/mentor?status=${v}`)
      }
    >
      <SelectTrigger className="w-45"><SelectValue placeholder="Select status" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Projects</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
}