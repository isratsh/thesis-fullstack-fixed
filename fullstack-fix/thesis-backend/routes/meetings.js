const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

async function notify(userId, message, type = "info") {
  await User.findByIdAndUpdate(userId, {
    $push: { notifications: { message, type, read: false, createdAt: new Date() } },
  });
}

// ─── GET /api/meetings ─ My meetings ────────────────
router.get("/", protect, async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === "student") query.student = req.user._id;
    if (req.user.role === "supervisor") query.supervisor = req.user._id;

    const meetings = await Meeting.find(query)
      .populate("student", "name userId")
      .populate("supervisor", "name userId")
      .sort({ date: -1 });
    res.json({ success: true, meetings });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/meetings ─ Book meeting ──────────────
router.post("/", protect, authorize("student"), async (req, res, next) => {
  try {
    const { date, time, topic, notes } = req.body;
    if (!date || !time || !topic) {
      return res.status(400).json({ success: false, message: "Date, time and topic are required" });
    }
    const student = await User.findById(req.user._id);
    if (!student.supervisor) {
      return res.status(400).json({ success: false, message: "No supervisor assigned yet" });
    }

    const meeting = await Meeting.create({
      student: req.user._id,
      supervisor: student.supervisor,
      date: new Date(date),
      time, topic,
      notes: notes || "",
    });

    // Notify supervisor
    await notify(
      student.supervisor,
      `📅 ${req.user.name} booked a meeting on ${date} at ${time}: "${topic}"`,
      "info"
    );

    const populated = await meeting.populate([
      { path: "student", select: "name userId" },
      { path: "supervisor", select: "name userId" },
    ]);

    res.status(201).json({ success: true, meeting: populated, message: "Meeting booked successfully!" });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/meetings/:id/cancel ───────────────────
router.put("/:id/cancel", protect, async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("student", "name")
      .populate("supervisor", "name");
    if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

    // Only the student or supervisor can cancel
    const isOwner =
      meeting.student._id.toString() === req.user._id.toString() ||
      meeting.supervisor._id.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ success: false, message: "Not authorized" });

    meeting.status = "cancelled";
    meeting.cancelReason = req.body.reason || "";
    await meeting.save();

    // Notify the other party
    const otherUserId =
      req.user.role === "student" ? meeting.supervisor._id : meeting.student._id;
    await notify(otherUserId, `❌ Meeting on ${meeting.date.toDateString()} was cancelled.`, "warning");

    res.json({ success: true, message: "Meeting cancelled" });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/meetings/:id/complete ─ Supervisor marks done ─
router.put("/:id/complete", protect, authorize("supervisor"), async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: "completed", notes: req.body.notes || "" },
      { new: true }
    ).populate("student", "name");

    if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

    await notify(meeting.student._id, `✅ Meeting on ${meeting.date.toDateString()} marked as completed.`, "success");

    res.json({ success: true, meeting, message: "Meeting completed!" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
