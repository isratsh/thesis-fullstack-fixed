import React, { useState } from "react";

export default function AdvancedMeetingManager({ meetings = [], onScheduleMeeting = () => {} }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    duration: "1",
    attendees: [],
    agenda: "",
    meetingType: "video"
  });

  const getMeetingTypeIcon = (type) => {
    const icons = {
      'video': '📹',
      'in-person': '🤝',
      'phone': '📞',
      'hybrid': '🌐'
    };
    return icons[type] || '📅';
  };

  const getMeetingStatus = (date, time) => {
    // Simple status calculation - can be enhanced with actual date comparison
    return 'scheduled'; // scheduled, in-progress, completed, cancelled
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': '#5f7df0',
      'in-progress': '#48bb78',
      'completed': '#718096',
      'cancelled': '#f56565'
    };
    return colors[status] || '#5f7df0';
  };

  const handleAddAttendee = () => {
    setNewMeeting(prev => ({
      ...prev,
      attendees: [...prev.attendees, ""]
    }));
  };

  const handleRemoveAttendee = (index) => {
    setNewMeeting(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      onScheduleMeeting(newMeeting);
      setNewMeeting({
        title: "",
        date: "",
        time: "",
        duration: "1",
        attendees: [],
        agenda: "",
        meetingType: "video"
      });
      setShowScheduleForm(false);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
          📅 Advanced Meeting Manager
        </h2>
        <button
          onClick={() => setShowScheduleForm(!showScheduleForm)}
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
          + Schedule Meeting
        </button>
      </div>

      {/* Schedule Form */}
      {showScheduleForm && (
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 20,
          marginBottom: 20
        }}>
          <h3 style={{ color: "var(--text)", marginBottom: 16 }}>Schedule New Meeting</h3>

          <div style={{ display: "grid", gap: 16 }}>
            {/* Title */}
            <div>
              <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                Meeting Title
              </label>
              <input
                type="text"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
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

            {/* Date, Time, Duration */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Date
                </label>
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
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
                  Time
                </label>
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
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
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: e.target.value }))}
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
            </div>

            {/* Meeting Type */}
            <div>
              <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                Meeting Type
              </label>
              <select
                value={newMeeting.meetingType}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, meetingType: e.target.value }))}
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
                <option value="video">📹 Video Call</option>
                <option value="in-person">🤝 In-Person</option>
                <option value="phone">📞 Phone Call</option>
                <option value="hybrid">🌐 Hybrid</option>
              </select>
            </div>

            {/* Agenda */}
            <div>
              <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                Meeting Agenda
              </label>
              <textarea
                value={newMeeting.agenda}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, agenda: e.target.value }))}
                placeholder="Describe meeting agenda and discussion points..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--text)",
                  fontSize: 13,
                  minHeight: 80,
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Attendees */}
            <div>
              <label style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                Attendees
              </label>
              <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
                {newMeeting.attendees.map((attendee, index) => (
                  <div key={index} style={{ display: "flex", gap: 8 }}>
                    <input
                      type="email"
                      value={attendee}
                      onChange={(e) => {
                        const newAttendees = [...newMeeting.attendees];
                        newAttendees[index] = e.target.value;
                        setNewMeeting(prev => ({ ...prev, attendees: newAttendees }));
                      }}
                      placeholder="attendee@example.com"
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        background: "var(--bg2)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--text)",
                        fontSize: 13
                      }}
                    />
                    <button
                      onClick={() => handleRemoveAttendee(index)}
                      style={{
                        padding: "10px 12px",
                        background: "transparent",
                        color: "#f56565",
                        border: "1px solid #f56565",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddAttendee}
                style={{
                  padding: "8px 12px",
                  background: "transparent",
                  color: "var(--primary)",
                  border: "1px solid var(--primary)",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                + Add Attendee
              </button>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={handleSubmitMeeting}
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
                Schedule Meeting
              </button>
              <button
                onClick={() => setShowScheduleForm(false)}
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

      {/* Meetings List */}
      <div style={{ display: "grid", gap: 12 }}>
        {meetings.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: 40,
            background: "var(--card)",
            borderRadius: 10,
            color: "var(--text2)"
          }}>
            <p>No meetings scheduled</p>
          </div>
        ) : (
          meetings.map(meeting => {
            const status = getMeetingStatus(meeting.date, meeting.time);
            return (
              <div
                key={meeting.id}
                onClick={() => setExpandedId(expandedId === meeting.id ? null : meeting.id)}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 16,
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.background = "rgba(95,125,240,0.05)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--card)";
                }}
              >
                {/* Main Info */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <span style={{ fontSize: 24 }}>
                      {getMeetingTypeIcon(meeting.meetingType)}
                    </span>
                    <div>
                      <strong style={{ color: "var(--text)", display: "block", marginBottom: 4 }}>
                        {meeting.title}
                      </strong>
                      <span style={{ color: "var(--text2)", fontSize: 12 }}>
                        {meeting.date} at {meeting.time} • {meeting.duration}h
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      background: getStatusColor(status),
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "capitalize"
                    }}>
                      {status}
                    </span>
                    <span style={{ color: "var(--text2)" }}>
                      {expandedId === meeting.id ? "▼" : "▶"}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === meeting.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    {meeting.agenda && (
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                          📋 Agenda
                        </p>
                        <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.5 }}>
                          {meeting.agenda}
                        </p>
                      </div>
                    )}

                    {meeting.attendees && meeting.attendees.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ color: "var(--text2)", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                          👥 Attendees ({meeting.attendees.length})
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {meeting.attendees.map((attendee, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: "var(--bg2)",
                                color: "var(--text2)",
                                padding: "6px 10px",
                                borderRadius: 6,
                                fontSize: 12
                              }}
                            >
                              {attendee}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "linear-gradient(135deg, #5f7df0, #4854d4)",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        📹 Join Meeting
                      </button>
                      <button style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "transparent",
                        color: "var(--text2)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        ✏️ Edit
                      </button>
                      <button style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "transparent",
                        color: "#f56565",
                        border: "1px solid #f56565",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        🗑️ Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
