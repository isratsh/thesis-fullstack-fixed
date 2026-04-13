const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Thesis = require("../models/Thesis");
const { protect, authorize } = require("../middleware/auth");

// ── Static routes FIRST (before /:id) ─────────────

// GET /api/users/supervisors
router.get("/supervisors", protect, async (req, res, next) => {
  try {
    const supervisors = await User.find({ role:"supervisor", isActive:true })
      .select("name userId email department");
    res.json({ success:true, supervisors });
  } catch (err) { next(err); }
});

// GET /api/users/my-students
router.get("/my-students", protect, authorize("supervisor"), async (req, res, next) => {
  try {
    const students = await User.find({ supervisor:req.user._id, role:"student" })
      .select("name userId email batch isActive");
    const studentsWithProgress = await Promise.all(students.map(async (s) => {
      const thesis = await Thesis.findOne({ student: s._id });
      return { ...s.toObject(), progress: thesis?.progress || 0,
        thesisTitle: thesis?.title || "Not set", thesisId: thesis?._id || null };
    }));
    res.json({ success:true, students: studentsWithProgress });
  } catch (err) { next(err); }
});

// GET /api/users/admin/stats
router.get("/admin/stats", protect, authorize("admin"), async (req, res, next) => {
  try {
    const [totalStudents, totalSupervisors, totalTheses, activeStudents] = await Promise.all([
      User.countDocuments({ role:"student" }),
      User.countDocuments({ role:"supervisor" }),
      Thesis.countDocuments(),
      User.countDocuments({ role:"student", isActive:true }),
    ]);
    const theses = await Thesis.find().select("chapters");
    const pendingReviews = theses.reduce((acc, t) =>
      acc + t.chapters.filter(c => c.status === "pending").length, 0);
    res.json({ success:true, stats:{ totalStudents, totalSupervisors, totalTheses, activeStudents, pendingReviews } });
  } catch (err) { next(err); }
});

// POST /api/users/admin/create
router.post("/admin/create", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { name, userId, email, password, role, department, batch, supervisorId } = req.body;
    if (!name || !userId || !email || !password || !role) {
      return res.status(400).json({ success:false, message:"All fields required" });
    }
    const user = await User.create({
      name, userId, email, password: password || "thesis@123",
      role, department: department || "Computer Science & Engineering",
      batch: batch || "", supervisor: supervisorId || null,
    });
    res.status(201).json({ success:true, user, message:"User created!" });
  } catch (err) { next(err); }
});

// GET /api/users  (admin: all users)
router.get("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex:search, $options:"i" } },
        { userId: { $regex:search, $options:"i" } },
        { email: { $regex:search, $options:"i" } },
      ];
    }
    const users = await User.find(query).populate("supervisor","name userId").sort({ createdAt:-1 });
    res.json({ success:true, count:users.length, users });
  } catch (err) { next(err); }
});

// PUT /api/users/:id/assign-supervisor
router.put("/:id/assign-supervisor", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { supervisorId } = req.body;
    const student = await User.findById(req.params.id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ success:false, message:"Student not found" });
    }
    student.supervisor = supervisorId || null;
    await student.save();
    await Thesis.updateOne({ student:req.params.id }, { supervisor: supervisorId || null });
    res.json({ success:true, message:"Supervisor assigned!" });
  } catch (err) { next(err); }
});

// PUT /api/users/:id/toggle-status
router.put("/:id/toggle-status", protect, authorize("admin"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success:false, message:"User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success:true, message:"User " + (user.isActive?"activated":"deactivated"), isActive:user.isActive });
  } catch (err) { next(err); }
});

// DELETE /api/users/:id
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success:false, message:"User not found" });
    res.json({ success:true, message:"User deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
