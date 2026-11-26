"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFilterProps {
  value: string;
}

export default function StatusFilter({ value }: StatusFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (status: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (!status || status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }

    router.push(`/dashboard/assignment-manage?${params.toString()}`);
  };

  return (
    <Select value={value} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All Projects</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
}