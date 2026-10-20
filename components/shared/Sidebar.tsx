"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Send,
  Settings2,
} from "lucide-react";

const mentorNavigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/mentor", label: "Review projects", icon: ClipboardList },
];

const studentNavigation = [
  { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/student/submit", label: "Submit a project", icon: Send },
  { href: "/dashboard/student/submission", label: "My submission", icon: FilePlus2 },
];

export default function Sidebar({
  role,
  onSignOut,
}: {
  role: "student" | "mentor";
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const navigation = role === "student" ? studentNavigation : mentorNavigation;
  const home = role === "student" ? "/dashboard/student" : "/dashboard";

  return (
    <aside className="dashboard-sidebar">
      <Link href={home} className="dashboard-brand" aria-label="CodeRabbit dashboard">
        <Image src="/coderabbit-logo.png" alt="CodeRabbit" width={193} height={31} priority />
      </Link>

      <div className="workspace-switcher">
        <div className="workspace-mark">CR</div>
        <div className="workspace-copy"><strong>Project workspace</strong><span>Free plan</span></div>
        <ChevronDown size={15} />
      </div>

      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = label === "Overview"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} className={active ? "sidebar-link active" : "sidebar-link"}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Review projects" && <span className="nav-count">8</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <div className="tip-icon"><Settings2 size={16} /></div>
          <strong>{role === "student" ? "Keep building" : "Thoughtful reviews matter"}</strong>
          <p>{role === "student" ? "Every submission is a step forward. Share your next idea with the community." : "A few thoughtful notes can help a project move forward."}</p>
          <Link href={role === "student" ? "/dashboard/student/submit" : "/dashboard/mentor"}>
            {role === "student" ? "Start a submission" : "Open review queue"} <span>→</span>
          </Link>
        </div>
        <button type="button" className="sidebar-logout" onClick={onSignOut}>
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </aside>
  );
}
