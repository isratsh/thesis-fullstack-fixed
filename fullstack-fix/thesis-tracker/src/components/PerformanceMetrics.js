import React, { useState } from "react";

export default function PerformanceMetrics({ metrics = {} }) {
  const [selectedMetric, setSelectedMetric] = useState("overall");

  const defaultMetrics = {
    overallScore: 8.5,
    productivity: 85,
    quality: 92,
    timeliness: 88,
    collaboration: 90,
    creativity: 78,
    totalHours: 120,
    tasksCompleted: 24,
    tasksOnTrack: 22,
    tasksDelayed: 2,
    weeklyGrowth: [65, 70, 78, 82, 85, 88, 92],
    categoryScores: {
      "Research": 8.2,
      "Development": 8.8,
      "Testing": 8.5,
      "Documentation": 7.9
    }
  };

  const allMetrics = { ...defaultMetrics, ...metrics };

  const getScoreColor = (score) => {
    if (score >= 90) return "#48bb78";
    if (score >= 80) return "#f59e0b";
    if (score >= 70) return "#4299e1";
    return "#f56565";
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const ScoreCard = ({ icon, label, score, maxScore = 100 }) => (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: 16,
      textAlign: "center",
      transition: "all 0.3s"
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>

      <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 8, textTransform: "uppercase" }}>
        {label}
      </p>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--border)"
            strokeWidth="4"
          />
          {/* Score Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="4"
            strokeDasharray={`${(score / maxScore) * 283} 283`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s" }}
          />
        </svg>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: getScoreColor(score) }}>
            {score}
          </div>
          <div style={{ fontSize: 10, color: "var(--text2)" }}>{score}%</div>
        </div>
      </div>

      <div style{{
        fontSize: 36,
        fontWeight: 700,
        color: getScoreColor(score),
        letterSpacing: 2
      }}>
        {getScoreGrade(score)}
      </div>
    </div>
  );

  const MetricRow = ({ label, value, trend, trendValue }) => (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid var(--border)"
    }}>
      <span style={{ color: "var(--text2)", fontSize: 13 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <strong style={{ color: "var(--text)", fontSize: 14, minWidth: 50, textAlign: "right" }}>
          {value}
        </strong>
        {trend && (
          <span style={{
            color: trend === "up" ? "#48bb78" : "#f56565",
            fontSize: 12,
            fontWeight: 600,
            minWidth: 40
          }}>
            {trend === "up" ? "↑" : "↓"} {trendValue}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
        📈 Performance Metrics
      </h2>

      {/* Overall Score */}
      <div style={{
        background: "linear-gradient(135deg, #5f7df0, #4854d4)",
        borderRadius: 10,
        padding: 24,
        marginBottom: 24,
        color: "white"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ opacity: 0.9, marginBottom: 8 }}>Overall Performance Score</p>
            <h2 style={{ fontSize: 48, fontWeight: 700 }}>
              {allMetrics.overallScore}
              <span style={{ fontSize: 32 }}>/10</span>
            </h2>
            <p style={{ opacity: 0.8, fontSize: 13, marginTop: 8 }}>
              🎯 Grade: <strong>{getScoreGrade(allMetrics.overallScore * 10)}</strong>
            </p>
          </div>
          <div style={{ fontSize: 80, opacity: 0.2 }}>📊</div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12,
        marginBottom: 24
      }}>
        <ScoreCard icon="⚡" label="Productivity" score={allMetrics.productivity} />
        <ScoreCard icon="✨" label="Quality" score={allMetrics.quality} />
        <ScoreCard icon="⏰" label="Timeliness" score={allMetrics.timeliness} />
        <ScoreCard icon="🤝" label="Collaboration" score={allMetrics.collaboration} />
      </div>

      {/* Detailed Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        marginBottom: 24
      }}>
        {/* Left: Task Stats */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 20
        }}>
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
            Task Performance
          </h3>
          <MetricRow label="Total Tasks" value={allMetrics.tasksCompleted} />
          <MetricRow label="On Track" value={allMetrics.tasksOnTrack} trend="up" trendValue="12" />
          <MetricRow label="Delayed" value={allMetrics.tasksDelayed} trend="down" trendValue="5" />
          <MetricRow label="Success Rate" value={`${Math.round((allMetrics.tasksOnTrack / allMetrics.tasksCompleted) * 100)}%`} />
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <MetricRow label="Total Hours Logged" value={allMetrics.totalHours + "h"} />
            <MetricRow label="Avg. Per Task" value={Math.round(allMetrics.totalHours / allMetrics.tasksCompleted) + "h"} />
          </div>
        </div>

        {/* Right: Weekly Trend */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 20
        }}>
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
            Weekly Trend
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 150 }}>
            {allMetrics.weeklyGrowth.map((score, idx) => {
              const max = Math.max(...allMetrics.weeklyGrowth);
              const height = (score / max) * 130;
              return (
                <div
                  key={idx}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: height,
                      background: `linear-gradient(180deg, ${getScoreColor(score)}, ${getScoreColor(score)}cc)`,
                      borderRadius: 4,
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
                  <span style={{ color: "var(--text2)", fontSize: 10, marginTop: 8 }}>
                    {["M", "T", "W", "T", "F", "S", "S"][idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 20
      }}>
        <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
          Performance by Category
        </h3>

        <div style={{ display: "grid", gap: 16 }}>
          {Object.entries(allMetrics.categoryScores).map(([category, score]) => (
            <div key={category}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--text2)", fontSize: 12 }}>{category}</span>
                <span style={{ color: getScoreColor(score * 10), fontWeight: 700, fontSize: 12 }}>
                  {score}/10
                </span>
              </div>
              <div style={{
                height: 8,
                background: "rgba(95,125,240,0.1)",
                borderRadius: 4,
                overflow: "hidden"
              }}>
                <div
                  style={{
                    height: "100%",
                    background: getScoreColor(score * 10),
                    width: `${(score / 10) * 100}%`,
                    transition: "width 0.3s"
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12
        }}>
          <div>
            <p style={{ color: "var(--text2)", fontSize: 11, marginBottom: 4 }}>Average Category Score</p>
            <p style={{ color: "var(--primary)", fontSize: 20, fontWeight: 700 }}>
              {(Object.values(allMetrics.categoryScores).reduce((a, b) => a + b, 0) / Object.keys(allMetrics.categoryScores).length).toFixed(1)}/10
            </p>
          </div>
          <div>
            <p style={{ color: "var(--text2)", fontSize: 11, marginBottom: 4 }}>Best Category</p>
            <p style={{ color: "var(--primary)", fontSize: 14, fontWeight: 700 }}>
              {Object.entries(allMetrics.categoryScores).sort((a, b) => b[1] - a[1])[0][0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
