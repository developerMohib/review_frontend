import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3
} from "lucide-react";
import SubmissionTable from "@/components/mentor/SubmissionTable";
import { UserData } from "@/types";

// ✅ ১. একটি Props ইন্টারফেস তৈরি করুন
interface MentorDashboardProps {
  user: UserData;
}

// ✅ ২. কম্পোনেন্টের প্যারামিটারে { user } ডিস্ট্রাকচার করুন
export default function MentorDashboard({ user }: MentorDashboardProps) {
  console.log('Mentor User:', user); // এখন এটি সঠিকভাবে লগ হবে

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> TUESDAY, OCTOBER 21, 2026</div>
          {/* ✅ হায়ারিং টাস্ক টিপস: এখানে user.name ব্যবহার করুন, হার্ডকোডেড "Jordan" নয় */}
          <h1>Good morning, {user.name} <span className="wave">✦</span></h1>
          <p>Here’s what’s happening with your project community today.</p>
        </div>
        
        {/* নোট: এটি মেন্টর ড্যাশবোর্ড, তাই এখানে Student-এর সাবমিশন লিংক না দিয়ে মেন্টর রিভিউ লিংক দেওয়া উচিত। 
            তবে টেম্পোরারি রাখতে চাইলে ঠিক আছে, পরে ঠিক করে নেবেন। */}
        <Link className="primary-button heading-button" href="/dashboard/mentor/review">
          <Clock3 size={17} /> Review Submissions
        </Link>
      </div>


      <section className="insights-grid">
        <div className="chart-card">
          <div className="card-heading">
            <div><h2>Submission activity</h2><p>Projects submitted this week</p></div>
            <button className="select-button" type="button">This week <ArrowRight size={14} /></button>
          </div>
          <div className="chart-summary"><strong>36</strong><span className="change-positive"><ArrowUpRight size={14} /> 18.4%</span><small>vs. last week</small></div>
          
        </div>
        <div className="review-card">
          <div className="card-heading"><div><h2>Review queue</h2><p>Keep the momentum going</p></div><div className="queue-icon"><Clock3 size={18} /></div></div>
          <div className="queue-count"><strong>08</strong><span>projects need<br />your feedback</span></div>
          <div className="queue-progress"><span /></div>
          <div className="queue-details"><span><i className="dot dot-orange" /> Due today <strong>3</strong></span><span><i className="dot dot-muted" /> This week <strong>5</strong></span></div>
          <Link className="queue-link" href="/dashboard/mentor/review">Open review queue <ArrowRight size={15} /></Link>
        </div>
      </section>

      <SubmissionTable />
      <p className="demo-disclaimer">Demo workspace · All data shown is sample content for preview purposes.</p>
    </div>
  );
}

