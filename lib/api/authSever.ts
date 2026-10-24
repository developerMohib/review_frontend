import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "../axios";
import { UserData } from "@/types";

/**
 * Server Component এ ইউজার ডেটা ফেচ করার জন্য
 */
export const getMe = async (): Promise<UserData | null> => {
  try {
    const cookieStore = await cookies();
    
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const { data } = await api.get("/auth/me", {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    return data?.data || null;
  } catch (error) {
    console.error("Failed to fetch user in server:", error);
    return null;
  }
};

/**
 * ইউজার অথেনটিকেটেড কিনা চেক করে, না হলে রিডাইরেক্ট করে
 */
export const requireAuth = async (): Promise<UserData> => {
  const user = await getMe();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
};