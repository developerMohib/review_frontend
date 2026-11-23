"use server"
import { redirect } from "next/navigation";
import Image from "next/image";

import Sidebar from "@/components/dashboard/Sidebar";
import { getCurrentUser } from "@/lib/apiServices/authService";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className="flex h-screen w-full flex-row gap-0 overflow-hidden rounded-none border-0 bg-background p-0 shadow-none">

      {/* Sidebar */}
      <Card
        className="fixed inset-y-0 left-0 z-40 hidden w-64 rounded-none border-r bg-card shadow-none md:flex"
      >
        <ScrollArea className="h-full w-full">
          <Sidebar />
        </ScrollArea>
      </Card>

      {/* Main Content */}
      <Card
        className="ml-0 flex min-w-0 flex-1 flex-col gap-0 overflow-hidden rounded-none border-0 bg-background p-0 shadow-none md:ml-64"
      >

        {/* Header */}
        <CardHeader className="sticky top-0 z-30 flex min-h-20 flex-row items-center justify-between gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-md md:px-6">

          {/* Left Side */}
          <CardContent className="flex min-w-0 items-center gap-3 p-0">

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </Button>

            <CardContent className="min-w-0 space-y-1 p-0">
              <CardTitle className="truncate text-lg font-bold tracking-tight sm:text-2xl">
                Welcome back, {currentUser.name ?? "Bro"}! 👋
              </CardTitle>
            </CardContent>

          </CardContent>

          {/* Right Side */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0 rounded-full p-0"
                  aria-label="Open account menu"
                >
                  <Image
                    alt={currentUser.name ?? "User"}
                    src={
                      currentUser.avatar ??
                      "https://miro.medium.com/v2/resize:fit:566/1*n-FPAObgPCDmxNKeGqyWvw.jpeg"
                    }
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                </Button>
              }
            />

            <DropdownMenuContent align="end" className="w-52">

              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  My Account
                </DropdownMenuLabel>

                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Log out
                <LogOut className="ml-auto size-4" />
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </CardHeader>

        {/* Scrollable Main Content */}
        <ScrollArea className="min-h-0 flex-1">
          <CardContent className="p-4 md:p-6 lg:p-8">
            {children}
          </CardContent>
        </ScrollArea>

      </Card>
    </Card>
  );
};

export default DashboardLayout;
