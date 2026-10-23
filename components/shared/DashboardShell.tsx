"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { Bell, ChevronDown, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ShadCN Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Your Components & Libs
import Sidebar from "@/components/shared/Sidebar";
import { api } from "@/lib/axios";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Role detection based on path
  const role = pathname.startsWith("/dashboard/student") ? "student" : "mentor";
  const userName = role === "student" ? "Alex Morgan" : "Jordan Davis";
  const userInitials = role === "student" ? "AM" : "JD";

  // Proper Sign Out Handler
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const res = await api.post("/auth/logout");
      if (res.data.status === 200) {
        toast.success(res.data.message)
      }
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
      // এরর হলেও জোরপূর্বক লগইন পেজে পাঠিয়ে দেওয়া
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="dashboard-shell">
      {/* Sidebar এ onSignOut প্রপস পাঠানো হচ্ছে */}
      <Sidebar role={role} onSignOut={handleSignOut} />

      <div className="dashboard-content">
        <header className="topbar flex items-center justify-between gap-5 px-8 border-b border-border bg-white">

          {/* Breadcrumbs */}
          <div className="breadcrumbs flex items-center gap-2.5 text-[10px] font-medium tracking-wide text-muted">
            <span>Workspace</span>
            <span className="text-border">/</span>
            <strong className="text-foreground font-semibold">
              {pageTitle(pathname)}
            </strong>
          </div>

          {/* Topbar Actions */}
          <div className="topbar-actions flex items-center gap-4">

            {/* Search Input (ShadCN Input with custom styling) */}
            <div className="relative flex items-center gap-2 w-54.5 h-8.5 px-2.5 border border-border rounded-md bg-transparent text-muted">
              <Search size={16} className="shrink-0" />
              <Input
                className="w-full h-full border-0 bg-transparent p-0 text-[10px] text-foreground placeholder:text-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Search anything..."
                aria-label="Search projects"
              />
              <kbd className="min-w-7.75 px-1 py-0.5 border border-border rounded bg-[#fafafa] text-[8px] text-muted text-center">
                ⌘K
              </kbd>
            </div>

            {/* Notification Button (ShadCN Button) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-7.75 w-7.75 rounded-md text-muted hover:bg-[#f5f5f6] hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full border border-white bg-(--orange)" />
            </Button>

            <Separator orientation="vertical" className="h-6.25 bg-border" />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-left bg-transparent border-0 cursor-pointer hover:bg-[#f5f5f6] rounded-md p-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-7.75 w-7.75 rounded-full bg-[#e7ecff] text-[#586cbe] text-[9px] font-bold">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-foreground leading-none">
                    {userName}
                  </span>
                  <span className="mt-0.5 text-[9px] font-normal text-muted capitalize">
                    {role}
                  </span>
                </div>
                <ChevronDown size={15} className="text-muted" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 border-border bg-white">
                <DropdownMenuLabel className="text-[10px] text-muted">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem className="text-[10px] focus:bg-[#fff0eb] focus:text-(--orange-dark) cursor-pointer">
                  Profile Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="text-[10px] text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                >
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    "Sign out"
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="page-content w-full max-w-350 mx-auto px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  );
}

// Helper function for page titles
function pageTitle(pathname: string) {
  if (pathname.includes("/mentor")) return "Review projects";
  if (pathname.includes("/submit")) return "Submit a project";
  if (pathname.includes("/submission")) return "My submission";
  return "Overview";
}