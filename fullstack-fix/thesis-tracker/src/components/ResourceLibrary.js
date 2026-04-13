import React, { useState } from "react";

export default function ResourceLibrary({ resources = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const getResourceIcon = (type) => {
    const icons = {
      'pdf': '📄',
      'video': '🎥',
      'article': '📰',
      'link': '🔗',
      'code': '💻',
      'template': '📋',
      'dataset': '📊',
      'tool': '🛠️'
    };
    return icons[type] || '📁';
  };

  const categories = ["all", "research", "tutorial", "reference", "tool", "template"];

  const filteredResources = resources.filter(resource => {
    const matchCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const getPopularityStars = (popularity = 0) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < popularity ? "⭐" : "☆");
    }
    return stars.join("");
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
        📚 Resource Library
      </h2>

      {/* Search Bar */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "12px 16px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 12
      }}>
        <span style={{ fontSize: 18 }}>🔍</span>
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "var(--text)",
            fontSize: 14,
            outline: "none",
            "::placeholder": { color: "var(--text2)" }
          }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 8 }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: "8px 16px",
              background: selectedCategory === category ? "var(--primary)" : "transparent",
              color: selectedCategory === category ? "white" : "var(--text2)",
              border: selectedCategory === category ? "none" : "1px solid var(--border)",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              transition: "all 0.3s"
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 16,
        marginBottom: 20
      }}>
        {filteredResources.length === 0 ? (
          <div style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: 40,
            background: "var(--card)",
            borderRadius: 10,
            color: "var(--text2)"
          }}>
            <p>No resources found</p>
          </div>
        ) : (
          filteredResources.map(resource => (
            <div
              key={resource.id}
              onClick={() => setExpandedId(expandedId === resource.id ? null : resource.id)}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                flexDirection: "column"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.background = "rgba(95,125,240,0.05)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--card)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 28 }}>
                  {getResourceIcon(resource.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                    {resource.title}
                  </h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      background: "var(--primary)",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "capitalize"
                    }}>
                      {resource.type}
                    </span>
                    {resource.difficulty && (
                      <span style={{
                        background: resource.difficulty === "advanced" ? "#f56565" : resource.difficulty === "intermediate" ? "#f59e0b" : "#48bb78",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "capitalize"
                      }}>
                        {resource.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {resource.description && (
                <p style={{
                  color: "var(--text2)",
                  fontSize: 12,
                  marginBottom: 12,
                  lineHeight: 1.4,
                  flex: 1
                }}>
                  {resource.description.length > 100
                    ? resource.description.substring(0, 100) + "..."
                    : resource.description}
                </p>
              )}

              {/* Metadata */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 11,
                color: "var(--text2)",
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: "1px solid var(--border)"
              }}>
                {resource.popularity && (
                  <span title={`${resource.popularity} stars`}>
                    {getPopularityStars(resource.popularity)}
                  </span>
                )}
                {resource.date && <span>📅 {resource.date}</span>}
                {resource.author && <span>👤 {resource.author}</span>}
                {resource.size && <span>📦 {resource.size}</span>}
              </div>

              {/* Expanded Content */}
              {expandedId === resource.id && (
                <div style={{ marginBottom: 12 }}>
                  {resource.tags && resource.tags.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ color: "var(--text2)", fontSize: 10, fontWeight: 600, marginBottom: 6 }}>
                        TAGS
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {resource.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: "rgba(95,125,240,0.2)",
                              color: "var(--primary)",
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 500
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {resource.notes && (
                    <div>
                      <p style={{ color: "var(--text2)", fontSize: 10, fontWeight: 600, marginBottom: 6 }}>
                        NOTES
                      </p>
                      <p style={{ color: "var(--text)", fontSize: 11, lineHeight: 1.4 }}>
                        {resource.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 6 }}>
                {resource.url && (
                  <button style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "linear-gradient(135deg, #5f7df0, #4854d4)",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                    🔗 Open
                  </button>
                )}
                <button style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: "transparent",
                  color: "var(--text2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600
                }}>
                  ⭐ Save
                </button>
                {resource.type === "pdf" || resource.type === "dataset" && (
                  <button style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "transparent",
                    color: "var(--text2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                    📥 Download
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      {resources.length > 0 && (
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 16,
          textAlign: "center"
        }}>
          <div>
            <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 6 }}>Total Resources</p>
            <p style={{ color: "var(--primary)", fontSize: 20, fontWeight: 700 }}>{resources.length}</p>
          </div>
          <div>
            <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 6 }}>Showing</p>
            <p style={{ color: "var(--primary)", fontSize: 20, fontWeight: 700 }}>{filteredResources.length}</p>
          </div>
          <div>
            <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 6 }}>Categories</p>
            <p style={{ color: "var(--primary)", fontSize: 20, fontWeight: 700 }}>
              {new Set(resources.map(r => r.category)).size}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
