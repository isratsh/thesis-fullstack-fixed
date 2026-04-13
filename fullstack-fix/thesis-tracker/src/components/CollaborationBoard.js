import React, { useState } from "react";

export default function CollaborationBoard({ collaborators = [], tasks = [], onAddComment = () => {} }) {
  const [activeTab, setActiveTab] = useState("members");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const getRoleColor = (role) => {
    const colors = {
      'admin': '#8a96b4',
      'supervisor': '#4299e1',
      'reviewer': '#ed8936',
      'member': '#48bb78',
      'student': '#9f7aea'
    };
    return colors[role] || '#5f7df0';
  };

  const getRoleIcon = (role) => {
    const icons = {
      'admin': '👨‍💼',
      'supervisor': '👨‍🏫',
      'reviewer': '👁️',
      'member': '👤',
      'student': '👨‍🎓'
    };
    return icons[role] || '👤';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': '#48bb78',
      'away': '#f59e0b',
      'offline': '#718096'
    };
    return colors[status] || '#718096';
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        author: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "👤"
      };
      setComments([...comments, comment]);
      onAddComment(comment);
      setNewComment("");
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
        🤝 Collaboration Board
      </h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
        {["members", "activity", "discussion"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 16px",
              background: "transparent",
              color: activeTab === tab ? "var(--primary)" : "var(--text2)",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "capitalize",
              transition: "all 0.3s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
          {collaborators.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: 40,
              background: "var(--card)",
              borderRadius: 10,
              color: "var(--text2)"
            }}>
              <p>No collaborators yet</p>
            </div>
          ) : (
            collaborators.map(collaborator => (
              <div
                key={collaborator.id}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 16,
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
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    fontSize: 40,
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg2)",
                    borderRadius: "50%"
                  }}>
                    {getRoleIcon(collaborator.role)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                      {collaborator.name}
                    </h3>
                    <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 6 }}>
                      {collaborator.email}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 8,
                        height: 8,
                        background: getStatusColor(collaborator.status),
                        borderRadius: "50%"
                      }} />
                      <span style={{ color: "var(--text2)", fontSize: 11 }}>
                        {collaborator.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role & Stats */}
                <div style({
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--border)"
                }}>
                  <div>
                    <span
                      style={{
                        background: getRoleColor(collaborator.role),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        display: "inline-block",
                        textTransform: "capitalize"
                      }}
                    >
                      {collaborator.role}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11, color: "var(--text2)" }}>
                    <p>{collaborator.tasksCompleted || 0} tasks done</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "linear-gradient(135deg, #5f7df0, #4854d4)",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                    💬 Message
                  </button>
                  <button style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "transparent",
                    color: "var(--text2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                    📋 Tasks
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { icon: "📝", action: "John Doe", activity: "commented on Project Alpha", time: "2 hours ago" },
              { icon: "✅", action: "Jane Smith", activity: "completed Task Beta", time: "4 hours ago" },
              { icon: "📤", action: "Mike Johnson", activity: "submitted final report", time: "6 hours ago" },
              { icon: "👁️", action: "Sarah Wilson", activity: "reviewed Project Gamma", time: "1 day ago" },
              { icon: "🔄", action: "System", activity: "deadline approaching for Project Delta", time: "1 day ago" }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBottom: 16,
                  borderBottom: idx < 4 ? "1px solid var(--border)" : "none"
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "var(--text)", fontSize: 13, marginBottom: 4 }}>
                    <strong>{item.action}</strong> {item.activity}
                  </p>
                  <span style={{ color: "var(--text2)", fontSize: 11 }}>🕐 {item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discussion Tab */}
      {activeTab === "discussion" && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
          {/* Comments */}
          <div style={{ minHeight: 200, marginBottom: 20, maxHeight: 400, overflowY: "auto", paddingRight: 8 }}>
            {comments.length === 0 ? (
              <p style={{ color: "var(--text2)", textAlign: "center", padding: 40 }}>
                No discussion yet. Start the conversation!
              </p>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {comments.map(comment => (
                  <div
                    key={comment.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      paddingBottom: 12,
                      borderBottom: "1px solid var(--border)"
                    }}
                  >
                    <div style={{
                      fontSize: 24,
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--bg2)",
                      borderRadius: "50%",
                      flexShrink: 0
                    }}>
                      {comment.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                        <strong style={{ color: "var(--text)" }}>{comment.author}</strong>
                        <span style={{ color: "var(--text2)", fontSize: 12 }}>🕐 {comment.timestamp}</span>
                      </div>
                      <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.4 }}>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div style={{
            display: "flex",
            gap: 8,
            borderTop: "1px solid var(--border)",
            paddingTop: 16
          }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                color: "var(--text)",
                fontSize: 13,
                minHeight: 40,
                maxHeight: 100,
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
            <button
              onClick={handleAddComment}
              style={{
                padding: "10px 16px",
                background: "linear-gradient(135deg, #5f7df0, #4854d4)",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 12,
                height: 40,
                alignSelf: "flex-end"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
