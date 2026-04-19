import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { thesisAPI, usersAPI, meetingsAPI } from "../services/api";

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="stat-card" style={{ "--accent": color }}>
      <div className="stat-icon" style={{ background:bg, fontSize:26 }}>{icon}</div>
      <div className="stat-info">
        <h3 style={{ color }}>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

function CountdownBox({ label, value }) {
  return (
    <div className="countdown-box">
      <h2>{String(value).padStart(2, "0")}</h2>
      <p>{label}</p>
    </div>
  );
}

function Countdown({ deadline }) {
  const [time, setTime] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) { setTime({ d:0, h:0, m:0, s:0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [deadline]);
  return (
    <div className="countdown">
      <CountdownBox label="Days" value={time.d} />
      <CountdownBox label="Hours" value={time.h} />
      <CountdownBox label="Mins" value={time.m} />
      <CountdownBox label="Secs" value={time.s} />
    </div>
  );
}

const statusColors = { approved:"badge-green", revision:"badge-yellow", pending:"badge-blue", not_submitted:"badge-red" };
const statusLabels = { approved:"✅ Approved", revision:"🔄 Revision", pending:"⏳ Pending", not_submitted:"❌ Not Submitted" };

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "student";
  const [thesis, setThesis]        = useState(null);
  const [stats, setStats]            = useState(null);
  const [students, setStudents]      = useState([]);
  const [meetings, setMeetings]      = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading]        = useState(true);

  const load = useCallback(async () => {
    try {
      const progressRes = await thesisAPI.getProgress();
      setProgressList(progressRes.data.theses || []);

      if (role === "student") {
        const [tRes, mRes] = await Promise.allSettled([
          thesisAPI.getMy(),
          meetingsAPI.getAll(),
        ]);
        if (tRes.status === "fulfilled") setThesis(tRes.value.data.thesis);
        if (mRes.status === "fulfilled") setMeetings(mRes.value.data.meetings || []);
      } else if (role === "supervisor") {
        const [sRes, mRes] = await Promise.allSettled([
          usersAPI.getMyStudents(),
          meetingsAPI.getAll(),
        ]);
        if (sRes.status === "fulfilled") setStudents(sRes.value.data.students || []);
        if (mRes.status === "fulfilled") setMeetings(mRes.value.data.meetings || []);
      } else if (role === "admin") {
        const [statRes] = await Promise.allSettled([usersAPI.getAdminStats()]);
        if (statRes.status === "fulfilled") setStats(statRes.value.data.stats);
      }
    } catch (err) {
      console.warn("Dashboard load error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { if (user) load(); }, [user, load]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300 }}>
      <div style={{ textAlign:"center", color:"var(--text2)" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
        <div>Loading dashboard...</div>
      </div>
    </div>
  );

  const upcomingMeetings = meetings.filter(m => m.status === "upcoming").slice(0, 3);
  const chaptersDone      = thesis?.chapters?.filter(c => c.status === "approved").length || 0;
  const pendingChapters   = thesis?.chapters?.filter(c => c.status === "pending").length || 0;
  const overallProgress   = thesis?.progress || 0;
  
  // Count pending submissions for supervisors
  const pendingSubmissions = progressList
    .filter(t => t.supervisor?._id === user?._id)
    .flatMap(t => t.chapters.filter(c => c.status === "pending").map(c => ({ thesis: t, chapter: c })));


  return (
    <div className="page-enter">
      <div className="topbar">
        <div>
          <div className="topbar-title">Welcome back, {user?.name} 👋</div>
          <div style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>
            {new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </div>
        </div>
        {role === "student" && (
          <Link to="/submit"><button className="btn">📤 Submit Chapter</button></Link>
        )}
      </div>

      {/* Stat Cards */}
      <div className="card-grid">
        {role === "student" && <>
          <StatCard icon="📊" label="Overall Progress"   value={overallProgress + "%"} color="#2563eb" bg="#dbeafe" />
          <StatCard icon="📚" label="Chapters Approved"  value={chaptersDone + "/5"} color="#10b981" bg="#d1fae5" />
          <StatCard icon="⏳" label="Pending Review"     value={pendingChapters} color="#f59e0b" bg="#fef3c7" />
          <StatCard icon="📅" label="Meetings Booked"    value={meetings.length} color="#8b5cf6" bg="#ede9fe" />
        </>}
        {role === "supervisor" && <>
          <StatCard icon="🎓" label="My Students"        value={students.length} color="#2563eb" bg="#dbeafe" />
          <StatCard icon="📅" label="Upcoming Meetings"  value={upcomingMeetings.length} color="#10b981" bg="#d1fae5" />
          <StatCard icon="✅" label="Completed Meetings" value={meetings.filter(m => m.status === "completed").length} color="#8b5cf6" bg="#ede9fe" />
          <StatCard icon="⏳" label="Total Meetings"     value={meetings.length} color="#f59e0b" bg="#fef3c7" />
        </>}
        {role === "admin" && <>
          <StatCard icon="🎓" label="Total Students"     value={stats?.totalStudents || 0} color="#2563eb" bg="#dbeafe" />
          <StatCard icon="👨‍🏫" label="Supervisors"        value={stats?.totalSupervisors || 0} color="#10b981" bg="#d1fae5" />
          <StatCard icon="📄" label="Total Theses"       value={stats?.totalTheses || 0} color="#f59e0b" bg="#fef3c7" />
          <StatCard icon="⏳" label="Pending Reviews"    value={stats?.pendingReviews || 0} color="#ef4444" bg="#fee2e2" />
        </>}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Left Column */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Student: chapter progress */}
          {role === "student" && (
            <div className="card">
              <div className="section-title">📚 Chapter Progress</div>
              {!thesis && (
                <div style={{ color:"var(--text2)", fontSize:14, textAlign:"center", padding:20 }}>
                  No thesis yet.{" "}
                  <Link to="/submit" style={{ color:"var(--primary)" }}>Submit your first chapter →</Link>
                </div>
              )}
              {thesis?.chapters?.map((ch, i) => (
                <div key={i} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:14, fontWeight:600 }}>{ch.name}</span>
                    <span className={"badge " + (statusColors[ch.status] || "badge-blue")}>
                      {statusLabels[ch.status] || ch.status}
                    </span>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-bar" style={{
                      width: ch.status==="approved"?"100%":ch.status==="revision"?"60%":ch.status==="pending"?"30%":"0%"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Supervisor: student list */}
          {role === "supervisor" && (
            <div className="card">
              <div className="section-title">🎓 Your Students</div>
              {students.length === 0 && (
                <div style={{ color:"var(--text2)", fontSize:14, textAlign:"center", padding:20 }}>
                  No students assigned yet.
                </div>
              )}
              {students.map((s, i) => (
                <div key={i} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <div>
                      <span style={{ fontWeight:600, fontSize:14 }}>{s.name}</span>
                      <span style={{ fontSize:12, color:"var(--text2)", marginLeft:8 }}>{s.userId}</span>
                    </div>
                    <span style={{ fontSize:13, fontWeight:700, color:"var(--primary)" }}>{s.progress}%</span>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-bar" style={{ width: s.progress + "%" }} />
                  </div>
                </div>
              ))}
              
              {students.length > 0 && (
                <Link to="/review" style={{ marginTop: 12, display: "block" }}>
                  <button className="btn" style={{ width: "100%" }}>
                    📝 View All Submissions ({pendingSubmissions.length} pending)
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* Admin: quick actions */}
          {role === "admin" && (
            <div className="card">
              <div className="section-title">⚡ Admin Quick Actions</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <Link to="/admin"><button className="btn" style={{ width:"100%" }}>⚙️ Manage Users</button></Link>
                <Link to="/review"><button className="btn btn-outline" style={{ width:"100%" }}>📝 Review All Projects</button></Link>
                <Link to="/analytics"><button className="btn btn-outline" style={{ width:"100%" }}>📊 View Analytics</button></Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Student: countdown */}
          {role === "student" && (
            <div className="card">
              <div className="section-title">⏰ Submission Deadline</div>
              <div style={{ fontSize:13, color:"var(--text2)", marginBottom:8 }}>
                Final thesis due: June 30, 2026
              </div>
              <Countdown deadline="2026-06-30T23:59:00" />
              <div style={{ marginTop:12, padding:"10px 14px",
                background:"rgba(239,68,68,0.1)", borderRadius:10,
                fontSize:13, color:"#ef4444" }}>
                ⚠️ Don't miss the deadline!
              </div>
            </div>
          )}

          {/* Supervisor: pending submissions */}
          {role === "supervisor" && (
            <div className="card">
              <div className="section-title">⏳ Pending Submissions</div>
              {pendingSubmissions.length === 0 ? (
                <div style={{ color:"var(--text2)", fontSize:14, textAlign:"center", padding:20 }}>
                  All submissions reviewed! Great work! 🎉
                </div>
              ) : (
                <div>
                  {pendingSubmissions.slice(0, 5).map((item, i) => (
                    <div key={i} style={{ padding:"10px 0", borderBottom: i < Math.min(5, pendingSubmissions.length) - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ fontWeight:600, fontSize:13 }}>{item.thesis.title}</div>
                      <div style={{ fontSize:12, color:"var(--text2)", marginTop:2 }}>
                        🎓 {item.thesis.student?.name} • {item.chapter.name}
                      </div>
                      <div style={{ fontSize:11, color:"var(--text2)", marginTop:2 }}>
                        Submitted: {item.chapter.file?.uploadedAt ? new Date(item.chapter.file.uploadedAt).toLocaleDateString() : "—"}
                      </div>
                    </div>
                  ))}
                  {pendingSubmissions.length > 5 && (
                    <div style={{ marginTop:8, fontSize:12, color:"var(--primary)", fontWeight:600 }}>
                      +{pendingSubmissions.length - 5} more pending...
                    </div>
                  )}
                  <Link to="/review" style={{ marginTop: 12, display: "block" }}>
                    <button className="btn btn-success" style={{ width: "100%" }}>
                      📝 Review Now ({pendingSubmissions.length})
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
            <div className="card">
              <div className="section-title">📅 Upcoming Meetings</div>
              {upcomingMeetings.length === 0 ? (
                <div style={{ color:"var(--text2)", fontSize:14, textAlign:"center", padding:20 }}>
                  No upcoming meetings.
                  {role === "student" && (
                    <><br />
                      <Link to="/meetings" style={{ color:"var(--primary)" }}>Book one →</Link>
                    </>
                  )}
                </div>
              ) : upcomingMeetings.map((m, i) => (
                <div key={i} style={{ padding:"10px 0",
                  borderBottom: i < upcomingMeetings.length-1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{m.topic}</div>
                  <div style={{ fontSize:12, color:"var(--text2)", marginTop:3 }}>
                    📆 {new Date(m.date).toDateString()} • 🕐 {m.time}
                    {role === "supervisor" && m.student && " • 🎓 " + m.student.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Thesis info */}
          {role === "student" && thesis && (
            <div className="card">
              <div className="section-title">📋 Thesis Info</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:8, lineHeight:1.4 }}>{thesis.title}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {thesis.supervisor && <span className="badge badge-blue">👨‍🏫 {thesis.supervisor.name}</span>}
                {thesis.batch && <span className="badge badge-green">📅 {thesis.batch}</span>}
              </div>
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:13, color:"var(--text2)", marginBottom:4 }}>Overall Progress</div>
                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width: overallProgress + "%" }} />
                </div>
                <div style={{ fontSize:28, fontWeight:900, color:"var(--primary)", marginTop:6 }}>{overallProgress}%</div>
              </div>
            </div>
          )}

          {/* Quick links for all */}
          <div className="card">
            <div className="section-title">⚡ Quick Actions</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <Link to="/analytics"><button className="btn btn-outline" style={{ width:"100%" }}>📊 Analytics</button></Link>
              <Link to="/resources"><button className="btn btn-outline" style={{ width:"100%" }}>📚 Resources</button></Link>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="card">
            <div className="section-title">📈 Overall Progress</div>
            {progressList.length === 0 ? (
              <div style={{ color:"var(--text2)", fontSize:14, textAlign:"center", padding:20 }}>
                No theses submitted yet.
              </div>
            ) : (
              <div style={{ maxHeight:300, overflowY:"auto" }}>
                {progressList.slice(0, 10).map((t, i) => (
                  <div key={i} style={{ marginBottom:14, padding:"10px", background:"var(--bg2)", borderRadius:6 }}>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{t.title}</div>
                    <div style={{ fontSize:12, color:"var(--text2)", marginBottom:6 }}>
                      🎓 {t.student?.name} ({t.student?.userId}) • 👨‍🏫 {t.supervisor?.name}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div className="progress-wrap" style={{ flex:1, marginRight:10 }}>
                        <div className="progress-bar" style={{ width: t.progress + "%" }} />
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, color:"var(--primary)" }}>{t.progress}%</span>
                    </div>
                    <div style={{ fontSize:11, color:"var(--text2)", marginTop:4 }}>
                      Chapters: {t.approvedChapters}/{t.chaptersCount} approved
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
