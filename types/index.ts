
export type UserRole = "student" | "mentor" | "admin";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
}
