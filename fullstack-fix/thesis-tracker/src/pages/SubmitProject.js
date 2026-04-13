import React, { useState, useEffect } from "react";
import { useToast } from "../App";
import { useNavigate } from "react-router-dom";
import { thesisAPI, usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CHAPTER_NAMES = [
  "Chapter 1: Introduction",
  "Chapter 2: Literature Review",
  "Chapter 3: Methodology",
  "Chapter 4: Results & Analysis",
  "Chapter 5: Conclusion",
  "Full Thesis (Final Submission)",
];

export default function SubmitProject() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thesis, setThesis]     = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [step, setStep]         = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title:"", chapter:"", description:"", keywords:"", notes:"", file:null
  });

  useEffect(() => {
    thesisAPI.getMy().then(r => {
      setThesis(r.data.thesis);
      const supervisorId = r.data.thesis?.supervisor?._id;
      if (supervisorId) setSelectedSupervisor(supervisorId);
    }).catch(() => {});

    usersAPI.getSupervisors().then(r => {
      setSupervisors(r.data.supervisors || []);
    }).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.chapter) { addToast("Please select a chapter", "error"); return; }
    if (!thesis && !form.title) { addToast("Please enter a thesis title", "error"); return; }
    if (!form.file) { addToast("Please upload a file", "error"); return; }

    setSubmitting(true);
    try {
      let thesisId = thesis?._id;
      const supervisorId = selectedSupervisor || thesis?.supervisor?._id || user?.supervisor?._id || "";

      // If no thesis exists, create it first
      if (!thesisId) {
        const res = await thesisAPI.create({
          title: form.title,
          description: form.description,
          keywords: form.keywords.split(",").map(k => k.trim()).filter(Boolean),
          supervisorId: supervisorId || undefined,
        });
        thesisId = res.data.thesis._id;
      }

      // Submit chapter with file
      const fd = new FormData();
      fd.append("file", form.file);
      fd.append("chapterName", form.chapter);
      fd.append("notes", form.notes);

      await thesisAPI.submitChapter(thesisId, fd);
      addToast("Chapter submitted successfully! Your supervisor will review it. 🎉", "success");
      navigate("/my-project");
    } catch (err) {
      addToast(err.response?.data?.message || "Submission failed. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="topbar"><div className="topbar-title">📤 Submit Chapter</div></div>

      {/* Step tabs */}
      <div style={{ display:"flex", gap:0, marginBottom:28, background:"var(--card)",
        borderRadius:14, border:"1px solid var(--border)", overflow:"hidden" }}>
        {["Project Info","Upload File","Review & Submit"].map((s,i) => (
          <button key={i} onClick={() => setStep(i+1)}
            style={{ flex:1, padding:"14px 10px", border:"none",
              background: step===i+1 ? "var(--primary)" : "transparent",
              color: step===i+1 ? "white" : "var(--text2)",
              fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.3s",
              borderRight: i<2 ? "1px solid var(--border)":"none" }}>
            {i+1}. {s}
          </button>
        ))}
      </div>

      <div className="card" style={{ maxWidth:620 }}>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="section-title">📋 Project Information</div>
            {!thesis && (
              <>
                <label>Thesis Title *</label>
                <input className="input" placeholder="Enter your full thesis title..."
                  value={form.title} onChange={e => set("title", e.target.value)} />
                <label>Description</label>
                <textarea className="input" rows={3} placeholder="Brief description..."
                  value={form.description} onChange={e => set("description", e.target.value)}
                  style={{ resize:"vertical" }} />
                <label>Keywords (comma separated)</label>
                <input className="input" placeholder="e.g. AI, Machine Learning, CNN"
                  value={form.keywords} onChange={e => set("keywords", e.target.value)} />
              </>
            )}
            {thesis && (
              <>
                <div style={{ background:"var(--bg2)", borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
                  <div style={{ fontSize:12, color:"var(--text2)", fontWeight:700 }}>YOUR THESIS</div>
                  <div style={{ fontWeight:700, marginTop:4 }}>{thesis.title}</div>
                </div>
                {!thesis.supervisor && (
                  <div style={{ marginBottom:12, padding:12, borderRadius:12, background:"rgba(248,147,33,0.12)", border:"1px solid rgba(248,147,33,0.2)", color:"#92400e" }}>
                    ⚠️ আপনার পারপাটি এখনো কোনো সুপারভাইজারের সাথে যুক্ত করা হয়নি। নিচের তালিকা থেকে একজন সুপারভাইজার বেছে নিন।
                  </div>
                )}
              </>
            )}
            <label>Chapter Being Submitted *</label>
            <select className="input" value={form.chapter} onChange={e => set("chapter", e.target.value)}>
              <option value="">-- Select Chapter --</option>
              {CHAPTER_NAMES.map(c => <option key={c}>{c}</option>)}
            </select>
            {(!thesis || !thesis.supervisor) && supervisors.length > 0 && (
              <>
                <label>Choose Supervisor</label>
                <select className="input" value={selectedSupervisor} onChange={e => setSelectedSupervisor(e.target.value)}>
                  <option value="">-- Select Supervisor --</option>
                  {supervisors.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.userId})</option>
                  ))}
                </select>
              </>
            )}
            <button className="btn btn-full" onClick={() => {
              if (!form.chapter) { addToast("Please select a chapter","error"); return; }
              if (!thesis && !form.title) { addToast("Please enter thesis title","error"); return; }
              if ((!thesis || !thesis.supervisor) && supervisors.length > 0 && !selectedSupervisor) {
                addToast("Please select a supervisor","error"); return;
              }
              setStep(2);
            }}>Next →</button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div className="section-title">📁 Upload File</div>
            <div style={{ border:"2px dashed var(--border)", borderRadius:12,
              padding:"40px 20px", textAlign:"center", marginTop:16,
              background:"var(--bg)", cursor:"pointer", transition:"all 0.3s" }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); set("file", e.dataTransfer.files[0]); }}>
              {form.file ? (
                <div>
                  <div style={{ fontSize:36 }}>📄</div>
                  <div style={{ fontWeight:700, marginTop:8 }}>{form.file.name}</div>
                  <div style={{ fontSize:12, color:"var(--text2)", marginTop:4 }}>
                    {(form.file.size/1024/1024).toFixed(2)} MB
                  </div>
                  <button className="btn btn-outline" style={{ marginTop:12, width:"auto" }}
                    onClick={() => set("file", null)}>Remove</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:48 }}>☁️</div>
                  <div style={{ fontWeight:700, fontSize:15, marginTop:10 }}>Drag & drop your PDF here</div>
                  <div style={{ color:"var(--text2)", fontSize:13, marginTop:4 }}>or</div>
                  <label style={{ display:"inline-block", marginTop:10, padding:"10px 22px",
                    background:"var(--primary)", color:"white", borderRadius:10, cursor:"pointer", fontWeight:600 }}>
                    Browse File
                    <input type="file" accept=".pdf,.doc,.docx" hidden onChange={e => set("file", e.target.files[0])} />
                  </label>
                  <div style={{ fontSize:12, color:"var(--text2)", marginTop:10 }}>PDF, DOC, DOCX — max 20MB</div>
                </div>
              )}
            </div>
            <label>Notes for Supervisor (optional)</label>
            <textarea className="input" rows={3} placeholder="Anything you want feedback on?"
              value={form.notes} onChange={e => set("notes", e.target.value)} style={{ resize:"vertical" }} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button className="btn btn-outline" style={{ flex:1 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn" style={{ flex:2 }} onClick={() => {
                if (!form.file) { addToast("Please upload a file","error"); return; }
                setStep(3);
              }}>Next →</button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div className="section-title">✅ Review & Submit</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:8 }}>
              {[
                ["Chapter", form.chapter],
                ["File", form.file?.name || "—"],
                ["Notes", form.notes || "None"],
                ...(!thesis ? [["Thesis Title", form.title]] : []),
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", gap:12, padding:"12px 16px",
                  background:"var(--bg2)", borderRadius:10 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--text2)", minWidth:100 }}>{k}</span>
                  <span style={{ fontSize:13 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)",
              borderRadius:10, padding:"12px 16px", marginTop:16, fontSize:13 }}>
              ✅ Your supervisor will be notified automatically after submission.
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button className="btn btn-outline" style={{ flex:1 }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-success" style={{ flex:2 }} onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "🚀 Submit Chapter"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
