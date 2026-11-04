"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePublicCurrentUserQuery } from "@/lib/hooks/usePublicAuth";

export default function DashboardRootPage() {
  const router = useRouter();

  const { data: publicUser, isLoading: isPublicUserLoading } =
    usePublicCurrentUserQuery();

  useEffect(() => {
    if (!publicUser) return;

    router.replace(`/dashboard/${publicUser.role}`);
  }, [publicUser, router]);

  if (isPublicUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--orange)" />
      </div>
    );
  }

  return null;
}