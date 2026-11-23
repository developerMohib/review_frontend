import { redirect } from "next/navigation";

import AdminOverview from "@/components/dashboard/AdminOverview";
import MentorOverview from "@/components/dashboard/MentorOverview";
import StudentOverview from "@/components/dashboard/StudentOverview";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/apiServices/authService";
import { connection } from "next/server";

const DashboardHomePage = async () => {
    await connection();
    const currentUser = await getCurrentUser().catch(() => null);
    if (!currentUser) {
        redirect("/login");
    }

    const role = String(currentUser.role);

    return (
        <div className="space-y-6">

            {role === "admin" && <AdminOverview />}
            {role === "mentor" && <MentorOverview />}
            {role === "student" && <StudentOverview />}

            {!["admin", "mentor", "student"].includes(role) && (
                <Card>
                    <CardContent className="p-6 text-sm text-muted-foreground">
                        Your account role is not recognized. Please contact an admin.
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default DashboardHomePage;