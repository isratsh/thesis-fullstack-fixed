import React, { useState } from "react";
import { generateActivityLog } from "../services/reminders";

export default function ActivityTimeline({ events = [] }) {
  const [filter, setFilter] = useState('all');
  
  const timeline = generateActivityLog(events);
  
  const filtered = filter === 'all' 
    ? timeline 
    : timeline.filter(e => e.type === filter);

  const filterTypes = [
    { value: 'all', label: 'All' },
    { value: 'submission', label: 'Submissions' },
    { value: 'review', label: 'Reviews' },
    { value: 'status_change', label: 'Status Change' },
    { value: 'comment', label: 'Comments' }
  ];

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>
        📍 Activity Timeline
      </h2>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 8 }}>
        {filterTypes.map(ft => (
          <button
            key={ft.value}
            onClick={() => setFilter(ft.value)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "1px solid var(--border)",
              background: filter === ft.value ? "var(--primary)" : "transparent",
              color: filter === ft.value ? "white" : "var(--text2)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.3s",
              whiteSpace: "nowrap"
            }}
            onMouseEnter={e => {
              if (filter !== ft.value) {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.color = "var(--primary)";
              }
            }}
            onMouseLeave={e => {
              if (filter !== ft.value) {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text2)";
              }
            }}
          >
            {ft.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20
      }}>
        {filtered.length === 0 ? (
          <p style={{ color: "var(--text2)", textAlign: "center", padding: 40 }}>
            No activities to display
          </p>
        ) : (
          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div style={{
              position: "absolute",
              left: 20,
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(180deg, #5f7df0, transparent)",
              borderRadius: 2
            }} />

            {/* Timeline items */}
            <div style={{ position: "relative" }}>
              {filtered.map((event, idx) => (
                <div key={idx} style={{ marginBottom: 24, marginLeft: 60 }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: "absolute",
                    left: -42,
                    top: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--bg2)",
                    border: "3px solid var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14
                  }}>
                    {event.icon}
                  </div>

                  {/* Timeline content */}
                  <div style={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: 14,
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.background = "rgba(95,125,240,0.05)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--bg2)";
                  }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <strong style={{ color: "var(--text)" }}>
                        {event.title || event.type}
                      </strong>
                      <span style={{ 
                        background: "var(--primary)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 50,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "capitalize"
                      }}>
                        {event.category || event.type}
                      </span>
                    </div>
                    <p style={{ 
                      color: "var(--text2)", 
                      fontSize: 13, 
                      marginBottom: 8,
                      lineHeight: 1.5
                    }}>
                      {event.description || event.message}
                    </p>
                    <p style={{ 
                      color: "var(--text2)", 
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      ⏱️ {event.timeAgo}
                    </p>
                    {event.metadata && (
                      <div style={{ 
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: "1px solid var(--border)",
                        fontSize: 12,
                        color: "var(--text2)"
                      }}>
                        {event.metadata.by && <p>By: {event.metadata.by}</p>}
                        {event.metadata.status && <p>Status: {event.metadata.status}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
