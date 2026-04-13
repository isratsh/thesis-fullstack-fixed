import React, { useState } from "react";
import { useToast } from "../App";

const resources = [
  { id:1, title:"How to Write a Strong Thesis Introduction", type:"Guide", category:"Writing", icon:"📝", views:234, bookmarked:false },
  { id:2, title:"APA Citation Format — Complete Reference 2024", type:"Reference", category:"Citation", icon:"📖", views:412, bookmarked:true },
  { id:3, title:"Research Methodology: Qualitative vs Quantitative", type:"Guide", category:"Methodology", icon:"🔬", views:189, bookmarked:false },
  { id:4, title:"Thesis Formatting Guidelines — CSE Department", type:"Template", category:"Formatting", icon:"📄", views:567, bookmarked:true },
  { id:5, title:"Literature Review Writing Tips", type:"Guide", category:"Writing", icon:"✍️", views:298, bookmarked:false },
  { id:6, title:"Data Analysis with Python — Beginner Guide", type:"Tutorial", category:"Tools", icon:"🐍", views:341, bookmarked:false },
  { id:7, title:"IEEE Paper Format Template", type:"Template", category:"Citation", icon:"📋", views:156, bookmarked:false },
  { id:8, title:"How to Present Your Thesis Defense", type:"Guide", category:"Presentation", icon:"🎤", views:223, bookmarked:true },
  { id:9, title:"Statistical Analysis with SPSS for Beginners", type:"Tutorial", category:"Tools", icon:"📊", views:178, bookmarked:false },
  { id:10, title:"Turnitin Plagiarism Guide — How to Reduce Similarity", type:"Guide", category:"Writing", icon:"🛡️", views:445, bookmarked:false },
];

const categories = ["All","Writing","Citation","Methodology","Formatting","Tools","Presentation"];
const typeColors = { Guide:"badge-blue", Reference:"badge-green", Template:"badge-yellow", Tutorial:"badge-red" };

export default function Resources() {
  const { addToast } = useToast();
  const [search, setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems]     = useState(resources);

  const toggle = (id) => {
    setItems(r => r.map(x => x.id === id ? { ...x, bookmarked:!x.bookmarked } : x));
    const item = items.find(x => x.id === id);
    addToast(item.bookmarked ? "Bookmark removed" : "Bookmarked! 🔖", "success");
  };

  const filtered = items.filter(r => {
    const matchCat = category === "All" || r.category === category;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="topbar-title">📚 Resources & Library</div>
        <span className="badge badge-blue">{items.filter(r=>r.bookmarked).length} Bookmarked</span>
      </div>

      <div style={{ position:"relative", marginBottom:20 }}>
        <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"var(--text2)" }}>🔍</span>
        <input className="input" placeholder="Search resources..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft:42, marginTop:0 }} />
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{ padding:"7px 16px", borderRadius:50,
              border:"1.5px solid " + (category===c ? "var(--primary)" : "var(--border)"),
              background: category===c ? "var(--primary)" : "var(--card)",
              color: category===c ? "white" : "var(--text)",
              cursor:"pointer", fontWeight:600, fontSize:13, transition:"all 0.3s" }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:16 }}>
        {filtered.map(r => (
          <div key={r.id} className="card" style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:30 }}>{r.icon}</span>
              <button onClick={() => toggle(r.id)}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:20 }}>
                {r.bookmarked ? "🔖" : "🤍"}
              </button>
            </div>
            <div style={{ fontWeight:700, fontSize:14, lineHeight:1.4, marginBottom:10 }}>{r.title}</div>
            <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
              <span className={"badge " + (typeColors[r.type]||"badge-blue")}>{r.type}</span>
              <span className="badge badge-blue">{r.category}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:"var(--text2)" }}>👁️ {r.views} views</span>
              <button className="btn" style={{ padding:"7px 14px", fontSize:12 }}
                onClick={() => addToast("Opening: " + r.title, "info")}>
                View →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:"var(--text2)" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <div style={{ fontWeight:700, fontSize:16 }}>No resources found</div>
        </div>
      )}
    </div>
  );
}
