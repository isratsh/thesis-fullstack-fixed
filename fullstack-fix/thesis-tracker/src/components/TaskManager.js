import React, { useState } from "react";

export default function TaskManager({ tasks = [], onAddTask = () => {}, onUpdateTask = () => {}, onCompleteTask = () => {} }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    category: "general",
    assignTo: "",
    status: "todo"
  });

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#48bb78',
      'medium': '#f59e0b',
      'high': '#f56565',
      'urgent': '#c53030'
    };
    return colors[priority] || '#5f7df0';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'low': '📌',
      'medium': '⚠️',
      'high': '🔴',
      'urgent': '🚨'
    };
    return icons[priority] || '📌';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'research': '🔬',
      'writing': '✍️',
      'coding': '💻',
      'meeting': '📞',
      'review': '👁️',
      'general': '📝'
    };
    return icons[category] || '📝';
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate) {
      onAddTask({
        id: Date.now(),
        ...newTask,
        createdAt: new Date().toLocaleDateString()
      });
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        category: "general",
        assignTo: "",
        status: "todo"
      });
      setShowAddForm(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return task.status !== "completed";
    if (filter === "completed") return task.status === "completed";
    return task.priority === filter;
  });

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            ✅ Task Manager
          </h2>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 12,
            color: "var(--text2)"
          }}>
            <span>{completedCount} of {tasks.length} tasks completed</span>
            <div style={{
              width: 100,
              height: 6,
              background: "rgba(95,125,240,0.1)",
              borderRadius: 3,
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #5f7df0, #4854d4)",
                width: `${progressPercentage}%`,
                transition: "width 0.3s"
              }} />
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: "8px 16px",
            background: "linear-gradient(135deg, #5f7df0, #4854d4)",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600
          }}
        >
          + Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 20,
          marginBottom: 20
        }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Add New Task</h3>

          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                Task Title
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--text)",
                  fontSize: 13
                }}
              />
            </div>

            <div>
              <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--text)",
                  fontSize: 13,
                  minHeight: 70,
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    color: "var(--text)",
                    fontSize: 13
                  }}
                />
              </div>

              <div>
                <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    color: "var(--text)",
                    fontSize: 13
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    color: "var(--text)",
                    fontSize: 13
                  }}
                >
                  <option value="research">Research</option>
                  <option value="writing">Writing</option>
                  <option value="coding">Coding</option>
                  <option value="meeting">Meeting</option>
                  <option value="review">Review</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleAddTask}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, #5f7df0, #4854d4)",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "transparent",
                  color: "var(--text2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 8 }}>
        {["all", "active", "completed", "high", "urgent"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: "8px 16px",
              background: filter === tab ? "var(--primary)" : "transparent",
              color: filter === tab ? "white" : "var(--text2)",
              border: filter === tab ? "none" : "1px solid var(--border)",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
              whiteSpace: "nowrap"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div style={{ display: "grid", gap: 12 }}>
        {filteredTasks.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: 40,
            background: "var(--card)",
            borderRadius: 10,
            color: "var(--text2)"
          }}>
            <p>No tasks</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              style={{
                background: "var(--card)",
                border: task.status === "completed" ? "1px solid var(--border)" : `2px solid ${getPriorityColor(task.priority)}`,
                borderRadius: 10,
                padding: 16,
                opacity: task.status === "completed" ? 0.6 : 1,
                textDecoration: task.status === "completed" ? "line-through" : "none",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.background = "rgba(95,125,240,0.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = task.status === "completed" ? "var(--border)" : getPriorityColor(task.priority);
                e.currentTarget.style.background = "var(--card)";
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => onCompleteTask(task.id)}
                  style={{
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                    marginTop: 2
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{getCategoryIcon(task.category)}</span>
                    <strong style={{ color: "var(--text)", fontSize: 14 }}>
                      {task.title}
                    </strong>
                    <span style={{
                      background: getPriorityColor(task.priority),
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      marginLeft: "auto"
                    }}>
                      {getPriorityIcon(task.priority)} {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 8, lineHeight: 1.4 }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text2)" }}>
                    <span>📅 Due: {task.dueDate}</span>
                    {task.assignTo && <span>👤 {task.assignTo}</span>}
                    {task.createdAt && <span>📍 Created: {task.createdAt}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button style={{
                    padding: "6px 10px",
                    background: "transparent",
                    color: "var(--text2)",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 11
                  }}>
                    ✏️
                  </button>
                  <button style={{
                    padding: "6px 10px",
                    background: "transparent",
                    color: "#f56565",
                    border: "1px solid #f56565",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 11
                  }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
