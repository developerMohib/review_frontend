"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import { type ReactNode, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  // Prevent repeated logout requests before the next render.
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
    if (logoutInProgress.current) {
      return;
    }

    logoutInProgress.current = true;
    setIsLoggingOut(true);

    try {
      try {
        // Your Axios client should attach any required CSRF header.
        await api.post("/auth/logout");
      } catch (error: unknown) {
        // An expired/missing auth session is already logged out.
        if (!isUnauthenticated(error)) {
          throw error;
        }
      }

      // Stop in-flight queries before clearing private cached data.
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

  // redirect() is valid here during rendering, outside event handlers.
  if (isError && isUnauthenticated(error)) {
    redirect("/login");
  }

  // A network/server failure is not necessarily a logged-out session.
  if (isError || !userData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="text-sm text-muted-foreground">
          We could not load your account. Please try again.
        </p>

        <Button
          onClick={() => void refetch()}
          disabled={isFetching}
        >
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
      <Sidebar role={role} />

      <div className="dashboard-content">
        <header className="topbar">
          <div className="breadcrumbs flex items-center gap-2.5 text-[10px] font-medium tracking-wide text-muted-foreground">
            <span>CodeRabbit</span>

            <span className="text-border">/</span>

            <strong className="font-semibold text-foreground">
              {pageTitle}
            </strong>
          </div>

          <div className="topbar-actions flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent p-1 text-left outline-none transition-colors hover:bg-[#f5f5f6] focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="h-[31px] w-[31px] rounded-full text-[9px] font-bold">
                  <AvatarFallback className="bg-[#e7ecff] text-[#586cbe]">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <span className="flex flex-col">
                  <span className="text-[10px] font-semibold leading-none text-foreground">
                    {userName}
                  </span>

                  <span className="mt-0.5 text-[9px] font-normal capitalize text-muted-foreground">
                    {role}
                  </span>
                </span>

                <ChevronDown
                  size={15}
                  className="text-muted-foreground"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-border bg-white"
              >
                <DropdownMenuLabel className="text-[10px] text-muted-foreground">
                  My Account
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem
                  onSelect={() => void handleSignOut()}
                  disabled={isLoggingOut}
                  className="cursor-pointer text-[10px] text-red-500 focus:bg-red-50 focus:text-red-600"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Signing out...
                    </>
                  ) : (
                    "Sign out"
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}