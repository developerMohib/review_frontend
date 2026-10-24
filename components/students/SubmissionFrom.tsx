"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Code2, ExternalLink, Info, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner"; // আপনার প্রজেক্টে toast থাকলে
import { api } from "@/lib/axios"; // আপনার কনফিগার করা axios instance
import { getErrorMessage } from "@/lib/api/auth";
import { submissionSchema } from "@/lib/validators/submission.validation";

export default function SubmissionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      // শুধুমাত্র ফর্মের ডাটাগুলোই পাঠানো হবে। userId বা status এখানে নেই।
      const payload = {
        projectName: String(formData.get("project") ?? "").trim(),
        category: String(formData.get("category") ?? "Web app"),
        repoUrl: String(formData.get("repository") ?? "").trim(),
        liveUrl: String(formData.get("liveUrl") ?? "").trim(), // Optional handle
        description: String(formData.get("description") ?? "").trim(),
      };

      const parsed = submissionSchema.safeParse(payload);

      if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message;

        toast.error(firstError || "Please check the form fields");

        getErrorMessage(parsed.error);
        // সব error দেখতে চাইলে:
        console.log(parsed.error.flatten().fieldErrors);

        return;
      }

      const response = await api.post("/submissions", parsed.data);
      if (response.data.data.success) {
        toast.success(response.data.data.message || "Project submitted successfully! custom");
        router.push("/dashboard/student/submission");
        router.refresh();
      }

    } catch (error) {
      const errorMsg = getErrorMessage(error);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="dashboard-page form-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> STUDENT WORKSPACE</div>
          <h1>Share what you ve built</h1>
          <p>Submit your project and get thoughtful feedback from a mentor.</p>
        </div>
      </div>

      <div className="submission-layout">
        <form className="submission-form-card" onSubmit={handleSubmit}>
          <div className="form-section-title">
            <span className="form-step">01</span>
            <div><h2>Project details</h2><p>Tell us a little about your work.</p></div>
          </div>

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
            <div className="field-with-icon">
              <Code2 size={17} />
              <input id="repository" name="repository" type="url" placeholder="https://github.com/developerMohib" required />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="liveUrl">Live demo URL <span className="optional-label">OPTIONAL</span></label>
            <div className="field-with-icon">
              <ExternalLink size={16} />
              <input id="liveUrl" name="liveUrl" type="url" placeholder="https://your-project.com" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="description">Project description <span>*</span></label>
            <textarea id="description" name="description" placeholder="What does your project do? What are you most proud of?" minLength={20} maxLength={500} required rows={5} />
            <span className="field-caption">Share the problem you’re solving and any details your reviewer should know.</span>
          </div>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => router.back()} disabled={isSubmitting}>
              <ArrowLeft size={16} /> Go back
            </button>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <>Submit project <ArrowRight size={16} /></>
              )}
            </button>
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
          <div className="submission-info">
            <Info size={17} />
            <p>You can submit one project at a time. Once its reviewed, you can share your next one.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}