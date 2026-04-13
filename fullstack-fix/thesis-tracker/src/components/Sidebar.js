import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = {
  student: [
    { section: "Main" },
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/my-project", icon: "📄", label: "My Project" },
    { to: "/submit", icon: "📤", label: "Submit Chapter" },
    { section: "Tools" },
    { to: "/analytics", icon: "📊", label: "Analytics" },
    { to: "/resources", icon: "📚", label: "Resources" },
    { section: "Other" },
    { to: "/meetings", icon: "📅", label: "Meetings" },
    { to: "/notifications", icon: "🔔", label: "Notifications" },
    { to: "/profile", icon: "👤", label: "Profile" },
  ],
  supervisor: [
    { section: "Main" },
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/review", icon: "📝", label: "Review" },
    { to: "/analytics", icon: "📊", label: "Analytics" },
    { section: "Other" },
    { to: "/meetings", icon: "📅", label: "Meetings" },
    { to: "/notifications", icon: "🔔", label: "Notifications" },
    { to: "/profile", icon: "👤", label: "Profile" },
  ],
  admin: [
    { section: "Main" },
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/admin", icon: "⚙️", label: "Admin Panel" },
    { to: "/review", icon: "📝", label: "All Projects" },
    { to: "/analytics", icon: "📊", label: "Analytics" },
    { section: "Other" },
    { to: "/notifications", icon: "🔔", label: "Notifications" },
    { to: "/profile", icon: "👤", label: "Profile" },
  ],
};

export default function Sidebar({ role, dark, toggleDark }) {
  const { user } = useAuth();
  const location = useLocation();
  const items = navItems[role] || navItems.student;
  const userName = user?.name || localStorage.getItem("userName") || "User";
  const initials = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        🎓 Smart<span>Thesis</span>
        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 400, marginTop: 2 }}>
          Management System
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 8px 16px",
        borderBottom: "1px solid #334155",
        marginBottom: 8
      }}>
        <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{initials}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{userName}</div>
          <div style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{role}</div>
        </div>
      </div>

      {items.map((item, idx) => {
        if (item.section) {
          return <div key={idx} className="sidebar-section">{item.section}</div>;
        }
        return (
          <Link key={item.to} to={item.to}
            className={`sidebar-link ${location.pathname === item.to ? "active" : ""}`}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{
                background: "#ef4444", color: "white", fontSize: 9,
                padding: "2px 6px", borderRadius: 50, fontWeight: 700
              }}>{item.badge}</span>
            )}
          </Link>
        );
      })}

      <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid #334155" }}>
        <button onClick={toggleDark}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 10,
            border: "1px solid #334155", background: "transparent",
            color: "#94a3b8", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13, fontWeight: 600, transition: "all 0.3s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#334155"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          {dark ? "☀️" : "🌙"}
          <span>{dark ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </aside>
  );
}
