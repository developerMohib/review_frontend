"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = pathname.startsWith("/dashboard/student") ? "student" : "mentor";
  function signOut() {
    document.cookie = "demo-session=; path=/; max-age=0; SameSite=Lax";
    router.replace("/");
  }

  return (
    <div className="dashboard-shell">
      <Sidebar role={role} onSignOut={signOut} />

      <div className="dashboard-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{pageTitle(pathname)}</strong></div>
          <div className="topbar-actions">
            <label className="dashboard-search">
              <Search size={16} />
              <input aria-label="Search projects" placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" type="button">
              <Bell size={18} /><span />
            </button>
            <div className="topbar-divider" />
            <button type="button" className="profile-button" onClick={signOut} aria-label={`Sign out, ${role} demo account`}>
              <span className="profile-avatar">{role === "student" ? "AM" : "JD"}</span>
              <span className="profile-name">{role === "student" ? "Alex Morgan" : "Jordan Davis"}<small>{role === "student" ? "Student" : "Mentor"}</small></span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

function pageTitle(pathname: string) {
  if (pathname.includes("/mentor")) return "Review projects";
  if (pathname.includes("/submit")) return "Submit a project";
  if (pathname.includes("/submission")) return "My submission";
  return "Overview";
}
