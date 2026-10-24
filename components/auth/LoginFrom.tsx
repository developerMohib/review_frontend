"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, User, GraduationCap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import AuthShowcase from "@/components/auth/AuthShowcase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getErrorMessage, loginRequest } from "@/lib/api/auth";
import { LoginInput, loginSchema } from "@/lib/validators/auth.validation";
import { UserRole } from "@/types";

export default function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const fillDemoCredentials = (role: UserRole) => {
    if (role === "student") {
      form.setValue("email", "student@example.com");
      form.setValue("password", "password123");
      toast.info("Student demo credentials filled");
    } else {
      form.setValue("email", "mentor@example.com");
      form.setValue("password", "password123");
      toast.info("Mentor demo credentials filled");
    }
  };

const { mutate, isPending } = useMutation({
  mutationFn: loginRequest,
  onSuccess: (response) => {
    const { message, user } = response;

    toast.success(message || "Login successful!");
    
    if (user.role === "mentor") {
      router.push("/dashboard/mentor");
    } else if (user.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/student");
    }
  },
  onError: (error) => {
    const errorMsg = getErrorMessage(error);
    toast.error(errorMsg);
    form.setError("root", { message: errorMsg });
  },
});
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link href="/" aria-label="CodeRabbit home" className="brand-link">
          <Image
            src="/coderabbit-logo.png"
            alt="CodeRabbit"
            width={620}
            height={96}
            priority
          />
        </Link>

      <Card className="auth-card w-full max-w-md border-border shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          {/* Custom Eyebrow from your CSS */}
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            PROJECT REVIEW PORTAL
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted text-sm leading-relaxed">
            Sign in to submit your work or review the latest projects.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fillDemoCredentials("student")}
              className="h-9 text-xs font-semibold border-border text-foreground hover:bg-[#f7f8fa] hover:border-(--orange) hover:text-(--orange) transition-colors"
            >
              <User className="mr-2 h-3.5 w-3.5" />
              Demo Student
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => fillDemoCredentials("mentor")}
              className="h-9 text-xs font-semibold border-border text-foreground hover:bg-[#f7f8fa] hover:border-(--orange) hover:text-(--orange) transition-colors"
            >
              <GraduationCap className="mr-2 h-3.5 w-3.5" />
              Demo Mentor
            </Button>
          </div>

          <form onSubmit={form.handleSubmit((values) => mutate(values))} className="auth-form">
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email" className="text-foreground">
                      Email address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      aria-invalid={fieldState.invalid}
                      className="h-11 border-border bg-white text-foreground placeholder:text-muted focus:border-(--orange) focus:ring-3 focus:ring-(--orange)/10 transition-all"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="password-label">
                      <FieldLabel htmlFor="password" className="text-foreground">
                        Password
                      </FieldLabel>
                    </div>

                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPass ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        aria-invalid={fieldState.invalid}
                        className="h-11 pr-10 border-border bg-white text-foreground placeholder:text-muted focus:border-(--orange) focus:ring-3 focus:ring-(--orange)/10 transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPass((prev) => !prev)}
                        aria-label={showPass ? "Hide password" : "Show password"}
                        aria-pressed={showPass}
                        className="absolute right-0 top-0 h-full px-3 text-muted hover:bg-transparent hover:text-foreground"
                      >
                        {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </div>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {form.formState.errors.root && (
                <p className="text-sm text-red-500 font-medium text-center" role="alert">
                  {form.formState.errors.root.message}
                </p>
              )}

              <Button
                type="submit"
                className="primary-button auth-submit w-full h-11 text-sm font-semibold mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Sign in <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted text-center">
            New to CodeRabbit?{" "}
            <Link href="/signup" className="font-semibold text-(--orange-dark) underline underline-offset-4 hover:text-(--orange) transition-colors">
              Create an account
            </Link>
          </p>
          <div className="flex w-full items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-green-600" /> Secure project workspace
            </span>
            <span>© 2026 CodeRabbit</span>
          </div>
        </CardFooter>
      </Card>
      </section>
      <AuthShowcase />
    </main>
  );
}