// lib/api/auth.ts
import { isAxiosError } from "axios";
import { api } from "@/lib/axios";
import { LoginInput } from "../validators/auth.validation";
import { UserData } from "@/types";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
    token: string;
  };
}

export const loginRequest = async (input: LoginInput) => {
  const res = await api.post<LoginResponse>("/auth/login", input);
  
  return {
    message: res.data.message,
    user: res.data.data.user,
    token: res.data.data.token,
  };
};

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? "Cannot reach the server";
  }
  return "Something went wrong";
};