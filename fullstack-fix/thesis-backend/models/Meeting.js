const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  topic: { type: String, required: true },
  notes: { type: String, default: "" },
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming",
  },
  cancelReason: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Meeting", meetingSchema);
