import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});


export const signupSchema = z.object({
  name: z.string({ message: "Name is required" }).trim().min(2, "Name must be at least 2 characters"),
  email: z.string({ message: "Email is required" }).trim().email("Invalid email address"),
  password: z.string({ message: "Password is required" }).trim().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string({ message: "Please confirm your password" }).trim().min(6, "Please confirm your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupFormInput = z.infer<typeof signupSchema>;
export type SignupInput = Omit<SignupFormInput, "confirmPassword">;
