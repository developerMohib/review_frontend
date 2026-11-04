import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserData } from "@/types";

interface ServerCurrentUserResponse {
  success: boolean;
  data: UserData;
  message?: string;
}

export async function getCurrentUserServer(): Promise<UserData | null> {
  const serverToken = (await cookies()).get("token")?.value;
  if (!serverToken) {
    return null;
  }

  const serverApiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!serverApiUrl) {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL must be configured");
  }

  const serverResponse = await fetch(`${serverApiUrl}/auth/me`, {
    headers: { Cookie: `token=${serverToken}` },
    cache: "no-store",
  });

  if (serverResponse.status === 401) {
    return null;
  }

  const serverResult = (await serverResponse.json()) as ServerCurrentUserResponse;
  if (!serverResponse.ok) {
    throw new Error(serverResult.message || "Unable to load current user");
  }

  return serverResult.data;
}

export async function requireAuthServer(): Promise<UserData> {
  const serverUser = await getCurrentUserServer();
  if (!serverUser) {
    redirect("/login");
  }

  return serverUser;
}