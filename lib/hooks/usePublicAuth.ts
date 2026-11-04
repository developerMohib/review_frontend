"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCurrentUserPublic,
  loginPublic,
  registerPublic,
} from "@/lib/api/auth.public";
import type { LoginInput, SignupInput } from "@/lib/validators/auth.validation";

export function usePublicLoginMutation() {
  return useMutation({
    mutationFn: (publicLoginInput: LoginInput) => loginPublic(publicLoginInput),
  });
}

export function usePublicRegisterMutation() {
  return useMutation({
    mutationFn: (publicSignupInput: SignupInput) =>
      registerPublic(publicSignupInput),
  });
}

export function usePublicCurrentUserQuery() {
  return useQuery({
    queryKey: ["public", "auth", "current-user"],
    queryFn: getCurrentUserPublic,
    retry: false,
  });
}
