/**
 * SEED SCRIPT — Run once to populate demo data
 * Usage: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Thesis = require("./models/Thesis");
const Meeting = require("./models/Meeting");
const Announcement = require("./models/Announcement");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Thesis.deleteMany({});
  await Meeting.deleteMany({});
  await Announcement.deleteMany({});
  console.log("🗑️  Cleared existing data");

  // Create Admin
  const admin = await User.create({
    name: "Admin User",
    userId: "ADMIN-001",
    email: "admin@thesis.edu.bd",
    password: "admin123",
    role: "admin",
    department: "Computer Science & Engineering",
  });

  // Create Supervisors
  const sup1 = await User.create({
    name: "Dr. Mahfuzur Rahman",
    userId: "SUP-001",
    email: "rahman@thesis.edu.bd",
    password: "sup123",
    role: "supervisor",
    department: "Computer Science & Engineering",
    phone: "+880 1711-000001",
    bio: "PhD in AI & Machine Learning. 10+ years of research experience.",
  });

  const sup2 = await User.create({
    name: "Prof. Nasrin Karim",
    userId: "SUP-002",
    email: "karim@thesis.edu.bd",
    password: "sup123",
    role: "supervisor",
    department: "Computer Science & Engineering",
    phone: "+880 1711-000002",
    bio: "Expert in Networking and Cybersecurity.",
  });

  // Create Students
  const student1 = await User.create({
    name: "Israt Jahan",
    userId: "2021-CS-045",
    email: "israt@student.edu.bd",
    password: "student123",
    role: "student",
    department: "Computer Science & Engineering",
    batch: "2021-22",
    phone: "+880 1811-000001",
    supervisor: sup1._id,
    notifications: [
      { message: "✅ Chapter 2 has been approved by Dr. Rahman!", type: "success", read: false },
      { message: "📅 Meeting scheduled for April 10 at 2:00 PM", type: "info", read: false },
      { message: "🔄 Chapter 3 needs revision. Check feedback.", type: "warning", read: true },
    ],
  });

  const student2 = await User.create({
    name: "Marjana Akter",
    userId: "2021-CS-046",
    email: "marjana@student.edu.bd",
    password: "student123",
    role: "student",
    department: "Computer Science & Engineering",
    batch: "2021-22",
    phone: "+880 1811-000002",
    supervisor: sup1._id,
  });

  const student3 = await User.create({
    name: "Rahim Uddin",
    userId: "2021-CS-047",
    email: "rahim@student.edu.bd",
    password: "student123",
    role: "student",
    batch: "2021-22",
    department: "Computer Science & Engineering",
    supervisor: sup2._id,
  });

  // Create Theses
  await Thesis.create({
    title: "AI-Based Smart Attendance System Using Facial Recognition",
    student: student1._id,
    supervisor: sup1._id,
    department: "Computer Science & Engineering",
    batch: "2021-22",
    description: "A system to automate attendance using CNN-based facial recognition.",
    keywords: ["AI", "Facial Recognition", "CNN", "Attendance", "Deep Learning"],
    chapters: [
      { name: "Chapter 1: Introduction", status: "approved", feedback: "Excellent introduction!", grade: "A", version: 2,
        file: { filename: "ch1.pdf", originalName: "Chapter1_Introduction.pdf", path: "/uploads/ch1.pdf", size: 512000 } },
      { name: "Chapter 2: Literature Review", status: "approved", feedback: "Good coverage of related works.", grade: "A-", version: 1,
        file: { filename: "ch2.pdf", originalName: "Chapter2_LitReview.pdf", path: "/uploads/ch2.pdf", size: 620000 } },
      { name: "Chapter 3: Methodology", status: "revision", feedback: "Please elaborate on section 3.2 data collection method.", version: 1,
        file: { filename: "ch3.pdf", originalName: "Chapter3_Methodology.pdf", path: "/uploads/ch3.pdf", size: 480000 } },
      { name: "Chapter 4: Results & Analysis", status: "pending", version: 1,
        file: { filename: "ch4.pdf", originalName: "Chapter4_Results.pdf", path: "/uploads/ch4.pdf", size: 750000 } },
    ],
  });

  await Thesis.create({
    title: "Blockchain-Based Secure Voting System",
    student: student2._id,
    supervisor: sup1._id,
    batch: "2021-22",
    keywords: ["Blockchain", "Voting", "Security", "Smart Contracts"],
    chapters: [
      { name: "Chapter 1: Introduction", status: "approved", feedback: "Clear and well-written.", version: 1,
        file: { filename: "ch1_m.pdf", originalName: "Chapter1.pdf", path: "/uploads/ch1_m.pdf", size: 400000 } },
      { name: "Chapter 2: Literature Review", status: "pending", version: 1,
        file: { filename: "ch2_m.pdf", originalName: "Chapter2.pdf", path: "/uploads/ch2_m.pdf", size: 530000 } },
    ],
  });

  await Thesis.create({
    title: "IoT-Based Smart Home Automation System",
    student: student3._id,
    supervisor: sup2._id,
    batch: "2021-22",
    keywords: ["IoT", "Smart Home", "Automation", "Raspberry Pi"],
    chapters: [
      { name: "Chapter 1: Introduction", status: "approved", grade: "A+", version: 1,
        file: { filename: "ch1_r.pdf", originalName: "Chapter1.pdf", path: "/uploads/ch1_r.pdf", size: 450000 } },
      { name: "Chapter 2: Literature Review", status: "approved", grade: "A", version: 1,
        file: { filename: "ch2_r.pdf", originalName: "Chapter2.pdf", path: "/uploads/ch2_r.pdf", size: 580000 } },
      { name: "Chapter 3: Methodology", status: "approved", grade: "A", version: 2,
        file: { filename: "ch3_r.pdf", originalName: "Chapter3.pdf", path: "/uploads/ch3_r.pdf", size: 620000 } },
      { name: "Chapter 4: Results & Analysis", status: "pending", version: 1,
        file: { filename: "ch4_r.pdf", originalName: "Chapter4.pdf", path: "/uploads/ch4_r.pdf", size: 700000 } },
      { name: "Chapter 5: Conclusion", status: "pending", version: 1,
        file: { filename: "ch5_r.pdf", originalName: "Chapter5.pdf", path: "/uploads/ch5_r.pdf", size: 300000 } },
    ],
  });

  // Meetings
  await Meeting.create({
    student: student1._id,
    supervisor: sup1._id,
    date: new Date("2026-04-10"),
    time: "2:00 PM",
    topic: "Chapter 3 Revision Discussion",
    status: "upcoming",
  });

  await Meeting.create({
    student: student1._id,
    supervisor: sup1._id,
    date: new Date("2026-03-20"),
    time: "3:00 PM",
    topic: "Progress Review",
    status: "completed",
    notes: "Discussed methodology. Good progress overall.",
  });

  // Announcements
  await Announcement.create({
    title: "Final Submission Deadline",
    body: "The final thesis submission deadline is June 30, 2026. Ensure all chapters are submitted and approved before this date.",
    type: "urgent",
    targetRole: "all",
    createdBy: admin._id,
  });

  await Announcement.create({
    title: "Mandatory Thesis Seminar",
    body: "All students must attend the thesis seminar on April 15, 2026 at 10:00 AM in Room 301.",
    type: "warning",
    targetRole: "student",
    createdBy: admin._id,
  });

  console.log("\n✅ Seed completed! Demo accounts:");
  console.log("─────────────────────────────────────────");
  console.log("👤 Admin    → ID: ADMIN-001   | Pass: admin123");
  console.log("👨‍🏫 Supervisor → ID: SUP-001  | Pass: sup123");
  console.log("👨‍🏫 Supervisor → ID: SUP-002  | Pass: sup123");
  console.log("🎓 Student  → ID: 2021-CS-045 | Pass: student123");
  console.log("🎓 Student  → ID: 2021-CS-046 | Pass: student123");
  console.log("🎓 Student  → ID: 2021-CS-047 | Pass: student123");
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
};

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
