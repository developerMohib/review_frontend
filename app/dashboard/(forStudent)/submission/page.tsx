import MySubmissions from "@/components/students/pages/MySubmission";
import { getMySubmissionsServer } from "@/lib/apiServices/submissionServices";

export default async function MySubmissionPage() {
  const { submissions } = await getMySubmissionsServer();
  return <MySubmissions submissions={submissions} />;
}

export const instant = false