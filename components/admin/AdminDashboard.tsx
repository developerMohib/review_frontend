import { UserData } from "@/types";

interface AdminDashboardProps {
  user: UserData;
}

const AdminDashboard = ({user}:AdminDashboardProps) => {
    console.log("admin",user)
    return (
        <div>
            <h1>AdminDashboard</h1>
        </div>
    );
};

export default AdminDashboard;