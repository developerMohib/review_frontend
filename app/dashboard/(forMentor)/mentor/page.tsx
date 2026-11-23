import { getCurrentUser } from "@/lib/apiServices/authService";

export default async function MentorDashboardPage() {
const user = await getCurrentUser()
console.log('mentor page server',user)
  return (
    <div>
      <h1>This is mentor server page</h1>
    </div>
  )
}