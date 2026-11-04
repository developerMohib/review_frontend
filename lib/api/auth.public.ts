
import type { LoginInput, SignupInput } from "../validators/auth.validation";
import type { UserData } from "@/types";

interface PublicAuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: UserData;
  };
}

export async function loginPublic(publicLoginInput: LoginInput) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(publicLoginInput),
    credentials: "include",
  });
  
  const data = (await res.json()) as PublicAuthResponse;

  if (!res.ok || !data.data?.user) {
    throw new Error(data?.message || "Login failed");
  }

  return {
    message: data.message,
    user: data.data.user,
  };
}

export async function registerPublic(publicSignupInput: SignupInput) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(publicSignupInput),
  });
  const result = (await response.json()) as {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
}

export async function getCurrentUserPublic(): Promise<UserData> {
  const response = await fetch("/api/auth/me", {
    credentials: "same-origin",
    cache: "no-store",
  });
  const result = (await response.json()) as {
    data?: UserData;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new PublicAuthError(
      result.message || "Unable to load current user",
      response.status,
    );
  }

  return result.data;
}

export async function logoutPublic(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });
  if (!response.ok) {
    const result = (await response.json()) as { message?: string };
    throw new PublicAuthError(
      result.message || "Logout failed",
      response.status,
    );
  }
}

export class PublicAuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PublicAuthError";
  }
}
