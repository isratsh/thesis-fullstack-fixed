const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "Chapter 1: Introduction",
      "Chapter 2: Literature Review",
      "Chapter 3: Methodology",
      "Chapter 4: Results & Analysis",
      "Chapter 5: Conclusion",
      "Full Thesis (Final Submission)",
    ],
  },
  file: {
    filename:     String,
    originalName: String,
    path:         String,
    size:         Number,
    uploadedAt:   { type: Date, default: Date.now },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "revision", "not_submitted"],
    default: "pending",
  },
  feedback:   { type: String, default: "" },
  grade:      { type: String, default: "" },
  version:    { type: Number, default: 1 },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: Date,
  notes:      { type: String, default: "" },
});

const thesisSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coAuthors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  batch:       { type: String, default: "" },
  department:  { type: String, default: "Computer Science & Engineering" },
  description: { type: String, default: "" },
  keywords:    [String],
  chapters:    [chapterSchema],
  overallStatus: {
    type: String,
    enum: ["in_progress", "completed", "rejected"],
    default: "in_progress",
  },
}, { timestamps: true });

// Virtual progress
thesisSchema.virtual("progress").get(function () {
  if (!this.chapters || this.chapters.length === 0) return 0;
  const weights = { approved:100, revision:60, pending:30, not_submitted:0 };
  const total = this.chapters.reduce((acc, ch) => acc + (weights[ch.status] || 0), 0);
  return Math.round(total / this.chapters.length);
});

thesisSchema.set("toJSON",   { virtuals: true });
thesisSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Thesis", thesisSchema);
