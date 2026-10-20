import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Clock3,
  FileCheck2,
  Plus,
  Sparkles,
} from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="dashboard-page student-dashboard">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR PROJECT WORKSPACE</div>
          <h1>Welcome back, Alex <span className="wave">✦</span></h1>
          <p>Keep up the great work. Your next idea starts here.</p>
        </div>
        <Link className="primary-button heading-button" href="/dashboard/student/submit"><Plus size={17} /> Submit a project</Link>
      </div>

      <section className="student-stats">
        <article className="student-stat-card">
          <span className="student-stat-icon warm"><FileCheck2 size={18} /></span>
          <div><span>Projects submitted</span><strong>1</strong><small>Your ideas are taking shape</small></div>
        </article>
        <article className="student-stat-card">
          <span className="student-stat-icon gold"><Clock3 size={18} /></span>
          <div><span>In review</span><strong>1</strong><small>Usually reviewed in 2–3 days</small></div>
        </article>
        <article className="student-stat-card">
          <span className="student-stat-icon mint"><BookOpenCheck size={18} /></span>
          <div><span>Reviews received</span><strong>0</strong><small>Feedback helps you grow</small></div>
        </article>
      </section>

      <section className="student-dashboard-grid">
        <article className="student-project-card">
          <div className="card-heading">
            <div><h2>Your latest project</h2><p>A little progress is still progress.</p></div>
            <Link className="subtle-link" href="/dashboard/student/submission">View details <ArrowRight size={14} /></Link>
          </div>
          <div className="student-project-preview">
            <div className="student-project-symbol"><BookOpenCheck size={20} /></div>
            <div className="student-project-copy">
              <div className="student-project-meta"><span>WEB APP</span><span>·</span><span>SUBMITTED OCT 20</span></div>
              <h3>Launchpad — SaaS starter</h3>
              <p>A customizable starter kit for launching a SaaS product.</p>
            </div>
            <span className="status-badge status-pending"><span />Pending</span>
          </div>
          <div className="student-progress">
            <div className="student-progress-step complete"><span>✓</span><small>Submitted</small></div>
            <i />
            <div className="student-progress-step current"><span><Clock3 size={13} /></span><small>Mentor review</small></div>
            <i />
            <div className="student-progress-step"><span>3</span><small>Feedback</small></div>
          </div>
          <div className="student-review-note"><Clock3 size={15} /><span>Your project is in the queue. We’ll let you know when your review is ready.</span></div>
        </article>

        <aside className="student-encouragement">
          <div className="encouragement-glow" />
          <span className="encouragement-icon"><Sparkles size={19} /></span>
          <div className="eyebrow">KEEP THE MOMENTUM</div>
          <h2>Small steps.<br />Big things.</h2>
          <p>Your next project could be the one that changes everything. Start when you’re ready.</p>
          <Link href="/dashboard/student/submit">Share another idea <ArrowUpRight size={15} /></Link>
        </aside>
      </section>

      <p className="demo-disclaimer">Demo workspace · All data shown is sample content for preview purposes.</p>
    </div>
  );
}
