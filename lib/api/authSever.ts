import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserData } from "../../types/index";

interface CurrentUserResponse {
  success: boolean;
  data: UserData;
  message?: string;
}

export async function getMe(): Promise<UserData | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return null;
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL must be configured");
  }

  const response = await fetch(`${apiUrl}/auth/me`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  const data = (await response.json()) as CurrentUserResponse;
  if (!response.ok) {
    throw new Error(data.message || "Unable to load current user");
  }

  return data.data;
}

/**
 * user aunthentication and redirect to login page if not authenticated
 */
export const requireAuth = async (): Promise<UserData> => {
  const user = await getMe();
  if (!user) {
    redirect("/login");
  }
  
  return user;
};