"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

type DemoRole = "mentor" | "student";

export default function LoginFrom() {
  const router = useRouter();
  const [role, setRole] = useState<DemoRole>("mentor");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.cookie = "demo-session=active; path=/; max-age=86400; SameSite=Lax";
    router.push(role === "mentor" ? "/dashboard" : "/dashboard/student");
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link className="brand-link" href="/" aria-label="CodeRabbit home">
          <Image src="/coderabbit-logo.png" alt="CodeRabbit" width={226} height={36} priority />
        </Link>

        <div className="auth-form-wrap">
          <div className="eyebrow"><span className="eyebrow-dot" /> PROJECT REVIEW PORTAL</div>
          <h1>Welcome back</h1>
          <p className="auth-intro">Sign in to submit your work or review the latest projects.</p>

          <div className="role-picker" aria-label="Choose a demo role">
            <button
              className={role === "mentor" ? "role-option active" : "role-option"}
              onClick={() => setRole("mentor")}
              type="button"
            >
              Mentor
            </button>
            <button
              className={role === "student" ? "role-option active" : "role-option"}
              onClick={() => setRole("student")}
              type="button"
            >
              Student
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            <div className="password-label">
              <label htmlFor="password">Password</label>
              <button type="button" className="text-button">Forgot password?</button>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
            <button className="primary-button auth-submit" type="submit">
              Sign in <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-divider"><span /> <span>DEMO ACCESS</span> <span /></div>
          <p className="demo-hint">
            Use any email and password to explore the {role} experience. No account or backend required.
          </p>
          <p className="auth-switch">New to CodeRabbit? <Link href="/signup">Create an account</Link></p>
        </div>

        <div className="auth-footer">
          <span><ShieldCheck size={15} /> Secure project workspace</span>
          <span>© 2026 CodeRabbit</span>
        </div>
      </section>
    </main>
  );
}
