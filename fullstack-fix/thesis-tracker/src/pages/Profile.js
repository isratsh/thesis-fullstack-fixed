import React, { useState } from "react";
import { useToast } from "../App";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

export default function Profile() {
  const { addToast } = useToast();
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "",
    phone: user?.phone || "", bio: user?.bio || "",
    department: user?.department || "", batch: user?.batch || "",
  });
  const [pwForm, setPwForm]  = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [pwSaving, setPwSaving] = useState(false);

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const setPw = (k,v) => setPwForm(f => ({ ...f, [k]:v }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
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
                ["Department","department"],
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
        </div>
      </div>
    </div>
  );
}
