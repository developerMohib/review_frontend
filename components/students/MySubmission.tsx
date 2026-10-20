"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft, ArrowUpRight, Check, Clock3, Code2, ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/mentor/SubmissionTable";

interface StudentSubmission {
  project: string;
  repository: string;
  liveUrl: string;
  category: string;
  description: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Needs changes";
}

const exampleSubmission: StudentSubmission = {
  project: "Launchpad — SaaS starter",
  repository: "https://github.com/alexmorgan/launchpad",
  liveUrl: "https://launchpad-demo.example.com",
  category: "Web app",
  description: "A clean, customizable starter kit for launching a SaaS product. Built with Next.js, TypeScript, and Tailwind CSS.",
  submittedAt: "2026-10-20T14:30:00.000Z",
  status: "Pending",
};

function subscribeToSubmission(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredSubmission() {
  return localStorage.getItem("demo-student-submission");
}

export default function MySubmission() {
  const stored = useSyncExternalStore(subscribeToSubmission, getStoredSubmission, () => null);
  const submission = stored ? JSON.parse(stored) as StudentSubmission : exampleSubmission;

  const submittedDate = new Date(submission.submittedAt);
  const formattedDate = Number.isNaN(submittedDate.getTime())
    ? "Recently"
    : submittedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="dashboard-page form-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> STUDENT WORKSPACE</div>
          <h1>My submission</h1>
          <p>Track your project review and see what comes next.</p>
        </div>
        <Link className="secondary-button heading-button" href="/dashboard/student/submit"><ArrowLeft size={16} /> New project</Link>
      </div>

      <div className="my-submission-layout">
        <section className="submission-detail-card">
          <div className="submission-detail-top">
            <div className="detail-project-icon"><Code2 size={20} /></div>
            <div className="detail-title"><div className="eyebrow">{submission.category.toUpperCase()} <span className="detail-dot">·</span> SUBMITTED {formattedDate.toUpperCase()}</div><h2>{submission.project}</h2></div>
            <StatusBadge status={submission.status} />
          </div>
          <p className="submission-description">{submission.description}</p>
          <div className="submission-links">
            <a href={submission.repository} target="_blank" rel="noreferrer"><Code2 size={16} /> Repository <ArrowUpRight size={14} /></a>
            {submission.liveUrl && <a href={submission.liveUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Live demo <ArrowUpRight size={14} /></a>}
          </div>
          <div className="detail-divider" />
          <div className="review-timeline">
            <h3>Review progress</h3>
            <div className="timeline-step done"><span className="timeline-marker"><Check size={13} /></span><div><strong>Project submitted</strong><small>Your project is in the review queue.</small></div><time>{formattedDate}</time></div>
            <div className="timeline-step current"><span className="timeline-marker"><Clock3 size={14} /></span><div><strong>Waiting for mentor review</strong><small>You’ll see feedback here as soon as it’s ready.</small></div><span className="timeline-now">IN PROGRESS</span></div>
            <div className="timeline-step upcoming"><span className="timeline-marker" /><div><strong>Review complete</strong><small>Feedback and next steps will appear here.</small></div></div>
          </div>
        </section>

        <aside className="submission-aside">
          <div className="reviewer-card">
            <div className="reviewer-illustration"><MessageCircle size={23} /><span><Sparkles size={13} /></span></div>
            <h3>Good things take a little time</h3>
            <p>A mentor will review your project and leave thoughtful feedback. Most reviews arrive within 2–3 days.</p>
            <div className="reviewer-note"><span className="reviewer-avatar">JD</span><span>Reviews are handled by<br /><strong>our mentor community</strong></span></div>
          </div>
          <div className="submission-info"><Clock3 size={17} /><p>While you wait, keep building. You’ll get a notification when your review is ready.</p></div>
        </aside>
      </div>
    </div>
  );
}
