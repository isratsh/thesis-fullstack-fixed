import React, { useState, useEffect } from "react";
import { useToast } from "../App";
import { useAuth } from "../context/AuthContext";
import { authAPI, usersAPI } from "../services/api";

const departments = ["CSE", "EEE", "SE", "Economic", "English"];

export default function Profile() {
  const { addToast } = useToast();
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "",
    phone: user?.phone || "", bio: user?.bio || "",
    department: user?.department || "CSE", batch: user?.batch || "",
    supervisor: user?.supervisor?._id || "",
  });
  const [pwForm, setPwForm]  = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [pwSaving, setPwSaving] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [studentsList, setStudentsList] = useState([]);

  // Fetch supervisors and students on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "student") {
          const supsRes = await usersAPI.getSupervisors();
          setSupervisors(supsRes.data?.supervisors || []);
        } else if (user?.role === "supervisor") {
          const studsRes = await usersAPI.getMyStudents();
          setStudentsList(studsRes.data?.students || []);
        }
      } catch (err) {
        console.log("Could not fetch data");
      }
    };
    fetchData();
  }, [user?.role]);

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const setPw = (k,v) => setPwForm(f => ({ ...f, [k]:v }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      // Handle supervisor assignment for students
      if (user?.role === "student" && form.supervisor && form.supervisor !== user?.supervisor?._id) {
        await usersAPI.assignSupervisor(user._id, form.supervisor);
      }
      await refreshUser();
      setEditing(false);
      addToast("Profile updated successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Update failed", "error");
    } finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { addToast("Fill all fields","error"); return; }
    if (pwForm.newPassword !== pwForm.confirm) { addToast("Passwords don't match","error"); return; }
    setPwSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      addToast("Password changed!", "success");
      setPwForm({ currentPassword:"", newPassword:"", confirm:"" });
    } catch (err) {
      addToast(err.response?.data?.message || "Failed","error");
    } finally { setPwSaving(false); }
  };

  const initials = user?.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) || "?";
  const roleStats = {
    student:    [["📊","Progress","68%"],["📚","Chapters","4/5"],["💬","Feedback","7"],["📅","Meetings","3"]],
    supervisor: [["🎓","Students","8"],["📝","Reviews","24"],["✅","Approved","14"],["📅","Meetings","12"]],
    admin:      [["🎓","Students","42"],["👨‍🏫","Supervisors","9"],["📄","Theses","38"],["📢","Notices","5"]],
  };
  const stats = roleStats[user?.role] || roleStats.student;

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="topbar-title">👤 My Profile</div>
        <button className={"btn " + (editing?"btn-success":"")}
          onClick={editing ? saveProfile : () => setEditing(true)} disabled={saving}>
          {saving ? "Saving..." : editing ? "💾 Save Changes" : "✏️ Edit Profile"}
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:20 }}>
        {/* Left */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div className="card" style={{ textAlign:"center" }}>
            <div style={{ width:90, height:90, borderRadius:"50%",
              background:"linear-gradient(135deg,#2563eb,#7c3aed)",
              color:"white", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:34, fontWeight:800, margin:"0 auto 16px" }}>
              {initials}
            </div>
            <div style={{ fontWeight:800, fontSize:18 }}>{user?.name}</div>
            <div style={{ color:"var(--text2)", fontSize:13, marginTop:4, textTransform:"capitalize" }}>
              {user?.role} • {user?.department?.split(" ")[0]}
            </div>
            <div style={{ marginTop:10 }}>
              <span className={"badge " + (user?.isActive ? "badge-green" : "badge-red")}>
                {user?.isActive ? "✅ Active" : "❌ Inactive"}
              </span>
            </div>
          </div>

          <div className="card">
            <div className="section-title">📊 Quick Stats</div>
            {stats.map(([icon,label,val],i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between",
                padding:"10px 0", borderBottom: i<stats.length-1 ? "1px solid var(--border)":"none" }}>
                <span style={{ fontSize:14 }}>{icon} {label}</span>
                <span style={{ fontWeight:700, color:"var(--primary)" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div className="card">
            <div className="section-title">📋 Personal Information</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                ["Full Name","name"],
                ["ID","userId",true],
                ["Email","email"],
                ["Phone","phone"],
                ...(user?.role==="student" ? [["Batch","batch"]] : []),
              ].map(([label,key,disabled]) => (
                <div key={key}>
                  <label>{label}</label>
                  {editing && !disabled ? (
                    <input className="input" value={form[key]||""} onChange={e => set(key, e.target.value)} />
                  ) : (
                    <div style={{ padding:"11px 16px", marginTop:8, background:"var(--bg2)", borderRadius:10,
                      fontSize:14, color:disabled?"var(--text2)":"var(--text)" }}>
                      {user?.[key] || "—"}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Department Dropdown */}
              <div>
                <label>Department</label>
                {editing ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "8px" }}>
                    {departments.map(dept => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => set("department", dept)}
                        style={{
                          padding: "10px 12px",
                          border: "2px solid " + (form.department === dept ? "var(--primary)" : "var(--border)"),
                          borderRadius: "6px",
                          background: form.department === dept ? "rgba(37, 99, 235, 0.1)" : "var(--bg2)",
                          color: form.department === dept ? "var(--primary)" : "var(--text)",
                          cursor: "pointer",
                          fontWeight: form.department === dept ? "700" : "500",
                          fontSize: "13px",
                          transition: "all 0.2s"
                        }}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding:"11px 16px", marginTop:8, background:"var(--bg2)", borderRadius:10, fontSize:14 }}>
                    {user?.department || "—"}
                  </div>
                )}
              </div>

              {/* Supervisor Selection for Students */}
              {user?.role === "student" && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontWeight: 700 }}>👨‍🏫 Supervisor</label>
                  {editing ? (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                        {supervisors.map(sup => (
                          <button
                            key={sup._id}
                            type="button"
                            onClick={() => set("supervisor", sup._id)}
                            style={{
                              padding: "12px",
                              border: "2px solid " + (form.supervisor === sup._id ? "var(--primary)" : "var(--border)"),
                              borderRadius: "8px",
                              background: form.supervisor === sup._id ? "rgba(37, 99, 235, 0.1)" : "var(--bg2)",
                              color: form.supervisor === sup._id ? "var(--primary)" : "var(--text)",
                              cursor: "pointer",
                              fontWeight: form.supervisor === sup._id ? "700" : "600",
                              fontSize: "13px",
                              textAlign: "left",
                              transition: "all 0.2s"
                            }}
                          >
                            <div style={{ fontSize: "12px", opacity: 0.7 }}>👨‍🏫</div>
                            <div>{sup.name}</div>
                            <div style={{ fontSize: "11px", opacity: 0.7 }}>{sup.userId}</div>
                          </button>
                        ))}
                      </div>
                      {supervisors.length === 0 && (
                        <div style={{ padding: "12px", background: "rgba(248, 147, 33, 0.1)", borderRadius: "8px", color: "#92400e", fontSize: "13px" }}>
                          ℹ️ No supervisors available. Contact admin.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding:"11px 16px", marginTop:8, background:"var(--bg2)", borderRadius:10, fontSize:14 }}>
                      {user?.supervisor?.name ? `${user.supervisor.name} (${user.supervisor.userId})` : "Not assigned"}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ marginTop:16 }}>
              <label>Bio / About</label>
              {editing ? (
                <textarea className="input" rows={3} value={form.bio} onChange={e => set("bio",e.target.value)} style={{ resize:"vertical" }} />
              ) : (
                <div style={{ padding:"12px 16px", marginTop:8, background:"var(--bg2)",
                  borderRadius:10, fontSize:14, lineHeight:1.6 }}>{user?.bio || "No bio yet."}</div>
              )}
            </div>
            {editing && (
              <div style={{ display:"flex", gap:10, marginTop:16 }}>
                <button className="btn btn-outline" style={{ flex:1 }} onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-success" style={{ flex:1 }} onClick={saveProfile} disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Profile"}
                </button>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="section-title">🔒 Change Password</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              <div>
                <label>Current Password</label>
                <input type="password" className="input" placeholder="••••••••"
                  value={pwForm.currentPassword} onChange={e => setPw("currentPassword",e.target.value)} />
              </div>
              <div>
                <label>New Password</label>
                <input type="password" className="input" placeholder="••••••••"
                  value={pwForm.newPassword} onChange={e => setPw("newPassword",e.target.value)} />
              </div>
              <div>
                <label>Confirm New</label>
                <input type="password" className="input" placeholder="••••••••"
                  value={pwForm.confirm} onChange={e => setPw("confirm",e.target.value)} />
              </div>
            </div>
            <button className="btn" style={{ marginTop:12, width:"auto" }}
              onClick={changePassword} disabled={pwSaving}>
              {pwSaving ? "Changing..." : "🔒 Change Password"}
            </button>
          </div>

          {/* My Students (for supervisors) */}
          {user?.role === "supervisor" && (
            <div className="card">
              <div className="section-title">🎓 My Students</div>
              {studentsList.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {studentsList.map(student => (
                    <div key={student._id} style={{ padding: "10px", background: "var(--bg2)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{student.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text2)" }}>{student.userId} • Batch {student.batch}</div>
                        <div style={{ fontSize: "12px", color: "var(--text2)", marginTop: "4px" }}>{student.thesisTitle || "No thesis yet"}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 600 }}>Progress: {student.progress || 0}%</div>
                        <span className={"badge " + (student.isActive ? "badge-green" : "badge-red")} style={{ marginTop: "4px" }}>
                          {student.isActive ? "✅ Active" : "❌ Inactive"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--text2)" }}>
                  No students assigned yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
