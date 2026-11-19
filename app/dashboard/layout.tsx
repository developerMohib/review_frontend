import { redirect } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";
import { getCurrentUser } from "@/lib/apiServices/authService";
import React from "react";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentUser = await getCurrentUser();

  // Login na thakle
  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0">
        <Sidebar currentUser={currentUser} />
      </aside>

      <main className="min-w-0 flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;