import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { getCurrentUser } from "@/lib/apiServices/authService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({
  children,
}: DashboardLayoutProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full bg-background">

      {/* Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 md:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8 mx-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4 mb-6">
          {/* Left Side */}
          <CardContent className="space-y-1 p-0">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser.name ?? "Bro"}! 👋
            </CardTitle>

            <CardDescription>
              Here s what s happening with your dashboard today. <br/>
              Manage your activities and track your progress.
            </CardDescription>
          </CardContent>

          {/* Right Side */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="shrink-0 rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all"
                >
                  <Image
                    alt={currentUser.name}
                    src={
                      currentUser.avatar ??
                      "https://miro.medium.com/v2/resize:fit:566/1*n-FPAObgPCDmxNKeGqyWvw.jpeg"
                    }
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </button>
              }
            />

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>
                  <LogOut className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        {children}
      </main>

    </div>
  );
};

export default DashboardLayout;