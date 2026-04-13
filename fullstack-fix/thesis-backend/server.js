require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Connect MongoDB
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static: serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── API Routes ──────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/thesis", require("./routes/thesis"));
app.use("/api/users", require("./routes/users"));
app.use("/api/meetings", require("./routes/meetings"));
app.use("/api/announcements", require("./routes/announcements"));

// ── Health Check ────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Smart Thesis System API is running 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Error Handler ───────────────────────────────────
app.use(errorHandler);

// ── Start Server ────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Base: http://localhost:${PORT}/api`);
  console.log(`🏥 Health:  http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
