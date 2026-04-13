import React, { useState, useEffect } from "react";
import { useToast } from "../App";
import { thesisAPI } from "../services/api";

const statusConfig = {
  approved: { badge:"badge-green",  label:"✅ Approved" },
  revision:  { badge:"badge-yellow", label:"🔄 Revision" },
  pending:   { badge:"badge-blue",   label:"⏳ Pending" },
};

export default function Review() {
  const { addToast } = useToast();
  const [theses, setTheses]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade]       = useState("");
  const [filter, setFilter]     = useState("all");

  useEffect(() => {
    thesisAPI.getAll()
      .then(r => setTheses(r.data.theses))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allChapters = theses.flatMap(t =>
    t.chapters.map(ch => ({ thesis: t, chapter: ch }))
  );
  const filtered = filter === "all" ? allChapters : allChapters.filter(x => x.chapter.status === filter);
  const counts = {
    all: allChapters.length,
    pending:  allChapters.filter(x => x.chapter.status === "pending").length,
    approved: allChapters.filter(x => x.chapter.status === "approved").length,
    revision: allChapters.filter(x => x.chapter.status === "revision").length,
  };

  const open = ({ thesis, chapter }) => {
    setSelected({ thesis, chapter });
    setFeedback(chapter.feedback || "");
    setGrade(chapter.grade || "");
  };

  const handleAction = async (action) => {
    try {
      await thesisAPI.reviewChapter(selected.thesis._id, selected.chapter._id, { status:action, feedback, grade });
      setTheses(prev => prev.map(t =>
        t._id === selected.thesis._id
          ? { ...t, chapters: t.chapters.map(c => c._id === selected.chapter._id ? { ...c, status:action, feedback, grade } : c) }
          : t
      ));
      addToast(action === "approved" ? "Chapter approved! ✅" : "Revision requested! 🔄",
        action === "approved" ? "success" : "warning");
      setSelected(null);
    } catch (err) {
      addToast(err.response?.data?.message || "Action failed", "error");
    }
  };

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:300 }}>
      <div style={{ textAlign:"center", color:"var(--text2)" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
        <div>Loading submissions...</div>
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="topbar-title">📝 Review Submissions</div>
        <span className="badge badge-yellow">{counts.pending} Pending</span>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["all","pending","approved","revision"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:"8px 18px", borderRadius:50, border:"1.5px solid var(--border)",
              background: filter===f ? "var(--primary)" : "var(--card)",
              color: filter===f ? "white" : "var(--text)",
              cursor:"pointer", fontWeight:600, fontSize:13, transition:"all 0.3s", textTransform:"capitalize" }}>
            {f === "all" ? "All" : statusConfig[f]?.label} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign:"center", padding:40, color:"var(--text2)" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
          <div style={{ fontWeight:700, fontSize:16 }}>No {filter !== "all" ? filter : ""} submissions found</div>
        </div>
      ) : (
        <div className="card" style={{ padding:0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Student</th><th>Chapter</th><th>Submitted</th><th>Status</th><th>Grade</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(({ thesis, chapter }, i) => {
                  const cfg = statusConfig[chapter.status] || statusConfig.pending;
                  return (
                    <tr key={i}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div className="avatar" style={{ width:32, height:32, fontSize:12 }}>
                            {thesis.student?.name?.split(" ").map(w => w[0]).join("") || "?"}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:14 }}>{thesis.student?.name}</div>
                            <div style={{ fontSize:11, color:"var(--text2)" }}>{thesis.student?.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize:13 }}>{chapter.name}</td>
                      <td style={{ fontSize:13, color:"var(--text2)" }}>
                        {chapter.file?.uploadedAt ? new Date(chapter.file.uploadedAt).toLocaleDateString() : "—"}
                      </td>
                      <td><span className={"badge " + cfg.badge}>{cfg.label}</span></td>
                      <td>
                        {chapter.grade
                          ? <span className="badge badge-green">Grade: {chapter.grade}</span>
                          : <span style={{ color:"var(--text2)", fontSize:13 }}>—</span>}
                      </td>
                      <td>
                        <button className="btn" style={{ padding:"7px 14px", fontSize:13 }}
                          onClick={() => open({ thesis, chapter })}>
                          {chapter.status === "pending" ? "📝 Review" : "✏️ Edit"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, backdropFilter:"blur(4px)", padding:20 }}>
          <div className="card" style={{ width:"100%", maxWidth:520, animation:"fadeUp 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:17 }}>📝 Review Chapter</div>
              <button onClick={() => setSelected(null)}
                style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color:"var(--text2)" }}>✕</button>
            </div>
            <div style={{ background:"var(--bg2)", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
              <div style={{ fontWeight:700 }}>{selected.thesis.student?.name}</div>
              <div style={{ fontSize:13, color:"var(--text2)", marginTop:2 }}>{selected.chapter.name}</div>
              <div style={{ fontSize:12, color:"var(--text2)", marginTop:2 }}>
                Version {selected.chapter.version || 1}
              </div>
            </div>
            {selected.chapter.file && (
              <a href={thesisAPI.downloadFile(selected.thesis._id, selected.chapter._id)}
                target="_blank" rel="noreferrer" style={{ display:"block", marginBottom:16 }}>
                <button className="btn btn-outline" style={{ width:"100%", fontSize:13 }}>📥 Download File</button>
              </a>
            )}
            <label>Grade (optional)</label>
            <select className="input" value={grade} onChange={e => setGrade(e.target.value)}>
              <option value="">-- Assign Grade --</option>
              {["A+","A","A-","B+","B","B-","C","F"].map(g => <option key={g}>{g}</option>)}
            </select>
            <label>Feedback / Comments *</label>
            <textarea className="input" rows={4} placeholder="Write detailed feedback for the student..."
              value={feedback} onChange={e => setFeedback(e.target.value)} style={{ resize:"vertical" }} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button className="btn btn-danger" style={{ flex:1 }} onClick={() => handleAction("revision")}>
                🔄 Request Revision
              </button>
              <button className="btn btn-success" style={{ flex:1 }}
                onClick={() => handleAction("approved")} disabled={!feedback}>
                ✅ Approve
              </button>
            </div>
            {!feedback && (
              <div style={{ fontSize:12, color:"var(--text2)", marginTop:8, textAlign:"center" }}>
                Write feedback before approving
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
