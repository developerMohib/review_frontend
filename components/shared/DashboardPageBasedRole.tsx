"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getMe } from "@/lib/api/auth";

export default function DashboardRootPage() {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
    retry: false,
  });

  useEffect(() => {
    if (!user) return;

    router.replace(`/dashboard/${user.role}`);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--orange)" />
      </div>
    );
  }

  return null;
}