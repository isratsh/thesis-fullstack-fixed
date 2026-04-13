import React, { useState, useEffect } from "react";
import { useToast } from "../App";
import { usersAPI, announcementsAPI } from "../services/api";

const supervisorRoles = ["Unassigned"];
const tabs = ["👥 Students","👨‍🏫 Supervisors","📢 Announcements","⚙️ Settings"];

export default function AdminPage() {
  const { addToast } = useToast();
  const [tab, setTab]               = useState(0);
  const [students, setStudents]     = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats]           = useState({});
  const [loading, setLoading]       = useState(true);
  const [showAdd, setShowAdd]       = useState(false);
  const [ann, setAnn]               = useState({ title:"", body:"", type:"info", targetRole:"all" });
  const [newUser, setNewUser]       = useState({ name:"", userId:"", email:"", password:"thesis@123", role:"student", batch:"2021-22", supervisorId:"" });

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, supRes, annRes, statRes] = await Promise.allSettled([
          usersAPI.getAll({ role:"student" }),
          usersAPI.getSupervisors(),
          announcementsAPI.getAll(),
          usersAPI.getAdminStats(),
        ]);
        if (sRes.status==="fulfilled") setStudents(sRes.value.data.users);
        if (supRes.status==="fulfilled") setSupervisors(supRes.value.data.supervisors);
        if (annRes.status==="fulfilled") setAnnouncements(annRes.value.data.announcements);
        if (statRes.status==="fulfilled") setStats(statRes.value.data.stats);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const assignSup = async (userId, supervisorId) => {
    await usersAPI.assignSupervisor(userId, supervisorId || null);
    setStudents(s => s.map(x => x._id===userId ? {...x, supervisor: supervisors.find(s=>s._id===supervisorId)} : x));
    addToast("Supervisor assigned!", "success");
  };

  const toggleStatus = async (userId) => {
    const r = await usersAPI.toggleStatus(userId);
    setStudents(s => s.map(x => x._id===userId ? {...x, isActive:r.data.isActive} : x));
  };

  const publishAnn = async () => {
    if (!ann.title || !ann.body) { addToast("Fill title and body","error"); return; }
    try {
      const r = await announcementsAPI.create(ann);
      setAnnouncements(a => [r.data.announcement, ...a]);
      setAnn({ title:"", body:"", type:"info", targetRole:"all" });
      addToast("Announcement published!", "success");
    } catch { addToast("Failed to publish","error"); }
  };

  const removeAnn = async (id) => {
    await announcementsAPI.remove(id);
    setAnnouncements(a => a.filter(x => x._id !== id));
    addToast("Removed","info");
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.userId || !newUser.email) { addToast("Fill all fields","error"); return; }
    try {
      const r = await usersAPI.createUser(newUser);
      if (newUser.role === "student") setStudents(s => [r.data.user, ...s]);
      setShowAdd(false);
      setNewUser({ name:"", userId:"", email:"", password:"thesis@123", role:"student", batch:"2021-22", supervisorId:"" });
      addToast("User created!", "success");
    } catch (err) { addToast(err.response?.data?.message || "Failed","error"); }
  };

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:300 }}>
      <div style={{ textAlign:"center", color:"var(--text2)" }}><div style={{ fontSize:40 }}>⏳</div><div>Loading...</div></div>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="topbar-title">⚙️ Admin Panel</div>
        <button className="btn" onClick={() => setShowAdd(true)}>+ Add User</button>
      </div>

      <div className="card-grid" style={{ marginBottom:20 }}>
        {[["🎓","Students",stats.totalStudents||0,"#2563eb"],
          ["👨‍🏫","Supervisors",stats.totalSupervisors||0,"#10b981"],
          ["📄","Theses",stats.totalTheses||0,"#f59e0b"],
          ["⏳","Pending",stats.pendingReviews||0,"#ef4444"]].map(([icon,label,val,color],i) => (
          <div key={i} className="stat-card" style={{ "--accent":color }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-info"><h3 style={{ color }}>{val}</h3><p>{label}</p></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:"var(--card)",
        padding:6, borderRadius:12, border:"1px solid var(--border)" }}>
        {tabs.map((t,i) => (
          <button key={i} onClick={() => setTab(i)}
            style={{ flex:1, padding:"10px", border:"none", borderRadius:8,
              background: tab===i ? "var(--primary)" : "transparent",
              color: tab===i ? "white" : "var(--text2)",
              fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.3s" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Students tab */}
      {tab===0 && (
        <div className="card" style={{ padding:0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Student</th><th>Batch</th><th>Supervisor</th><th>Status</th><th>Action</th>
              </tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ fontWeight:600 }}>{s.name}</div>
                      <div style={{ fontSize:12, color:"var(--text2)" }}>{s.userId}</div>
                    </td>
                    <td style={{ fontSize:13, color:"var(--text2)" }}>{s.batch || "—"}</td>
                    <td>
                      <select value={s.supervisor?._id || ""}
                        onChange={e => assignSup(s._id, e.target.value)}
                        style={{ background:"var(--bg2)", border:"1px solid var(--border)",
                          borderRadius:6, padding:"4px 8px", fontSize:13, color:"var(--text)" }}>
                        <option value="">Unassigned</option>
                        {supervisors.map(sv => <option key={sv._id} value={sv._id}>{sv.name}</option>)}
                      </select>
                    </td>
                    <td><span className={"badge " + (s.isActive?"badge-green":"badge-red")}>
                      {s.isActive ? "✅ Active" : "❌ Inactive"}
                    </span></td>
                    <td>
                      <button className="btn btn-outline" style={{ padding:"6px 12px", fontSize:12 }}
                        onClick={() => toggleStatus(s._id)}>
                        {s.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Supervisors tab */}
      {tab===1 && (
        <div className="card-grid">
          {supervisors.map((sv,i) => {
            const count = students.filter(s => s.supervisor?._id === sv._id).length;
            return (
              <div key={i} className="card">
                <div style={{ fontSize:32, marginBottom:10 }}>👨‍🏫</div>
                <div style={{ fontWeight:800, fontSize:16 }}>{sv.name}</div>
                <div style={{ color:"var(--text2)", fontSize:13, marginTop:4 }}>{sv.userId}</div>
                <div style={{ marginTop:10 }}><span className="badge badge-blue">{count} Students</span></div>
                <div className="progress-wrap" style={{ marginTop:10 }}>
                  <div className="progress-bar" style={{ width: Math.min(count*20,100) + "%" }} />
                </div>
                <div style={{ fontSize:12, color:"var(--text2)", marginTop:4 }}>Workload: {count}/5</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Announcements tab */}
      {tab===2 && (
        <div>
          <div className="card" style={{ marginBottom:20 }}>
            <div className="section-title">📢 New Announcement</div>
            <label>Title</label>
            <input className="input" placeholder="Announcement title..."
              value={ann.title} onChange={e => setAnn(a=>({...a,title:e.target.value}))} />
            <label>Body</label>
            <textarea className="input" rows={3} placeholder="Write announcement..."
              value={ann.body} onChange={e => setAnn(a=>({...a,body:e.target.value}))} style={{ resize:"vertical" }} />
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <select className="input" style={{ flex:1, marginTop:0 }} value={ann.type}
                onChange={e => setAnn(a=>({...a,type:e.target.value}))}>
                <option value="info">📢 Info</option>
                <option value="warning">⚠️ Warning</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
              <select className="input" style={{ flex:1, marginTop:0 }} value={ann.targetRole}
                onChange={e => setAnn(a=>({...a,targetRole:e.target.value}))}>
                <option value="all">👥 Everyone</option>
                <option value="student">🎓 Students only</option>
                <option value="supervisor">👨‍🏫 Supervisors only</option>
              </select>
              <button className="btn" onClick={publishAnn} style={{ marginTop:0, width:"auto" }}>Publish</button>
            </div>
          </div>
          {announcements.map((a,i) => (
            <div key={a._id||i} className="card" style={{ marginBottom:12, borderLeft:"4px solid " + (a.type==="urgent"?"#ef4444":a.type==="warning"?"#f59e0b":"#2563eb") }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontWeight:700 }}>{a.title}</div>
                  <div style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>{a.body}</div>
                </div>
                <button onClick={() => removeAnn(a._id)}
                  style={{ background:"none", border:"none", color:"var(--text2)", cursor:"pointer", fontSize:18, marginLeft:12 }}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings tab */}
      {tab===3 && (
        <div className="card" style={{ maxWidth:480 }}>
          <div className="section-title">⚙️ System Settings</div>
          <label>Submission Deadline</label>
          <input type="date" className="input" defaultValue="2026-06-30" />
          <label>Max Students per Supervisor</label>
          <input type="number" className="input" defaultValue={5} min={1} max={20} />
          <label>Academic Session</label>
          <input className="input" defaultValue="2021-22" />
          <label>Department Name</label>
          <input className="input" defaultValue="Computer Science & Engineering" />
          <button className="btn btn-full" onClick={() => addToast("Settings saved!","success")}>💾 Save Settings</button>
        </div>
      )}

      {/* Add User Modal */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, backdropFilter:"blur(4px)" }}>
          <div className="card" style={{ width:420, animation:"fadeUp 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:17 }}>+ Add New User</div>
              <button onClick={() => setShowAdd(false)}
                style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"var(--text2)" }}>✕</button>
            </div>
            <label>Role</label>
            <select className="input" value={newUser.role} onChange={e => setNewUser(u=>({...u,role:e.target.value}))}>
              <option value="student">🎓 Student</option>
              <option value="supervisor">👨‍🏫 Supervisor</option>
              <option value="admin">⚙️ Admin</option>
            </select>
            <label>Full Name</label>
            <input className="input" placeholder="Full name" value={newUser.name} onChange={e => setNewUser(u=>({...u,name:e.target.value}))} />
            <label>User ID</label>
            <input className="input" placeholder="e.g. 2021-CS-050" value={newUser.userId} onChange={e => setNewUser(u=>({...u,userId:e.target.value}))} />
            <label>Email</label>
            <input className="input" placeholder="email@university.edu" value={newUser.email} onChange={e => setNewUser(u=>({...u,email:e.target.value}))} />
            <label>Password</label>
            <input className="input" placeholder="thesis@123" value={newUser.password} onChange={e => setNewUser(u=>({...u,password:e.target.value}))} />
            {newUser.role === "student" && <>
              <label>Batch</label>
              <select className="input" value={newUser.batch} onChange={e => setNewUser(u=>({...u,batch:e.target.value}))}>
                {["2019-20","2020-21","2021-22","2022-23"].map(b => <option key={b}>{b}</option>)}
              </select>
              <label>Assign Supervisor</label>
              <select className="input" value={newUser.supervisorId} onChange={e => setNewUser(u=>({...u,supervisorId:e.target.value}))}>
                <option value="">Unassigned</option>
                {supervisors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </>}
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button className="btn btn-outline" style={{ flex:1 }} onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn" style={{ flex:1 }} onClick={addUser}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
