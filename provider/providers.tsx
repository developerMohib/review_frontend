"use client";
import { UserProvider } from "./UserContext";

export default function CustomProviders({ children }: { children: React.ReactNode }) {
    return <UserProvider>{children}</UserProvider>;
}