import React, { useState } from "react";

export default function DetailedProjectAnalytics({ projectStats = {} }) {
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [timeRange, setTimeRange] = useState("30days");

  // Sample data - would be populated from real data
  const defaultStats = {
    totalProjects: 24,
    activeProjects: 12,
    completedProjects: 8,
    onHoldProjects: 4,
    avgProgress: 67,
    studentProjects: 18,
    guidedProjects: 6,
    completionRate: 85,
    onTimeDelivery: 92,
    projectsByStatus: {
      draft: 3,
      active: 12,
      review: 5,
      completed: 4
    },
    projectsByCategory: {
      "Machine Learning": 8,
      "Web Development": 7,
      "Mobile Apps": 5,
      "Data Analysis": 4
    },
    monthlyGrowth: [5, 8, 12, 15, 18, 24],
    weeklySubmissions: [3, 5, 2, 7, 4, 6, 8]
  };

  const stats = { ...defaultStats, ...projectStats };

  const MetricCard = ({ icon, label, value, change, color }) => (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: 16,
      flex: 1,
      minWidth: 150
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 24 }}>{icon}</div>
        {change !== undefined && (
          <span style={{
            color: change >= 0 ? "#48bb78" : "#f56565",
            fontSize: 12,
            fontWeight: 600
          }}>
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 6 }}>
        {label}
      </p>
      <h3 style={{ color: color || "var(--primary)", fontSize: 28, fontWeight: 700 }}>
        {value}
      </h3>
    </div>
  );

  const BarChart = ({ data, labels, title }) => {
    const max = Math.max(...data);
    return (
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 20,
        marginBottom: 16
      }}>
        <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
          {title}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${labels.length}, 1fr)`, gap: 16 }}>
          {data.map((value, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div style={{
                background: "linear-gradient(180deg, #5f7df0, #4854d4)",
                height: `${(value / max) * 200}px`,
                borderRadius: 6,
                marginBottom: 12,
                transition: "all 0.3s",
                cursor: "pointer"
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = "0.7";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = "1";
                }}
              />
              <span style={{ color: "var(--text2)", fontSize: 12 }}>{labels[idx]}</span>
              <p style={{ color: "var(--text)", fontWeight: 600, marginTop: 4 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PieChart = ({ data, labels, title }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const colors = ["#5f7df0", "#48bb78", "#f59e0b", "#f56565"];
    let currentAngle = 0;

    return (
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 20,
        marginBottom: 16
      }}>
        <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
          {title}
        </h3>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {/* Legend */}
          <div style={{ flex: 1 }}>
            {Object.entries(data).map((entry, idx) => {
              const [label, value] = entry;
              const percentage = ((value / total) * 100).toFixed(1);
              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    background: colors[idx % colors.length],
                    borderRadius: 2
                  }} />
                  <span style={{ color: "var(--text2)", fontSize: 13, flex: 1 }}>{label}</span>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>{percentage}%</span>
                </div>
              );
            })}
          </div>

          {/* Simple Pie Representation */}
          <div style={{
            width: 150,
            height: 150,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              background: `conic-gradient(
                ${Object.values(data).map((value, idx) => {
                  const percentage = (value / total) * 100;
                  return `${colors[idx % colors.length]} 0deg ${(percentage / 100) * 360}deg`;
                }).join(", ")}
              )`,
              borderRadius: "50%",
              boxShadow: "0 8px 32px rgba(95, 125, 240, 0.2)"
            }} />
            <div style={{
              position: "absolute",
              width: "70%",
              height: "70%",
              background: "var(--card)",
              borderRadius: "50%"
            }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
          📊 Detailed Project Analytics
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: "8px 12px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--text)",
            cursor: "pointer",
            fontSize: 12
          }}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Overview Metrics */}
      {selectedMetric === "overview" && (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginBottom: 24
          }}>
            <MetricCard icon="📊" label="Total Projects" value={stats.totalProjects} change={8} />
            <MetricCard icon="⚡" label="Active" value={stats.activeProjects} change={12} color="#48bb78" />
            <MetricCard icon="✅" label="Completed" value={stats.completedProjects} change={5} color="#48bb78" />
            <MetricCard icon="⏸️" label="On Hold" value={stats.onHoldProjects} change={-2} color="#f59e0b" />
            <MetricCard icon="📈" label="Avg Progress" value={`${stats.avgProgress}%`} color="#5f7df0" />
            <MetricCard icon="🎯" label="Completion Rate" value={`${stats.completionRate}%`} change={3} color="#48bb78" />
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <BarChart
              title="Monthly Project Growth"
              data={stats.monthlyGrowth}
              labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            />
            <PieChart
              title="Projects by Status"
              data={stats.projectsByStatus}
              labels={Object.keys(stats.projectsByStatus)}
            />
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <PieChart
              title="Projects by Category"
              data={stats.projectsByCategory}
              labels={Object.keys(stats.projectsByCategory)}
            />
            <BarChart
              title="Weekly Submissions"
              data={stats.weeklySubmissions}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
          </div>
        </>
      )}

      {/* Detailed Statistics */}
      {selectedMetric === "detailed" && (
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 20
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Key Metrics */}
            <div>
              <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
                Key Performance Indicators
              </h3>
              <div style={{ display: "grid", gap: 12 }}>
                <MetricRow label="On-Time Delivery Rate" value={`${stats.onTimeDelivery}%`} />
                <MetricRow label="Student Projects" value={stats.studentProjects} />
                <MetricRow label="Guided Projects" value={stats.guidedProjects} />
                <MetricRow label="Avg Days to Complete" value="45" />
                <MetricRow label="Quality Score" value="8.7/10" />
              </div>
            </div>

            {/* Distribution */}
            <div>
              <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
                Project Distribution
              </h3>
              <div style={{ display: "grid", gap: 12 }}>
                {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                  <div key={status} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ flex: "0 0 80px", color: "var(--text2)", textTransform: "capitalize" }}>
                      {status}
                    </span>
                    <div style={{
                      flex: 1,
                      height: 8,
                      background: "var(--bg2)",
                      borderRadius: 4,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #5f7df0, #4854d4)",
                        width: `${(count / stats.totalProjects) * 100}%`
                      }} />
                    </div>
                    <span style={{ flex: "0 0 30px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MetricRow = ({ label, value }) => (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid var(--border)"
  }}>
    <span style={{ color: "var(--text2)", fontSize: 13 }}>{label}</span>
    <strong style={{ color: "var(--text)", fontSize: 14 }}>{value}</strong>
  </div>
);
