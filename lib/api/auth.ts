import { isAxiosError } from "axios";
import { api } from "@/lib/axios";
import { LoginInput } from "../validators/auth.validation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
}

export const loginRequest = async (input: LoginInput) => {
  const res = await api.post<{ success: boolean; message: string; data: AuthUser }>(
    "/auth/login",
    input,
  );
  
  return { 
    message: res.data.message, 
    user: res.data.data 
  };
};

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? "Cannot reach the server";
  }
  return "Something went wrong";
};