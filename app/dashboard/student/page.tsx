import StudentDashboard from '@/components/students/StudentDashboard';
import { requireAuth } from '@/lib/api/authSever';

export default async function StudentDashboardPage() {
  
  const user = await requireAuth();

  return <StudentDashboard user={user} />;
}

export const instant = false;