"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  FilePlus2,
  Send,
  LogOut,
  Users,
  FolderKanban,
  Loader2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logOut } from "@/lib/apiServices/authService";
import { useUser } from "@/provider/UserContext";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/projects", label: "Manage Projects", icon: FolderKanban },
  ],
  mentor: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/assignment-manage", label: "Review Assignment", icon: ClipboardList },
  ],
  student: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/submit", label: "Submit a Project", icon: Send },
    { href: "/dashboard/submission", label: "My Submissions", icon: FilePlus2 },
  ],
};


export default function Sidebar() {
  const { user: currentUser } = useUser()
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const role = String(currentUser?.role ?? "student");
  const navigation = navByRole[role] ?? navByRole.student;

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogOut = () => {
    startTransition(async () => {
      try {
        await logOut();
        router.replace("/login");
        router.refresh();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });
  };

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r bg-background">
      {/* Brand */}
      <div className="flex h-20 items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center"
          aria-label="Dashboard home"
        >
          <Image
            src="/coderabbit-logo.png"
            alt="CodeRabbit"
            width={180}
            height={40}
            priority
            className="h-auto w-40 object-contain"
          />
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 mt-10">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <nav className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon size={18} className="shrink-0" />

                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Bottom Section */}
      <div className="space-y-4 p-4">

        {/* User + Logout */}
        <div className="flex items-center gap-3 px-1">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              <Image
                alt={currentUser?.name ?? "avatar"}
                src={
                  currentUser?.avatar ??
                  "https://miro.medium.com/v2/resize:fit:566/1*n-FPAObgPCDmxNKeGqyWvw.jpeg"
                }
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {currentUser?.name ?? "Guest"}
            </p>
            <Badge variant="secondary" className="mt-0.5 capitalize">
              {role}
            </Badge>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogOut}
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <span>{isPending ? "Signing out..." : "Sign out"}</span>
          )}<LogOut size={18} />
        </Button>
      </div>
    </aside>
  );
}