import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../App";

const roles = [
  { id: "student",    icon: "🎓", label: "Student" },
  { id: "supervisor", icon: "👨‍🏫", label: "Supervisor" },
  { id: "admin",      icon: "⚙️",  label: "Admin" },
];

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("student");
  const [userId, setUserId]   = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!userId.trim() || !password.trim()) { setError("Please fill in both fields."); return; }
    setError("");
    setLoading(true);
    try {
      const user = await login(userId.trim(), password);
      addToast("Welcome back, " + user.name + "! 👋", "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-icon">🎓</div>
          <div>
            <h1>SmartThesis</h1>
            <p>Thesis Management System</p>
          </div>
        </div>

        <div className="login-hero">
          <div>
            <p className="login-subtitle">Secure access for students, supervisors, and admins.</p>
            <p className="login-detail">Log in with your role-based credentials to manage submissions, reviews, and progress.</p>
          </div>
        </div>

        <label>Select Role</label>
        <div className="role-grid">
          {roles.map(r => (
            <button key={r.id} className={"role-btn " + (selectedRole === r.id ? "selected" : "")}
              onClick={() => { setSelectedRole(r.id); setError(""); setUserId(""); setPassword(""); }}>
              <span className="role-icon">{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        <label>Student / Employee ID</label>
        <input className="input" placeholder="Enter your user ID"
          value={userId} onChange={e => setUserId(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()} />

        <label>Password</label>
        <div className="password-field">
          <input className="input" type={showPass ? "text" : "password"}
            placeholder="Enter password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
          <button type="button" className="toggle-pass" onClick={() => setShowPass(s => !s)}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>

        {error && (
          <div className="login-error">⚠️ {error}</div>
        )}

        <button className="btn btn-full login-submit" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <span className="login-spinner">
              <span className="spinner" />
              Signing in...
            </span>
          ) : "🔐 Sign in"}
        </button>

        <div className="login-footer">
          <span>Don't have an account?</span>
          <button type="button" className="login-link" onClick={() => navigate("/register")}>Create one here</button>
        </div>

        <div className="login-page-footer">© 2026 Smart Thesis System — Developed by Israt &amp; Marjana</div>
      </div>
    </div>
  );
}
