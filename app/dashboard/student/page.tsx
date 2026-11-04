import StudentDashboard from '@/components/students/StudentDashboard';
import { requireAuthServer } from "@/lib/api/auth.server";

export default async function StudentDashboardPage() {
  const serverUser = await requireAuthServer();

  return <StudentDashboard user={serverUser} />;
}

export const instant = false;