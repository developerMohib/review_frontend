"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import { type ReactNode, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import Sidebar from "@/components/shared/Sidebar";
import { api } from "@/lib/axios";
import { UserData, UserRole } from "@/types";

interface DashboardShellProps {
  children: ReactNode;
}

interface CurrentUserResponse {
  success: boolean;
  data: UserData;
}

function isUnauthenticated(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}

async function fetchCurrentUser(): Promise<UserData> {
  const response = await api.get<CurrentUserResponse>("/auth/me");

  return response.data.data;
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutInProgress = useRef(false);

  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  const handleSignOut = async (): Promise<void> => {
    if (logoutInProgress.current) return;

    logoutInProgress.current = true;
    setIsLoggingOut(true);

    try {
      try {
        await api.post("/auth/logout");
      } catch (error: unknown) {
        if (!isUnauthenticated(error)) {
          throw error;
        }
      }

      await queryClient.cancelQueries();
      queryClient.clear();

      toast.success("Logged out successfully");
      router.replace("/login");
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      logoutInProgress.current = false;
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-label="Loading dashboard"
      >
        <Loader2 className="h-8 w-8 animate-spin text-[var(--orange)]" />
        <span className="sr-only">Loading dashboard...</span>
      </div>
    );
  }

  if (isError && isUnauthenticated(error)) {
    redirect("/login");
  }

  if (isError || !userData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="text-sm text-muted-foreground">
          We could not load your account. Please try again.
        </p>

        <Button onClick={() => void refetch()} disabled={isFetching}>
          {isFetching && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Try again
        </Button>
      </div>
    );
  }

  const role: UserRole = userData.role;
  const userName = userData.name.trim() || "User";

  const userInitials = userName
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const pageTitle = pathname.startsWith("/dashboard/student/submit")
    ? "Submit a project"
    : pathname.startsWith("/dashboard/student/submission")
      ? "My submissions"
      : pathname.startsWith("/dashboard/student")
        ? "Overview"
        : pathname.startsWith("/dashboard/mentor")
          ? "Review projects"
          : role === "student"
            ? "Overview"
            : "Dashboard";

  return (
    <div className="dashboard-shell">
      <Sidebar
        role={role}
        onSignOut={() => void handleSignOut()}
        isLoggingOut={isLoggingOut}
      />

      <div className="dashboard-content">
        <header className="topbar flex items-center justify-between gap-5 border-b border-border bg-white px-8 py-3">
          {/* Page title */}
          <div className="breadcrumbs flex items-center gap-2.5 text-[10px] font-medium tracking-wide text-muted-foreground">
            <span>CodeRabbit</span>

            <span className="text-border">/</span>

            <strong className="font-semibold text-foreground">
              {pageTitle}
            </strong>
          </div>

          {/* User Profile — no button or dropdown */}
          <div
            className="flex items-center gap-3 rounded-xl px-3 py-2 shadow-sm ring-1 ring-black/5 transition-shadow duration-200 hover:shadow-md"
            aria-label={`Signed in as ${userName}, ${role}`}
          >
            <Avatar className="h-10 w-10 border border-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-violet-200 text-xs font-bold text-indigo-700">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-col gap-1">
              <span className="max-w-[160px] truncate text-xs font-semibold leading-tight text-foreground">
                {userName}
              </span>

              <span className="w-fit rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-medium capitalize text-indigo-600">
                {role}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content mx-auto w-full max-w-[1400px] px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  );
}