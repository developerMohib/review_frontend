import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Plus,
  TrendingUp,
} from "lucide-react";
import SubmissionTable from "@/components/mentor/SubmissionTable";

const weeklyBars = [
  { label: "Mon", height: 38 },
  { label: "Tue", height: 58 },
  { label: "Wed", height: 46 },
  { label: "Thu", height: 78 },
  { label: "Fri", height: 54 },
  { label: "Sat", height: 89 },
  { label: "Sun", height: 68 },
];

export default function MentorDashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> TUESDAY, OCTOBER 21, 2026</div>
          <h1>Good morning, Jordan <span className="wave">✦</span></h1>
          <p>Here’s what’s happening with your project community today.</p>
        </div>
        <Link className="primary-button heading-button" href="/dashboard/student/submit"><Plus size={17} /> New submission</Link>
      </div>

      <section className="stats-grid" aria-label="Submission statistics">
        <StatCard label="Total submissions" value="128" change="+12.8%" hint="vs. last month" icon={<TrendingUp size={18} />} color="orange" trend="up" />
        <StatCard label="Awaiting review" value="8" change="Needs attention" hint="Oldest is 2 days old" icon={<Clock3 size={18} />} color="amber" trend="neutral" />
        <StatCard label="Approved projects" value="104" change="+8.2%" hint="vs. last month" icon={<CheckCircle2 size={18} />} color="green" trend="up" />
        <StatCard label="Needs changes" value="16" change="-2.4%" hint="vs. last month" icon={<ArrowDownRight size={18} />} color="blue" trend="down" />
      </section>

      <section className="insights-grid">
        <div className="chart-card">
          <div className="card-heading">
            <div><h2>Submission activity</h2><p>Projects submitted this week</p></div>
            <button className="select-button" type="button">This week <ArrowRight size={14} /></button>
          </div>
          <div className="chart-summary"><strong>36</strong><span className="change-positive"><ArrowUpRight size={14} /> 18.4%</span><small>vs. last week</small></div>
          <div className="bar-chart" aria-label="Submissions this week: Monday 8, Tuesday 13, Wednesday 10, Thursday 18, Friday 12, Saturday 21, Sunday 16">
            {weeklyBars.map((bar) => (
              <div className="bar-column" key={bar.label}>
                <div className="bar-track"><span className={bar.label === "Sat" ? "bar-fill highlighted" : "bar-fill"} style={{ height: `${bar.height}%` }} /></div>
                <span>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="review-card">
          <div className="card-heading"><div><h2>Review queue</h2><p>Keep the momentum going</p></div><div className="queue-icon"><Clock3 size={18} /></div></div>
          <div className="queue-count"><strong>08</strong><span>projects need<br />your feedback</span></div>
          <div className="queue-progress"><span /></div>
          <div className="queue-details"><span><i className="dot dot-orange" /> Due today <strong>3</strong></span><span><i className="dot dot-muted" /> This week <strong>5</strong></span></div>
          <Link className="queue-link" href="/dashboard/mentor">Open review queue <ArrowRight size={15} /></Link>
        </div>
      </section>

      <SubmissionTable />
      <p className="demo-disclaimer">Demo workspace · All data shown is sample content for preview purposes.</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  hint,
  icon,
  color,
  trend,
}: {
  label: string;
  value: string;
  change: string;
  hint: string;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <span className="stat-label">{label}</span>
      <div className="stat-value">{value}</div>
      <div className="stat-bottom">
        <span className={`stat-change ${trend}`}>{trend === "up" ? <ArrowUpRight size={13} /> : null}{change}</span>
        <span>{hint}</span>
      </div>
    </article>
  );
}
