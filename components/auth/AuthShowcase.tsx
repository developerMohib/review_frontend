import { Check, Code2, Sparkles } from "lucide-react";

export default function AuthShowcase() {
  return (
    <aside className="auth-art" aria-label="About the CodeRabbit project review workspace">
      <div className="art-orb art-orb-one" aria-hidden="true" />
      <div className="art-orb art-orb-two" aria-hidden="true" />

      <div className="art-content">
        <div className="art-kicker">
          <Sparkles size={14} />
          A BETTER WAY TO GROW
        </div>
        <h2>
          Build boldly.
          <br />
          <span>Get better.</span>
        </h2>
        <p>
          Share what you make, get thoughtful feedback, and keep moving forward
          with every project.
        </p>

        <div className="review-preview">
          <div className="preview-top">
            <div className="preview-avatar">CR</div>
            <div>
              <strong>Your project workspace</strong>
              <small>A clearer path from idea to impact</small>
            </div>
            <span className="preview-approved">
              <Check size={12} /> Mentor-led
            </span>
          </div>

          <div className="preview-project">
            <div className="project-icon">
              <Code2 size={16} />
            </div>
            <div>
              <strong>Ideas worth sharing</strong>
              <small>Projects · Feedback · Growth</small>
            </div>
          </div>

          <div className="preview-review">
            <span className="review-line" />
            <p>
              Every thoughtful review is a chance to learn, improve, and make
              your next idea even stronger.
            </p>
            <small>YOUR NEXT STEP STARTS HERE</small>
          </div>
        </div>

        <div className="art-footnote">
          <span />
          BUILD · SHARE · IMPROVE
        </div>
      </div>
    </aside>
  );
}
