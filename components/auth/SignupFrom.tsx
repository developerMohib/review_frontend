"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

export default function SignupFrom() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.cookie = "demo-session=active; path=/; max-age=86400; SameSite=Lax";
    router.push("/dashboard/student/submit");
  }

  return (
    <main className="signup-page">
      <Link className="brand-link" href="/" aria-label="CodeRabbit home">
        <Image src="/coderabbit-logo.png" alt="CodeRabbit" width={226} height={36} priority />
      </Link>
      <section className="signup-card">
        <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT STEP STARTS HERE</div>
        <h1>Create your account</h1>
        <p className="auth-intro">Join the project review community and share what you’re building.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" required />
          <label htmlFor="signup-email">Email address</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" autoComplete="new-password" minLength={6} placeholder="At least 6 characters" required />
          <button className="primary-button auth-submit" type="submit">Create account <ArrowRight size={17} /></button>
        </form>
        <p className="demo-hint"><Check size={15} /> This prototype creates a local demo session only.</p>
        <p className="auth-switch">Already have an account? <Link href="/">Sign in</Link></p>
      </section>
      <p className="signup-footer"><ShieldCheck size={15} /> Your project journey, all in one place.</p>
    </main>
  );
}
