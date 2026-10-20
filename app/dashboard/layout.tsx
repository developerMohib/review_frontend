import type { ReactNode } from "react";
import DashboardShell from "@/components/shared/DashboardShell";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}