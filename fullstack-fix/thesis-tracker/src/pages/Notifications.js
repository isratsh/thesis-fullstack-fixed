import React, { useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";
import { useToast } from "../App";

const typeColors = { success:"#10b981", warning:"#f59e0b", info:"#2563eb", error:"#ef4444" };
const typeIcons  = { success:"✅", warning:"⚠️", info:"ℹ️", error:"❌" };

export default function Notifications() {
  const { addToast } = useToast();
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  const load = useCallback(async () => {
    try {
      const r = await authAPI.getNotifications();
      setNotifs(r.data.notifications || []);
    } catch (err) {
      addToast("Could not load notifications", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const markAll = async () => {
    try {
      await authAPI.markAllRead();
      setNotifs(n => n.map(x => ({ ...x, read:true })));
      addToast("All marked as read", "success");
    } catch {
      addToast("Failed to update", "error");
    }
  };

  const del = async (id) => {
    try {
      await authAPI.deleteNotification(id);
      setNotifs(n => n.filter(x => x._id !== id));
    } catch {
      addToast("Could not delete", "error");
    }
  };

  const unread = notifs.filter(n => !n.read).length;
  const filtered = filter === "unread" ? notifs.filter(n => !n.read) : notifs;

  return (
    <div className="page-enter">
      <div className="topbar">
        <div>
          <div className="topbar-title">🔔 Notifications</div>
          {unread > 0 && (
            <div style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>
              {unread} unread notification{unread > 1 ? "s" : ""}
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-outline" style={{ fontSize:13 }}
            onClick={() => setFilter(filter === "all" ? "unread" : "all")}>
            {filter === "all" ? "📬 Unread only" : "📭 Show all"}
          </button>
          {unread > 0 && (
            <button className="btn" style={{ fontSize:13 }} onClick={markAll}>
              ✅ Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding:0 }}>
        {loading && (
          <div style={{ padding:40, textAlign:"center", color:"var(--text2)" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>⏳</div>
            Loading...
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding:"60px 20px", textAlign:"center", color:"var(--text2)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
            <div style={{ fontWeight:700, fontSize:16 }}>All caught up!</div>
            <div style={{ fontSize:13, marginTop:4 }}>
              No {filter === "unread" ? "unread " : ""}notifications
            </div>
          </div>
        )}
        {!loading && filtered.map((n, i) => (
          <div key={n._id || i}
            className={"notif-item " + (!n.read ? "unread" : "")}
            style={{ borderLeft:"4px solid " + (!n.read ? (typeColors[n.type] || "#2563eb") : "transparent"),
              cursor:"pointer" }}
            onClick={() => {
              if (!n.read) setNotifs(prev => prev.map(x => x._id===n._id ? {...x, read:true} : x));
            }}>
            <div style={{ width:44, height:44, borderRadius:12,
              background:(typeColors[n.type] || "#2563eb") + "20",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, flexShrink:0 }}>
              {typeIcons[n.type] || "ℹ️"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ fontWeight: n.read ? 600 : 700, fontSize:14 }}>{n.message}</div>
                <div style={{ fontSize:11, color:"var(--text2)", whiteSpace:"nowrap", marginLeft:12 }}>
                  {new Date(n.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); del(n._id); }}
              style={{ background:"none", border:"none", color:"var(--text2)",
                cursor:"pointer", fontSize:20, padding:"0 4px", flexShrink:0 }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
