"use client";

import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Code2, ExternalLink, Info, Sparkles } from "lucide-react";

interface StudentSubmission {
  project: string;
  repository: string;
  liveUrl: string;
  category: string;
  description: string;
  submittedAt: string;
  status: "Pending";
}

export default function SubmissionFrom() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submission: StudentSubmission = {
      project: String(formData.get("project") ?? ""),
      repository: String(formData.get("repository") ?? ""),
      liveUrl: String(formData.get("liveUrl") ?? ""),
      category: String(formData.get("category") ?? "Web app"),
      description: String(formData.get("description") ?? ""),
      submittedAt: new Date().toISOString(),
      status: "Pending",
    };
    localStorage.setItem("demo-student-submission", JSON.stringify(submission));
    router.push("/dashboard/student/submission");
  }

  return (
    <div className="dashboard-page form-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> STUDENT WORKSPACE</div>
          <h1>Share what you’ve built</h1>
          <p>Submit your project and get thoughtful feedback from a mentor.</p>
        </div>
      </div>

      <div className="submission-layout">
        <form className="submission-form-card" onSubmit={handleSubmit}>
          <div className="form-section-title"><span className="form-step">01</span><div><h2>Project details</h2><p>Tell us a little about your work.</p></div></div>
          <div className="form-field">
            <label htmlFor="project">Project name <span>*</span></label>
            <input id="project" name="project" placeholder="e.g. Launchpad — SaaS starter" required minLength={3} />
          </div>
          <div className="form-field">
            <label htmlFor="category">Project category <span>*</span></label>
            <select id="category" name="category" defaultValue="Web app">
              <option>Web app</option>
              <option>Mobile app</option>
              <option>Open source</option>
              <option>Data & AI</option>
              <option>Design</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="repository">Repository URL <span>*</span></label>
            <div className="field-with-icon"><Code2 size={17} /><input id="repository" name="repository" type="url" placeholder="https://github.com/username/project" required /></div>
          </div>
          <div className="form-field">
            <label htmlFor="liveUrl">Live demo URL <span className="optional-label">OPTIONAL</span></label>
            <div className="field-with-icon"><ExternalLink size={16} /><input id="liveUrl" name="liveUrl" type="url" placeholder="https://your-project.com" /></div>
          </div>
          <div className="form-field">
            <label htmlFor="description">Project description <span>*</span></label>
            <textarea id="description" name="description" placeholder="What does your project do? What are you most proud of?" minLength={20} maxLength={500} required rows={5} />
            <span className="field-caption">Share the problem you’re solving and any details your reviewer should know.</span>
          </div>
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => router.back()}><ArrowLeft size={16} /> Go back</button>
            <button className="primary-button" type="submit">Submit project <ArrowRight size={16} /></button>
          </div>
        </form>

        <aside className="submission-aside">
          <div className="aside-tip-card">
            <div className="tip-spark"><Sparkles size={18} /></div>
            <div className="eyebrow">A QUICK TIP</div>
            <h3>Help your project shine</h3>
            <p>A clear README and a working demo help your mentor understand your work and give more useful feedback.</p>
            <div className="tip-check"><span>✓</span> Repository is public or accessible</div>
            <div className="tip-check"><span>✓</span> Include setup instructions</div>
            <div className="tip-check"><span>✓</span> Add a live demo if you can</div>
          </div>
          <div className="submission-info"><Info size={17} /><p>You can submit one project at a time. Once it’s reviewed, you can share your next one.</p></div>
        </aside>
      </div>
    </div>
  );
}
