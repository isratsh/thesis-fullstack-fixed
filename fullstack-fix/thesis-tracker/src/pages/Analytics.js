import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { thesisAPI, usersAPI } from "../services/api";

function BarChart({ data, color = "#2563eb" }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:160, padding:"0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--text)" }}>{d.value}</div>
          <div style={{
            width:"100%", borderRadius:"6px 6px 0 0",
            background: "linear-gradient(to top, " + color + ", " + color + "99)",
            height: ((d.value / max) * 120) + "px",
            transition:"height 1s cubic-bezier(0.4,0,0.2,1)",
            minHeight:4,
          }} />
          <div style={{ fontSize:10, color:"var(--text2)", textAlign:"center" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let cumulative = 0;
  const r = 60, cx = 80, cy = 80, stroke = 22;
  const circumference = 2 * Math.PI * r;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:24 }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg2)" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashArray = pct * circumference;
          const offset = -(cumulative * circumference);
          cumulative += pct;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={dashArray + " " + circumference}
              strokeDashoffset={offset}
              style={{ transform:"rotate(-90deg)", transformOrigin:"50% 50%", transition:"all 1s" }}
            />
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight={800} fill="var(--text)">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill="var(--text2)">Total</text>
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:12, height:12, borderRadius:3, background:s.color, flexShrink:0 }} />
            <div style={{ fontSize:13 }}>
              <span style={{ fontWeight:600 }}>{s.label}</span>
              <span style={{ color:"var(--text2)", marginLeft:6 }}>{s.value} ({Math.round(s.value/total*100)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedNumber({ target, suffix="" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40) || 1;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return <>{val}{suffix}</>;
}

export default function Analytics() {
  const { user } = useAuth();
  const role = user?.role || "student";
  const [adminStats, setAdminStats] = useState(null);
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (role === "admin" || role === "supervisor") {
          const r = await usersAPI.getAdminStats();
          setAdminStats(r.data.stats);
        } else {
          const r = await thesisAPI.getMy();
          setThesis(r.data.thesis);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [role]);

  const submissionsByMonth = [
    { label:"Jan", value:3 }, { label:"Feb", value:7 },
    { label:"Mar", value:12 }, { label:"Apr", value:8 },
    { label:"May", value:5 }, { label:"Jun", value:9 },
  ];

  const progressByMonth = [
    { label:"Oct", value:10 }, { label:"Nov", value:25 },
    { label:"Dec", value:35 }, { label:"Jan", value:45 },
    { label:"Feb", value:58 }, { label:"Mar", value:thesis?.progress || 68 },
  ];

  const statusSegments = [
    { label:"Approved", value: adminStats?.approved || 21, color:"#10b981" },
    { label:"Under Review", value: adminStats?.pending || 12, color:"#f59e0b" },
    { label:"Remaining", value: Math.max((adminStats?.total||42) - (adminStats?.approved||21) - (adminStats?.pending||12), 0), color:"#94a3b8" },
  ];

  const chapterSegments = thesis ? [
    { label:"Approved", value: thesis.chapters?.filter(c=>c.status==="approved").length || 0, color:"#10b981" },
    { label:"Pending", value: thesis.chapters?.filter(c=>c.status==="pending").length || 0, color:"#f59e0b" },
    { label:"Revision", value: thesis.chapters?.filter(c=>c.status==="revision").length || 0, color:"#ef4444" },
    { label:"Not Submitted", value: Math.max(5 - (thesis.chapters?.length || 0), 0), color:"#94a3b8" },
  ] : [];

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:300 }}>
      <div style={{ textAlign:"center", color:"var(--text2)" }}><div style={{ fontSize:40 }}>⏳</div><div>Loading...</div></div>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="topbar-title">📊 Analytics & Reports</div>
        <button className="btn btn-outline" style={{ fontSize:13 }} onClick={() => window.print()}>🖨️ Export Report</button>
      </div>

      {(role === "admin" || role === "supervisor") ? (
        <>
          <div className="card-grid" style={{ marginBottom:20 }}>
            {[
              { label:"Total Students", value:adminStats?.totalStudents||0, suffix:"", icon:"🎓", color:"#10b981" },
              { label:"Total Theses", value:adminStats?.totalTheses||0, suffix:"", icon:"📄", color:"#2563eb" },
              { label:"Pending Reviews", value:adminStats?.pendingReviews||0, suffix:"", icon:"⏳", color:"#f59e0b" },
              { label:"Supervisors", value:adminStats?.totalSupervisors||0, suffix:"", icon:"👨‍🏫", color:"#8b5cf6" },
            ].map((k,i) => (
              <div key={i} className="stat-card" style={{ "--accent":k.color }}>
                <div className="stat-icon" style={{ fontSize:26 }}>{k.icon}</div>
                <div className="stat-info">
                  <h3 style={{ color:k.color }}><AnimatedNumber target={k.value} suffix={k.suffix} /></h3>
                  <p>{k.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div className="card">
              <div className="section-title">📤 Monthly Submissions</div>
              <BarChart data={submissionsByMonth} color="#2563eb" />
            </div>
            <div className="card">
              <div className="section-title">🍩 Project Status</div>
              <DonutChart segments={statusSegments} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card-grid" style={{ marginBottom:20 }}>
            {[
              { label:"Your Progress", value:thesis?.progress||0, suffix:"%", icon:"📊", color:"#2563eb" },
              { label:"Chapters Done", value:thesis?.chapters?.filter(c=>c.status==="approved").length||0, suffix:"/5", icon:"📚", color:"#10b981" },
              { label:"Days to Deadline", value:85, suffix:" days", icon:"⏰", color:"#ef4444" },
              { label:"Total Chapters", value:thesis?.chapters?.length||0, suffix:" submitted", icon:"📄", color:"#8b5cf6" },
            ].map((k,i) => (
              <div key={i} className="stat-card" style={{ "--accent":k.color }}>
                <div className="stat-icon" style={{ fontSize:26 }}>{k.icon}</div>
                <div className="stat-info">
                  <h3 style={{ color:k.color }}><AnimatedNumber target={k.value} suffix={k.suffix} /></h3>
                  <p>{k.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div className="card">
              <div className="section-title">📈 Progress Over Time</div>
              <BarChart data={progressByMonth} color="#10b981" />
            </div>
            <div className="card">
              <div className="section-title">📚 Chapter Status</div>
              <DonutChart segments={chapterSegments.length ? chapterSegments : [
                { label:"No chapters yet", value:1, color:"#94a3b8" }
              ]} />
            </div>
          </div>
          {thesis && (
            <div className="card" style={{ marginTop:20 }}>
              <div className="section-title">📅 Chapter Timeline</div>
              {thesis.chapters?.length === 0 && <div style={{ color:"var(--text2)", fontSize:14 }}>No chapters submitted yet.</div>}
              {thesis.chapters?.map((ch, i) => (
                <div key={i} style={{ display:"flex", gap:16, alignItems:"center",
                  padding:"10px 0", borderBottom: i<thesis.chapters.length-1 ? "1px solid var(--border)":"none" }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", flexShrink:0,
                    background: ch.status==="approved"?"#10b981":ch.status==="revision"?"#f59e0b":"#2563eb" }} />
                  <div style={{ fontSize:13, color:"var(--text2)", minWidth:80 }}>
                    {ch.file?.uploadedAt ? new Date(ch.file.uploadedAt).toLocaleDateString() : "—"}
                  </div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{ch.name}</div>
                  <span className={"badge " + (ch.status==="approved"?"badge-green":ch.status==="revision"?"badge-yellow":"badge-blue")} style={{ marginLeft:"auto" }}>
                    {ch.status==="approved"?"✅ Approved":ch.status==="revision"?"🔄 Revision":"⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
