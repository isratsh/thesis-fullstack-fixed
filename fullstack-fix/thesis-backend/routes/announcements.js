const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const { protect, authorize } = require("../middleware/auth");

// ─── GET /api/announcements ─ All active ────────────
router.get("/", protect, async (req, res, next) => {
  try {
    const query = { isActive: true };
    if (req.user.role !== "admin") {
      query.$or = [{ targetRole: "all" }, { targetRole: req.user.role }];
    }
    const announcements = await Announcement.find(query)
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/announcements ─ Admin creates ────────
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { title, body, type, targetRole } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: "Title and body are required" });
    }
    const ann = await Announcement.create({
      title, body,
      type: type || "info",
      targetRole: targetRole || "all",
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, announcement: ann, message: "Announcement published!" });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/announcements/:id ──────────────────
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Announcement removed" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
