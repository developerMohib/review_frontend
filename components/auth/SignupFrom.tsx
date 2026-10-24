"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { getErrorMessage } from "@/lib/api/auth";
import { SignupInput, signupSchema } from "@/lib/validators/auth.validation";

export default function SignupForm() {
  const [showPass, setShowPass] = useState(false);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // ২. API Mutation for Registration
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignupInput) => {
      const response = await api.post<{ success: boolean; message: string }>("/auth/register", data);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message || "Account created successfully!");
      setTimeout(() => {
        redirect("/login");
      }, 1000);
    },
    onError: (error) => {
          const errorMsg = getErrorMessage(error);
          toast.error(errorMsg);
          form.setError("root", { message: errorMsg });
        },
  });

  const onSubmit = (data: SignupInput) => {
    mutate(data);
  };

  return (
    <main className="signup-page flex min-h-screen flex-col items-center px-4 py-10 bg-background">
      <Link className="brand-link mb-6" href="/" aria-label="CodeRabbit home">
        <Image src="/coderabbit-logo.png" alt="CodeRabbit" width={226} height={36} priority />
      </Link>

      <section className="signup-card w-full max-w-md border border-border bg-white shadow-sm rounded-xl">
        <div className="eyebrow mb-3">
          <span className="eyebrow-dot" /> YOUR NEXT STEP STARTS HERE
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Create your account
        </h1>
        <p className="auth-intro text-muted text-sm mb-6">
          Join the project review community and share what you’re building.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form space-y-4">
          <FieldGroup>
            {/* Name Field */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name" className="text-foreground">
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    autoComplete="name"
                    placeholder="Alex Morgan"
                    className="h-11 border-border bg-white text-foreground placeholder:text-muted focus:border-(--orange) focus:ring-3 focus:ring-(--orange)/10 transition-all"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-email" className="text-foreground">
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11 border-border bg-white text-foreground placeholder:text-muted focus:border-(--orange) focus:ring-3 focus:ring-(--orange)/10 transition-all"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-password" className="text-foreground">
                    Password
                  </FieldLabel>
                  <div className="relative mt-1.5">
                    <Input
                      {...field}
                      id="signup-password"
                      type={showPass ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      className="h-11 pr-10 border-border bg-white text-foreground placeholder:text-muted focus:border-(--orange) focus:ring-3 focus:ring-(--orange)/10 transition-all"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPass((prev) => !prev)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      className="absolute right-0 top-0 h-full px-3 text-muted hover:bg-transparent hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Root Error Message */}
            {form.formState.errors.root && (
              <p className="text-sm text-red-500 font-medium text-center" role="alert">
                {form.formState.errors.root.message}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="primary-button auth-submit w-full h-11 text-sm font-semibold mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight size={17} />
                </>
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 space-y-4">
          <p className="demo-hint flex items-start gap-2 text-muted text-xs">
            <Check size={15} className="mt-0.5 text-green-600 shrink-0" /> 
            <span>Secure registration. Your data is protected with industry-standard encryption.</span>
          </p>
          <p className="auth-switch text-sm text-muted text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-(--orange-dark) underline underline-offset-4 hover:text-(--orange) transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <p className="signup-footer flex items-center gap-1.5 mt-6 text-xs text-muted">
        <ShieldCheck size={15} className="text-green-600" /> Your project journey, all in one place.
      </p>
    </main>
  );
}