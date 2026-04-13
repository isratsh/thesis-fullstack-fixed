import React, { useState } from "react";

export default function DocumentStatusTracker({ documents = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      'draft': '#8a96b4',
      'submitted': '#4299e1',
      'under-review': '#ed8936',
      'approved': '#48bb78',
      'rejected': '#f56565',
      'revision-needed': '#f59e0b'
    };
    return colors[status] || '#5f7df0';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'draft': '📝',
      'submitted': '📤',
      'under-review': '🔍',
      'approved': '✅',
      'rejected': '❌',
      'revision-needed': '🔧'
    };
    return icons[status] || '📄';
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>
        📄 Document Status Tracker
      </h2>

      <div style={{ display: "grid", gap: 12 }}>
        {documents.length === 0 ? (
          <p style={{ color: "var(--text2)", textAlign: "center", padding: 40 }}>
            No documents yet
          </p>
        ) : (
          documents.map(doc => (
            <div
              key={doc.id}
              onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.background = "rgba(95,125,240,0.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--card)";
              }}
            >
              {/* Main info */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <span style={{ fontSize: 24 }}>📄</span>
                  <div>
                    <strong style={{ color: "var(--text)", display: "block", marginBottom: 4 }}>
                      {doc.title}
                    </strong>
                    <span style={{ color: "var(--text2)", fontSize: 12 }}>
                      Version {doc.version || '1.0'} • {doc.uploadDate || 'N/A'}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    background: getStatusColor(doc.status),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "capitalize"
                  }}>
                    {getStatusIcon(doc.status)} {doc.status}
                  </span>
                  <span style={{ color: "var(--text2)", fontSize: 16 }}>
                    {expandedId === doc.id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === doc.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  {/* Progress Bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600 }}>
                        Review Progress
                      </span>
                      <span style={{ color: getStatusColor(doc.status), fontWeight: 700 }}>
                        {doc.progress || 0}%
                      </span>
                    </div>
                    <div style={{
                      height: 6,
                      background: "rgba(95,125,240,0.1)",
                      borderRadius: 50,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        background: getStatusColor(doc.status),
                        width: `${doc.progress || 0}%`,
                        transition: "width 0.6s ease",
                        borderRadius: 50
                      }} />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <p style={{ color: "var(--text2)", fontSize: 11, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                        File Size
                      </p>
                      <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>
                        {doc.fileSize || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: "var(--text2)", fontSize: 11, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                        Last Modified
                      </p>
                      <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>
                        {doc.lastModified || 'N/A'}
                      </p>
                    </div>
                    {doc.reviewedBy && (
                      <>
                        <div>
                          <p style={{ color: "var(--text2)", fontSize: 11, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                            Reviewed By
                          </p>
                          <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>
                            {doc.reviewedBy}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: "var(--text2)", fontSize: 11, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                            Review Date
                          </p>
                          <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>
                            {doc.reviewDate || 'Pending'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Comments/Feedback */}
                  {doc.feedback && (
                    <div style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 16
                    }}>
                      <p style={{ color: "var(--text2)", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
                        📝 Feedback
                      </p>
                      <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.5 }}>
                        {doc.feedback}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {doc.status === 'draft' && (
                      <>
                        <button style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "linear-gradient(135deg, #5f7df0, #4854d4)",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          📤 Submit
                        </button>
                        <button style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "transparent",
                          color: "var(--text2)",
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          ✏️ Edit
                        </button>
                      </>
                    )}
                    {doc.status === 'revision-needed' && (
                      <button style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#f59e0b",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        🔧 Make Revision
                      </button>
                    )}
                    <button style={{
                      flex: 1,
                      padding: "8px 12px",
                      background: "transparent",
                      color: "var(--text2)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      📥 Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
