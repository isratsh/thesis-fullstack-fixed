import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../App";

const roles = [
  { id: "student", icon: "🎓", label: "Student" },
  { id: "supervisor", icon: "👨‍🏫", label: "Supervisor" },
  { id: "admin", icon: "⚙️", label: "Admin" },
];

export default function Register() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    department: "Computer Science & Engineering",
    batch: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!formData.name.trim() || !formData.userId.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await register(formData);
      addToast("Account created successfully! Welcome, " + user.name.split(" ")[0] + "! 👋", "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px", background: "var(--card)", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>📝</div>
          <h2 style={{ margin: "0", color: "var(--text)" }}>Create Account</h2>
          <p style={{ margin: "5px 0 0", color: "var(--text2)", fontSize: "14px" }}>Join the Smart Thesis System</p>
        </div>

        {error && <div style={{ color: "#e74c3c", textAlign: "center", marginBottom: "15px", fontSize: "14px" }}>{error}</div>}

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>User ID *</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="e.g., 2021-CS-045"
            style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>Password *</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>Confirm Password *</label>
          <input
            type={showPass ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.icon} {role.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>Batch</label>
          <input
            type="text"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            placeholder="e.g., 2021"
            style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "var(--text)", fontSize: "14px" }}>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            style={{ width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--input)", color: "var(--text)" }}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "var(--text2)" : "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <span style={{ color: "var(--text2)", fontSize: "14px" }}>Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", textDecoration: "underline" }}
          >
            Login here
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "18px", color: "var(--text2)", fontSize: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
          © 2026 Smart Thesis System — Developed by Israt &amp; Marjana
        </div>
      </div>
    </div>
  );
}