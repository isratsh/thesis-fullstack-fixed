import React, { useState } from "react";

export default function CommentsSection({ projectId, comments = [], onAddComment }) {
  const [newComment, setNewComment] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({
        id: Date.now(),
        author: localStorage.getItem("userName") || "User",
        role: localStorage.getItem("userRole") || "student",
        text: newComment,
        timestamp: new Date().toLocaleDateString(),
        avatar: "👤"
      });
      setNewComment("");
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        cursor: "pointer"
      }} onClick={() => setExpanded(!expanded)}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
          💬 Comments ({comments.length})
        </h3>
        <span style={{ color: "var(--text2)", fontSize: 12 }}>
          {expanded ? "▼" : "▶"}
        </span>
      </div>

      {expanded && (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your feedback or comment..."
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid var(--border)",
                borderRadius: 10,
                background: "var(--bg2)",
                color: "var(--text)",
                fontSize: 14,
                fontFamily: "inherit",
                minHeight: 80,
                resize: "vertical",
                marginBottom: 10
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #5f7df0, #4854d4)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13
              }}
            >
              Post Comment
            </button>
          </form>

          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {comments.length === 0 ? (
              <p style={{ color: "var(--text2)", fontSize: 13, textAlign: "center", padding: 20 }}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map(comment => (
                <div
                  key={comment.id}
                  style={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: 14,
                    marginBottom: 12,
                    display: "flex",
                    gap: 12
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #5f7df0, #4854d4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0
                  }}>
                    {comment.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <strong style={{ color: "var(--text)" }}>{comment.author}</strong>
                      <span style={{
                        background: "var(--primary)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 50,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "capitalize"
                      }}>
                        {comment.role}
                      </span>
                      <span style={{ color: "var(--text2)", fontSize: 12, marginLeft: "auto" }}>
                        {comment.timestamp}
                      </span>
                    </div>
                    <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
