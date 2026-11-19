import StudentDashboard from '@/components/students/StudentDashboard';
import { getCurrentUser } from '@/lib/apiServices/authService';
import Loading from '../loading';

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return <Loading />;
  }
  return <StudentDashboard user={user} />;
}

export const instant = false;