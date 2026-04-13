const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Helper: generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

// Helper: send token response
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userData = {
    _id: user._id,
    name: user.name,
    userId: user.userId,
    email: user.email,
    role: user.role,
    department: user.department,
    batch: user.batch,
    phone: user.phone,
    bio: user.bio,
    supervisor: user.supervisor,
    isActive: user.isActive,
  };
  res.status(statusCode).json({ success: true, token, user: userData });
};

// ─── POST /api/auth/register ─────────────────────────
router.post("/register", [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("userId").trim().notEmpty().withMessage("User ID is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 characters"),
  body("role").isIn(["student", "supervisor", "admin"]).withMessage("Invalid role"),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  try {
    const { name, userId, email, password, role, department, batch, phone } = req.body;
    const user = await User.create({ name, userId, email, password, role, department, batch, phone });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/login ────────────────────────────
router.post("/login", [
  body("userId").trim().notEmpty().withMessage("User ID is required"),
  body("password").notEmpty().withMessage("Password is required"),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId: userId.toUpperCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid User ID or Password" });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: "Your account is deactivated. Contact admin." });
    }
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/me ────────────────────────────────
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("supervisor", "name userId email");
  res.json({ success: true, user });
});

// ─── PUT /api/auth/update-profile ───────────────────
router.put("/update-profile", protect, async (req, res, next) => {
  try {
    const { name, email, phone, bio, department, batch } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, bio, department, batch },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user: updated, message: "Profile updated successfully!" });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/auth/change-password ──────────────────
router.put("/change-password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully!" });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/notifications ────────────────────
router.get("/notifications", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("notifications");
  const sorted = user.notifications.sort((a, b) => b.createdAt - a.createdAt);
  res.json({ success: true, notifications: sorted });
});

// ─── PUT /api/auth/notifications/read-all ───────────
router.put("/notifications/read-all", protect, async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { "notifications.$[].read": true } }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/auth/notifications/:notifId ────────
router.delete("/notifications/:notifId", protect, async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { notifications: { _id: req.params.notifId } } }
    );
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
