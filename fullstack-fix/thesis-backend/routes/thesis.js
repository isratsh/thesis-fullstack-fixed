const express = require("express");
const router = express.Router();
const path = require("path");
const Thesis = require("../models/Thesis");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

async function notify(userId, message, type = "info") {
  await User.findByIdAndUpdate(userId, {
    $push: { notifications: { message, type, read: false, createdAt: new Date() } },
  });
}

// ── IMPORTANT: static routes before /:id ──────────────

// GET /api/thesis/stats/overview
router.get("/stats/overview", protect, authorize("admin", "supervisor"), async (req, res, next) => {
  try {
    let query = req.user.role === "supervisor" ? { supervisor: req.user._id } : {};
    const theses = await Thesis.find(query);
    const total = theses.length;
    const pending = theses.reduce((a, t) =>
      a + t.chapters.filter(c => c.status === "pending").length, 0);
    const approved = theses.filter(t =>
      t.chapters.length > 0 && t.chapters.every(c => c.status === "approved")).length;
    const avgProgress = total > 0
      ? Math.round(theses.reduce((a, t) => a + (t.progress || 0), 0) / total)
      : 0;
    res.json({ success: true, stats: { total, approved, pending, avgProgress } });
  } catch (err) { next(err); }
});

// GET /api/thesis/my
router.get("/my", protect, authorize("student"), async (req, res, next) => {
  try {
    const thesis = await Thesis.findOne({ student: req.user._id })
      .populate("supervisor", "name userId email phone")
      .populate("coAuthors", "name userId");
    if (!thesis) return res.status(404).json({ success: false, message: "No thesis found." });
    res.json({ success: true, thesis });
  } catch (err) { next(err); }
});

// GET /api/thesis/progress
router.get("/progress", protect, async (req, res, next) => {
  try {
    const theses = await Thesis.find({})
      .populate("student", "name userId batch")
      .populate("supervisor", "name userId")
      .select("title progress chapters.status student supervisor updatedAt")
      .sort({ updatedAt: -1 });
    const progressData = theses.map(thesis => ({
      _id: thesis._id,
      title: thesis.title,
      student: thesis.student,
      supervisor: thesis.supervisor,
      progress: thesis.progress || 0,
      chaptersCount: thesis.chapters.length,
      approvedChapters: thesis.chapters.filter(c => c.status === "approved").length,
      pendingChapters: thesis.chapters.filter(c => c.status === "pending").length,
      updatedAt: thesis.updatedAt,
    }));
    res.json({ success: true, theses: progressData });
  } catch (err) { next(err); }
});

// POST /api/thesis
router.post("/", protect, authorize("student"), async (req, res, next) => {
  try {
    const existing = await Thesis.findOne({ student: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: "You already have a thesis." });
    const { title, description, keywords, coAuthorIds, supervisorId: requestedSupervisorId } = req.body;
    let supervisorId = requestedSupervisorId || req.user.supervisor;

    if (requestedSupervisorId) {
      const supervisorUser = await User.findOne({ _id: requestedSupervisorId, role: "supervisor", isActive: true });
      if (!supervisorUser) {
        return res.status(400).json({ success: false, message: "Selected supervisor is not available." });
      }
      supervisorId = supervisorUser._id;
    }

    if (!supervisorId) {
      const defaultSupervisor = await User.findOne({ role: "supervisor", isActive: true }).sort({ createdAt: 1 });
      if (defaultSupervisor) supervisorId = defaultSupervisor._id;
    }
    if (!supervisorId) {
      return res.status(400).json({ success: false, message: "No supervisor assigned. Please contact the admin to assign one." });
    }
    const thesis = await Thesis.create({
      title, description,
      keywords: keywords || [],
      student: req.user._id,
      supervisor: supervisorId,
      coAuthors: coAuthorIds || [],
      chapters: [],
    });
    res.status(201).json({ success: true, thesis, message: "Thesis created!" });
  } catch (err) { next(err); }
});

// GET /api/thesis/:id
router.get("/:id", protect, async (req, res, next) => {
  try {
    const thesis = await Thesis.findById(req.params.id)
      .populate("student", "name userId email")
      .populate("supervisor", "name userId email");
    if (!thesis) return res.status(404).json({ success: false, message: "Thesis not found" });
    res.json({ success: true, thesis });
  } catch (err) { next(err); }
});

// PUT /api/thesis/:id
router.put("/:id", protect, authorize("student"), async (req, res, next) => {
  try {
    const { title, description, keywords } = req.body;
    const thesis = await Thesis.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      { title, description, keywords },
      { new: true, runValidators: true }
    );
    if (!thesis) return res.status(404).json({ success: false, message: "Thesis not found" });
    res.json({ success: true, thesis, message: "Thesis updated!" });
  } catch (err) { next(err); }
});

// POST /api/thesis/:id/chapter  (file upload)
router.post("/:id/chapter", protect, authorize("student"), upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Please upload a file" });
    const { chapterName, notes } = req.body;
    const thesis = await Thesis.findOne({ _id: req.params.id, student: req.user._id });
    if (!thesis) return res.status(404).json({ success: false, message: "Thesis not found" });

    const existingIdx = thesis.chapters.findIndex(c => c.name === chapterName);
    const chapterData = {
      name: chapterName,
      status: "pending",
      notes: notes || "",
      feedback: "",
      grade: "",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        uploadedAt: new Date(),
      },
    };

    if (existingIdx >= 0) {
      chapterData.version = (thesis.chapters[existingIdx].version || 1) + 1;
      thesis.chapters[existingIdx] = { ...thesis.chapters[existingIdx].toObject(), ...chapterData };
    } else {
      chapterData.version = 1;
      thesis.chapters.push(chapterData);
    }

    if (!thesis.supervisor && req.user.supervisor) {
      thesis.supervisor = req.user.supervisor;
    }
    if (!thesis.supervisor) {
      const defaultSupervisor = await User.findOne({ role: "supervisor", isActive: true }).sort({ createdAt: 1 });
      if (defaultSupervisor) thesis.supervisor = defaultSupervisor._id;
    }

    await thesis.save();

    if (thesis.supervisor) {
      await notify(thesis.supervisor, req.user.name + " submitted " + chapterName + ". Please review.", "info");
    }
    res.json({ success: true, thesis, message: "Chapter submitted!" });
  } catch (err) { next(err); }
});

// PUT /api/thesis/:id/chapter/:chapterId/review
router.put("/:id/chapter/:chapterId/review", protect, authorize("supervisor", "admin"), async (req, res, next) => {
  try {
    const { status, feedback, grade } = req.body;
    if (!["approved", "revision"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be approved or revision" });
    }
    const thesis = await Thesis.findById(req.params.id).populate("student", "name _id");
    if (!thesis) return res.status(404).json({ success: false, message: "Thesis not found" });
    const chapter = thesis.chapters.id(req.params.chapterId);
    if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found" });

    chapter.status = status;
    chapter.feedback = feedback || "";
    chapter.grade = grade || "";
    chapter.reviewedBy = req.user._id;
    chapter.reviewedAt = new Date();
    await thesis.save();

    const msg = status === "approved"
      ? "✅ " + chapter.name + " has been approved by " + req.user.name + "!"
      : "🔄 " + chapter.name + " needs revision. Check feedback.";
    await notify(thesis.student._id, msg, status === "approved" ? "success" : "warning");

    res.json({ success: true, chapter, message: "Chapter " + status + "!" });
  } catch (err) { next(err); }
});

// GET /api/thesis/:id/chapter/:chapterId/file
router.get("/:id/chapter/:chapterId/file", protect, async (req, res, next) => {
  try {
    const thesis = await Thesis.findById(req.params.id);
    if (!thesis) return res.status(404).json({ success: false, message: "Thesis not found" });
    const chapter = thesis.chapters.id(req.params.chapterId);
    if (!chapter || !chapter.file?.path) {
      return res.status(404).json({ success: false, message: "File not found" });
    }
    res.download(chapter.file.path, chapter.file.originalName);
  } catch (err) { next(err); }
});

module.exports = router;
