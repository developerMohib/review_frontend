import { isAxiosError } from "axios";

export function getPublicErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? "Cannot reach the server";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}
