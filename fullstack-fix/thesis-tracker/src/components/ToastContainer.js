import React from "react";

const icons = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ fontSize: 18 }}>{icons[t.type] || icons.info}</span>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
