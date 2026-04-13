import React, { useState, useEffect } from "react";
import { useToast } from "../App";
import { meetingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SLOTS = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM"];
const statusConfig = {
  upcoming:  { badge:"badge-blue",   label:"📅 Upcoming" },
  completed: { badge:"badge-green",  label:"✅ Completed" },
  cancelled: { badge:"badge-red",    label:"❌ Cancelled" },
};

export default function MeetingScheduler() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [filter, setFilter]     = useState("all");
  const [form, setForm] = useState({ date:"", time:"", topic:"", notes:"" });

  useEffect(() => {
    meetingsAPI.getAll()
      .then(r => setMeetings(r.data.meetings))
      .catch(() => addToast("Could not load meetings","error"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const book = async () => {
    if (!form.date || !form.time || !form.topic) { addToast("Fill all required fields","error"); return; }
    try {
      const r = await meetingsAPI.book(form);
      setMeetings(m => [r.data.meeting, ...m]);
      setShowBook(false);
      setForm({ date:"", time:"", topic:"", notes:"" });
      addToast("Meeting booked! 📅", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Booking failed","error");
    }
  };

  const cancel = async (id) => {
    try {
      await meetingsAPI.cancel(id);
      setMeetings(m => m.map(x => x._id===id ? {...x, status:"cancelled"} : x));
      addToast("Meeting cancelled","warning");
    } catch { addToast("Could not cancel","error"); }
  };

  const complete = async (id) => {
    try {
      await meetingsAPI.complete(id, "");
      setMeetings(m => m.map(x => x._id===id ? {...x, status:"completed"} : x));
      addToast("Meeting marked complete ✅","success");
    } catch { addToast("Could not update","error"); }
  };

  const filtered = filter==="all" ? meetings : meetings.filter(m => m.status===filter);
  const counts = {
    all: meetings.length,
    upcoming:  meetings.filter(m=>m.status==="upcoming").length,
    completed: meetings.filter(m=>m.status==="completed").length,
    cancelled: meetings.filter(m=>m.status==="cancelled").length,
  };

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="topbar-title">📅 Meetings</div>
        {user?.role === "student" && (
          <button className="btn" onClick={() => setShowBook(true)}>+ Book Meeting</button>
        )}
      </div>

      <div className="card-grid" style={{ marginBottom:20 }}>
        {[["📅","Total",counts.all],["⏳","Upcoming",counts.upcoming],["✅","Completed",counts.completed],["❌","Cancelled",counts.cancelled]].map(([icon,label,val],i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-info"><h3>{val}</h3><p>{label}</p></div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {["all","upcoming","completed","cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:"7px 16px", borderRadius:50, border:"1.5px solid var(--border)",
              background: filter===f ? "var(--primary)" : "var(--card)",
              color: filter===f ? "white" : "var(--text)",
              cursor:"pointer", fontWeight:600, fontSize:13, transition:"all 0.3s", textTransform:"capitalize" }}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign:"center", color:"var(--text2)", padding:40 }}>Loading...</div>}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(m => {
          const cfg = statusConfig[m.status];
          const borderColor = m.status==="upcoming"?"#2563eb":m.status==="completed"?"#10b981":"#ef4444";
          return (
            <div key={m._id} className="card"
              style={{ display:"flex", gap:20, alignItems:"flex-start", borderLeft:"4px solid " + borderColor }}>
              <div style={{ background:"var(--bg2)", borderRadius:12, padding:"14px 16px", textAlign:"center", minWidth:70 }}>
                <div style={{ fontSize:22 }}>📅</div>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--text2)", marginTop:4 }}>
                  {new Date(m.date).toLocaleDateString("en-BD",{month:"short",day:"numeric"})}
                </div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>{m.topic}</div>
                  <span className={"badge " + cfg.badge}>{cfg.label}</span>
                </div>
                <div style={{ fontSize:13, color:"var(--text2)", marginTop:6, display:"flex", gap:16, flexWrap:"wrap" }}>
                  {user?.role==="student" && m.supervisor && <span>👨‍🏫 {m.supervisor.name}</span>}
                  {user?.role==="supervisor" && m.student && <span>🎓 {m.student.name}</span>}
                  <span>🕐 {m.time}</span>
                  <span>📆 {new Date(m.date).toDateString()}</span>
                </div>
                {m.notes && (
                  <div style={{ fontSize:13, marginTop:8, padding:"8px 12px", background:"var(--bg2)", borderRadius:8 }}>
                    💬 {m.notes}
                  </div>
                )}
                {m.status === "upcoming" && (
                  <div style={{ marginTop:10, display:"flex", gap:8 }}>
                    <button className="btn btn-outline" style={{ fontSize:12, padding:"6px 14px" }}
                      onClick={() => cancel(m._id)}>❌ Cancel</button>
                    {user?.role === "supervisor" && (
                      <button className="btn btn-success" style={{ fontSize:12, padding:"6px 14px" }}
                        onClick={() => complete(m._id)}>✅ Mark Complete</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Modal */}
      {showBook && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, backdropFilter:"blur(4px)", padding:20 }}>
          <div className="card" style={{ width:"100%", maxWidth:440, animation:"fadeUp 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:17 }}>📅 Book a Meeting</div>
              <button onClick={() => setShowBook(false)}
                style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"var(--text2)" }}>✕</button>
            </div>
            <label>Date *</label>
            <input type="date" className="input" value={form.date} onChange={e => set("date",e.target.value)}
              min={new Date().toISOString().split("T")[0]} />
            <label>Time Slot *</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
              {SLOTS.map(s => (
                <button key={s} onClick={() => set("time",s)}
                  style={{ padding:"8px 14px", borderRadius:8, cursor:"pointer",
                    border:"1.5px solid " + (form.time===s ? "var(--primary)" : "var(--border)"),
                    background: form.time===s ? "var(--primary)" : "var(--bg2)",
                    color: form.time===s ? "white" : "var(--text)",
                    fontWeight:600, fontSize:13, transition:"all 0.3s" }}>
                  {s}
                </button>
              ))}
            </div>
            <label>Topic *</label>
            <input className="input" placeholder="e.g. Chapter 3 Revision Discussion"
              value={form.topic} onChange={e => set("topic",e.target.value)} />
            <label>Notes</label>
            <textarea className="input" rows={2} placeholder="Any specific topics or questions..."
              value={form.notes} onChange={e => set("notes",e.target.value)} style={{ resize:"vertical" }} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button className="btn btn-outline" style={{ flex:1 }} onClick={() => setShowBook(false)}>Cancel</button>
              <button className="btn" style={{ flex:1 }} onClick={book}>📅 Book Meeting</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
