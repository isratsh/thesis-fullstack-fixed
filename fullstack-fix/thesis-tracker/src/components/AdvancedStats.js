import React, { useMemo } from "react";

export default function AdvancedStats({ projects = [], users = [] }) {
  const stats = useMemo(() => {
    if (!projects.length) {
      return {
        totalProjects: 0,
        completed: 0,
        inProgress: 0,
        onHold: 0,
        completionRate: 0,
        avgProgress: 0,
        upcomingDeadlines: 0,
        overdue: 0
      };
    }

    const now = new Date();
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status === 'in-progress').length;
    const onHold = projects.filter(p => p.status === 'on-hold').length;
    
    const avgProgress = Math.round(
      projects.reduce((sum, p) => sum + (parseInt(p.progress) || 0), 0) / projects.length
    );

    const upcoming = projects.filter(p => {
      const deadline = new Date(p.deadline);
      const daysUntil = (deadline - now) / (1000 * 60 * 60 * 24);
      return daysUntil > 0 && daysUntil <= 7;
    }).length;

    const overdue = projects.filter(p => {
      const deadline = new Date(p.deadline);
      return deadline < now && p.status !== 'completed';
    }).length;

    return {
      totalProjects: projects.length,
      completed,
      inProgress,
      onHold,
      completionRate: Math.round((completed / projects.length) * 100),
      avgProgress,
      upcomingDeadlines: upcoming,
      overdue
    };
  }, [projects]);

  const StatBox = ({ icon, label, value, color, trend }) => (
    <div style={{
      background: "var(--card)",
      border: `2px solid ${color || 'var(--border)'})`,
      borderRadius: 12,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      cursor: "pointer",
      transition: "all 0.3s",
      minHeight: 120,
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <span style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600 }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: color || "var(--text)" }}>
          {value}
        </div>
        {trend && (
          <span style={{ fontSize: 12, color: trend > 0 ? "#48bb78" : "#f56565" }}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>
        📊 Analytics Overview
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
        marginBottom: 24
      }}>
        <StatBox icon="📋" label="Total Projects" value={stats.totalProjects} color="#5f7df0" />
        <StatBox icon="✅" label="Completed" value={stats.completed} color="#48bb78" trend={12} />
        <StatBox icon="⏳" label="In Progress" value={stats.inProgress} color="#ed8936" />
        <StatBox icon="⏸️" label="On Hold" value={stats.onHold} color="#f56565" />
        <StatBox icon="📈" label="Avg Progress" value={`${stats.avgProgress}%`} color="#7c98ff" />
        <StatBox icon="🎯" label="Completion" value={`${stats.completionRate}%`} color="#48bb78" trend={8} />
        <StatBox icon="⏰" label="Due Soon" value={stats.upcomingDeadlines} color="#ed8936" />
        <StatBox icon="⚠️" label="Overdue" value={stats.overdue} color="#f56565" />
      </div>

      {/* Status Distribution */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>
          Status Distribution
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Completed", value: stats.completed, color: "#48bb78" },
            { label: "In Progress", value: stats.inProgress, color: "#ed8936" },
            { label: "On Hold", value: stats.onHold, color: "#f56565" }
          ].map(item => (
            <div key={item.label}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 700 }}>{item.value}</span>
              </div>
              <div style={{
                height: 8,
                background: "rgba(95,125,240,0.1)",
                borderRadius: 50,
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  background: item.color,
                  width: `${stats.totalProjects > 0 ? (item.value / stats.totalProjects) * 100 : 0}%`,
                  transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {(stats.upcomingDeadlines > 0 || stats.overdue > 0) && (
        <div style={{
          background: "linear-gradient(135deg, rgba(245,101,101,0.1), rgba(237,137,54,0.1))",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 16
        }}>
          <p style={{ color: "var(--text2)", fontSize: 13, fontWeight: 600 }}>
            ⚠️ Attention needed
          </p>
          {stats.upcomingDeadlines > 0 && (
            <p style={{ color: "#ed8936", fontSize: 12, marginTop: 4 }}>
              {stats.upcomingDeadlines} project(s) due within 7 days
            </p>
          )}
          {stats.overdue > 0 && (
            <p style={{ color: "#f56565", fontSize: 12, marginTop: 4 }}>
              {stats.overdue} project(s) overdue - Action required!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
