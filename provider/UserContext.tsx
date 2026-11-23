"use client";

import { getCurrentUser } from "@/lib/apiServices/authService";
import { UserData } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";


interface UserContextType {
  user: UserData | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  refreshUser: () => Promise<void>;
  setUser: (user: UserData | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser ?? null);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!cancelled) setUser(currentUser ?? null);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ user, loading, refreshUser, setUser ,setLoading}),
    [user, loading, refreshUser,setLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("use User must be used within a UserProvider");
  }
  return context;
};