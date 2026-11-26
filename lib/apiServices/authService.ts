"use server";

import { cookies } from "next/headers";
import { LoginInput, SignupInput } from "../validators/auth.validation";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";


export const registerUser = async (userData: SignupInput) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );
    const registerData = await res.json();
    if (registerData.success) {
      (await cookies()).set("token", registerData?.data?.token);
    }
    return registerData;
  } catch (error) {
    return Error(error as any).message;
  }
};

export const loginUser = async (userData: LoginInput) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const loginData = await res.json();
    if (loginData.success) {
      (await cookies()).set("token", loginData?.data?.token);
    }
    return loginData;
  } catch (error) {
    return Error(error as any).message;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = (await cookies()).get("token")?.value;
    
    let decodedUser = null;
    if (token) {
      decodedUser = await jwtDecode(token);
      return decodedUser;
    } else {
      return null;
    }
  } catch (error) {
    return Error(error as any).message;
  }
};

export async function logOut() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: "POST",
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
  }

  cookieStore.delete("token");
  redirect("/login");
}