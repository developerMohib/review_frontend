import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Plus,
  Sparkles,
} from "lucide-react";
import { UserData } from "@/types";

interface StudentDashboardProps {
  user: UserData;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
    const userName = user.name || "Student";

  return (
    <div className="dashboard-page student-dashboard">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" /> YOUR PROJECT WORKSPACE
          </div>
          <h1>
            Welcome back, {userName} <span className="wave">✦</span>
          </h1>
          <p>Keep up the great work. Your next idea starts here.</p>
        </div>
        <Link
          className="primary-button heading-button"
          href="/dashboard/student/submit"
        >
          <Plus size={17} /> Submit a project
        </Link>
      </div>

      <section className="student-dashboard-grid">
        <article className="student-project-card">
          <div className="card-heading">
            <div>
              <h2>Your latest project</h2>
              <p>A little progress is still progress.</p>
            </div>
            <Link
              className="subtle-link"
              href="/dashboard/student/submission"
            >
              View details <ArrowRight size={14} />
            </Link>
          </div>

          {/* ✅ যদি কোনো প্রজেক্ট না থাকে */}
          <div className="student-project-preview">
            <div className="student-project-symbol">
              <BookOpenCheck size={20} />
            </div>
            <div className="student-project-copy">
              <div className="student-project-meta">
                <span>NO PROJECTS YET</span>
              </div>
              <h3>Start your first project</h3>
              <p>
                Share your idea with the community and get valuable feedback
                from mentors.
              </p>
            </div>
          </div>

          <div className="student-review-note">
            <Sparkles size={15} />
            <span>
              Ready to submit your first project? Click the button above to get
              started!
            </span>
          </div>
        </article>

        <aside className="student-encouragement">
          <div className="encouragement-glow" />
          <span className="encouragement-icon">
            <Sparkles size={19} />
          </span>
          <div className="eyebrow">KEEP THE MOMENTUM</div>
          <h2>
            Small steps.
            <br />
            Big things.
          </h2>
          <p>
            Your next project could be the one that changes everything. Start
            when you’re ready.
          </p>
          <Link href="/dashboard/student/submit">
            Share another idea <ArrowUpRight size={15} />
          </Link>
        </aside>
      </section>

      <p className="demo-disclaimer">
        Welcome to your workspace · Start building amazing projects today.
      </p>
    </div>
  );
}