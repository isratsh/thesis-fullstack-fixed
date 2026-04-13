import React, { useState, useEffect } from "react";
import { useToast } from "../App";
import { thesisAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const statusConfig = {
  approved:      { badge:"badge-green",  label:"✅ Approved",       color:"#10b981" },
  revision:      { badge:"badge-yellow", label:"🔄 Needs Revision",  color:"#f59e0b" },
  pending:       { badge:"badge-blue",   label:"⏳ Under Review",    color:"#2563eb" },
  not_submitted: { badge:"badge-red",    label:"❌ Not Submitted",   color:"#ef4444" },
};

export default function MyProject() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [thesis, setThesis]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    thesisAPI.getMy()
      .then(r => setThesis(r.data.thesis))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:300 }}>
      <div style={{ textAlign:"center", color:"var(--text2)" }}><div style={{ fontSize:40 }}>⏳</div><div>Loading...</div></div>
    </div>
  );

  if (!thesis) return (
    <div className="page-enter">
      <div className="topbar"><div className="topbar-title">📄 My Project</div></div>
      <div className="card" style={{ textAlign:"center", padding:60 }}>
        <div style={{ fontSize:56, marginBottom:16 }}>📝</div>
        <div style={{ fontWeight:700, fontSize:18, marginBottom:8 }}>No Thesis Found</div>
        <div style={{ color:"var(--text2)", fontSize:14, marginBottom:20 }}>
          You haven't created a thesis yet. Submit your first chapter to get started!
        </div>
        <Link to="/submit"><button className="btn">📤 Submit First Chapter</button></Link>
      </div>
    </div>
  );

  const progress = thesis.progress || 0;

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="topbar-title">📄 My Project</div>
        <Link to="/submit"><button className="btn">📤 Submit Chapter</button></Link>
      </div>

      {/* Thesis Info */}
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:11, color:"var(--text2)", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Thesis Title</div>
            <div style={{ fontSize:17, fontWeight:800, marginTop:6, lineHeight:1.4 }}>{thesis.title}</div>
            <div style={{ marginTop:10, display:"flex", gap:8, flexWrap:"wrap" }}>
              {thesis.supervisor && <span className="badge badge-blue">👨‍🏫 {thesis.supervisor.name}</span>}
              {thesis.batch && <span className="badge badge-green">📅 {thesis.batch}</span>}
              <span className="badge badge-yellow">🏫 {thesis.department}</span>
            </div>
          </div>
          <div style={{ minWidth:180 }}>
            <div style={{ fontSize:11, color:"var(--text2)", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Overall Progress</div>
            <div style={{ fontSize:42, fontWeight:900, color:"var(--primary)", lineHeight:1 }}>{progress}%</div>
            <div className="progress-wrap" style={{ marginTop:10 }}>
              <div className="progress-bar" style={{ width: progress + "%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="section-title">📚 Chapter Submissions</div>
      {thesis.chapters.length === 0 && (
        <div className="card" style={{ textAlign:"center", color:"var(--text2)", padding:30 }}>
          No chapters submitted yet. <Link to="/submit" style={{ color:"var(--primary)" }}>Submit your first chapter →</Link>
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {thesis.chapters.map((ch, i) => {
          const cfg = statusConfig[ch.status] || statusConfig.pending;
          return (
            <div key={i} className="card"
              style={{ cursor:"pointer", borderLeft:"4px solid " + cfg.color, padding:"18px 24px" }}
              onClick={() => setSelected(selected === i ? null : i)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>{ch.name}</div>
                  <div style={{ fontSize:12, color:"var(--text2)", marginTop:4 }}>
                    {ch.file?.uploadedAt ? "Submitted: " + new Date(ch.file.uploadedAt).toLocaleDateString() : "Not submitted"}
                    {ch.version > 1 && " • Version " + ch.version}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span className={"badge " + cfg.badge}>{cfg.label}</span>
                  <span style={{ color:"var(--text2)" }}>{selected === i ? "▲" : "▼"}</span>
                </div>
              </div>

              {selected === i && (
                <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid var(--border)", animation:"fadeUp 0.3s ease" }}>
                  {ch.grade && (
                    <div style={{ marginBottom:10 }}>
                      <span className="badge badge-green">🏆 Grade: {ch.grade}</span>
                    </div>
                  )}
                  {ch.feedback && (
                    <div style={{ background:"var(--bg2)", borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"var(--text2)", marginBottom:4 }}>💬 SUPERVISOR FEEDBACK</div>
                      <div style={{ fontSize:14 }}>{ch.feedback}</div>
                    </div>
                  )}
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    {ch.file && (
                      <a href={thesisAPI.downloadFile(thesis._id, ch._id)} target="_blank" rel="noreferrer">
                        <button className="btn btn-outline" style={{ fontSize:13, padding:"8px 16px" }}>
                          📥 Download {ch.file.originalName || "File"}
                        </button>
                      </a>
                    )}
                    {ch.status === "revision" && (
                      <Link to="/submit">
                        <button className="btn btn-success" style={{ fontSize:13, padding:"8px 16px" }}>
                          🔄 Resubmit Revised Version
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
