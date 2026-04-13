import React, { useState, useEffect } from "react";

export default function NotificationCenter({ notifications = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [readNotifications, setReadNotifications] = useState(new Set());

  const getNotificationIcon = (type) => {
    const icons = {
      'announcement': '📢',
      'deadline': '⏰',
      'review': '👁️',
      'comment': '💬',
      'assignment': '📌',
      'meeting': '📞',
      'approval': '✅',
      'rejection': '❌',
      'system': 'ℹ️'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'announcement': '#8a96b4',
      'deadline': '#f59e0b',
      'review': '#4299e1',
      'comment': '#9f7aea',
      'assignment': '#48bb78',
      'meeting': '#ed8936',
      'approval': '#48bb78',
      'rejection': '#f56565',
      'system': '#718096'
    };
    return colors[type] || '#5f7df0';
  };

  const markAsRead = (id) => {
    setReadNotifications(prev => new Set([...prev, id]));
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadNotifications(allIds);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === "unread") return !readNotifications.has(notif.id);
    if (activeTab === "all") return true;
    return notif.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !readNotifications.has(n.id)).length;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
          🔔 Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              padding: "6px 12px",
              background: "transparent",
              color: "var(--primary)",
              border: "1px solid var(--primary)",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 8 }}>
        {["all", "unread", "announcement", "deadline", "review", "comment"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              background: activeTab === tab ? "var(--primary)" : "transparent",
              color: activeTab === tab ? "white" : "var(--text2)",
              border: activeTab === tab ? "none" : "1px solid var(--border)",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              transition: "all 0.3s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: "grid", gap: 12 }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: 40,
            background: "var(--card)",
            borderRadius: 10,
            color: "var(--text2)"
          }}>
            <p style={{ fontSize: 14 }}>No notifications</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              style={{
                background: readNotifications.has(notif.id) ? "var(--card)" : "rgba(95,125,240,0.08)",
                border: `1px solid ${readNotifications.has(notif.id) ? "var(--border)" : getNotificationColor(notif.type)}`,
                borderRadius: 10,
                padding: 16,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = getNotificationColor(notif.type);
                e.currentTarget.style.background = "rgba(95,125,240,0.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = readNotifications.has(notif.id) ? "var(--border)" : getNotificationColor(notif.type);
                e.currentTarget.style.background = readNotifications.has(notif.id) ? "var(--card)" : "rgba(95,125,240,0.08)";
              }}
            >
              {/* Icon & Unread Indicator */}
              <div style={{ position: "relative", fontSize: 24, marginTop: 2 }}>
                <span>{getNotificationIcon(notif.type)}</span>
                {!readNotifications.has(notif.id) && (
                  <div style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    background: getNotificationColor(notif.type),
                    borderRadius: "50%",
                    border: "2px solid var(--bg)"
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <strong style={{ color: "var(--text)", fontSize: 14 }}>
                    {notif.title}
                  </strong>
                  <span style={{
                    background: getNotificationColor(notif.type),
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "capitalize"
                  }}>
                    {notif.type}
                  </span>
                </div>

                <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 8, lineHeight: 1.4 }}>
                  {notif.message}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--text2)" }}>
                  <span>🕐 {notif.time}</span>
                  {notif.actionLabel && (
                    <button style={{
                      color: getNotificationColor(notif.type),
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: "underline"
                    }}>
                      {notif.actionLabel}
                    </button>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button style={{
                background: "none",
                border: "none",
                color: "var(--text2)",
                cursor: "pointer",
                fontSize: 18,
                padding: 0,
                marginTop: -4
              }}>
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
