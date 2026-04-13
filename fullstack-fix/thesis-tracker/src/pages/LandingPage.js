import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Personality Assessment",
    description: "Discover your Big Five traits with guided assessment and personalized insights.",
    icon: "🧠",
  },
  {
    title: "Skill Tracking",
    description: "Track skills, compare performance, and identify your strongest growth areas.",
    icon: "📈",
  },
  {
    title: "SMART Goals",
    description: "Set measurable goals, milestones, and monitor progress in real time.",
    icon: "🎯",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-badge">Smart Thesis</span>
        </div>
        <div className="landing-nav">
          <button onClick={() => navigate("/login")} className="btn btn-outline">Log In</button>
          <button onClick={() => navigate("/register")} className="btn">Get Started</button>
        </div>
      </header>

      <main className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">Your personal project companion</span>
          <h1>Shape Your Future Self</h1>
          <p>Manage your thesis journey, submit papers, track supervisor feedback, and stay ahead with a smarter workflow.</p>
          <div className="landing-actions">
            <button className="btn" onClick={() => navigate("/register")}>
              Start Free
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/login")}>
              Log In
            </button>
          </div>
        </div>
        <div className="landing-visual">
          <div className="hero-card">
            <div className="hero-card-top">
              <div>
                <div className="hero-chip">Project Insights</div>
                <h3>Smart Thesis Dashboard</h3>
              </div>
            </div>
            <div className="hero-card-body">
              <div className="stat-box">
                <span>86%</span>
                <p>Submission success</p>
              </div>
              <div className="stat-box">
                <span>24</span>
                <p>Active reviewers</p>
              </div>
              <div className="stat-box">
                <span>450+</span>
                <p>Chapters tracked</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="landing-features">
        <div className="section-header">
          <p className="eyebrow">Core benefits</p>
          <h2>Everything you need to succeed</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <h2>Bring your thesis project to life</h2>
        <p>Start today and give your team a better way to submit, review, and manage every milestone.</p>
        <button className="btn" onClick={() => navigate("/register")}>Create Free Account</button>
      </section>
    </div>
  );
}
