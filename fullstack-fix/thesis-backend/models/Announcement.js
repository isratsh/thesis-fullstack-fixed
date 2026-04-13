const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: {
    type: String,
    enum: ["info", "warning", "urgent"],
    default: "info",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetRole: {
    type: String,
    enum: ["all", "student", "supervisor"],
    default: "all",
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);
