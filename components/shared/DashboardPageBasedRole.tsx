"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { UserData } from "@/types";

// DashboardShell এ যেই ফাংশন ব্যবহার করেছেন, সেটিই রিইউজ করুন
async function fetchCurrentUser(): Promise<UserData> {
  const response = await api.get("/auth/me");
  return response.data.data;
}

export default function DashboardRootPage() {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "student") router.replace("/dashboard/student");
      else if (user.role === "mentor") router.replace("/dashboard/mentor");
      else if (user.role === "admin") router.replace("/dashboard/admin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--orange)" />
      </div>
    );
  }

  return null;
}

export const instant = false;