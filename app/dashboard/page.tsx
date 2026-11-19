import React from "react";
import { getCurrentUser } from "@/lib/apiServices/authService";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import MentorDashboard from "@/components/mentor/MentorDashboard";
import StudentDashboard from "@/components/students/StudentDashboard";

const DashboardPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role === "admin") {
    return <AdminDashboard user={currentUser} />;
  }

  if (currentUser.role === "mentor") {
    return <MentorDashboard user={currentUser} />;
  }

  return <StudentDashboard user={currentUser} />;
};

export default DashboardPage;