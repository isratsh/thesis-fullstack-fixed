const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  userId: {
    type: String,
    required: [true, "User ID is required"],
    unique: true,
    trim: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["student", "supervisor", "admin"],
    default: "student",
  },
  phone: { type: String, default: "" },
  department: { 
    type: String, 
    enum: ["CSE", "EEE", "SE", "Economic", "English"],
    default: "CSE" 
  },
  batch: { type: String, default: "" },
  bio: { type: String, default: "" },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  isActive: { type: Boolean, default: true },
  avatar: { type: String, default: "" },
  notifications: [{
    message: String,
    type: { type: String, enum: ["success", "warning", "info", "error"], default: "info" },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
