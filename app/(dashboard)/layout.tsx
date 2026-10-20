import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: LayoutProps) => {
  return <div>{children}</div>;
};

export default DashboardLayout;