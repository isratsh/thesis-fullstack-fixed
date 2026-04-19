const mongoose = require("mongoose");

// Global mock database for when MongoDB is unavailable
global.mockDB = {
  users: [],
  theses: [],
  meetings: [],
  announcements: [],
  connected: false
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected: " + conn.connection.host);
    global.mockDB.connected = true;
  } catch (error) {
    console.warn("⚠️ MongoDB Connection Error: " + error.message);
    console.warn("⚠️ Running in mock mode - API will work with in-memory data");
    console.warn("⚠️ To use persistent database, please:");
    console.warn("   1. Install MongoDB locally: https://www.mongodb.com/try/download/community");
    console.warn("   2. Or setup MongoDB Atlas: https://www.mongodb.com/cloud/atlas");
    
    // Initialize mock mode with test data
    global.mockDB.connected = false;
    initMockData();
  }
};

// Initialize mock data for testing
const initMockData = () => {
  const bcrypt = require("bcryptjs");
  const hashedPassword = bcrypt.hashSync("password123", 12);
  
  global.mockDB.users = [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "Md. Rafiqul Islam",
      userId: "2021-CS-046",
      email: "student@example.com",
      password: hashedPassword,
      role: "student",
      department: "CSE",
      batch: "2021",
      phone: "01712345678",
      bio: "CSE Student",
      supervisor: null,
      isActive: true,
      avatar: "",
      notifications: []
    },
    {
      _id: "507f1f77bcf86cd799439012",
      name: "Dr. Ahmed Hassan",
      userId: "SUP-001",
      email: "supervisor@example.com",
      password: hashedPassword,
      role: "supervisor",
      department: "CSE",
      batch: "",
      phone: "01787654321",
      bio: "CSE Supervisor",
      supervisor: null,
      isActive: true,
      avatar: "",
      notifications: []
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "System Administrator",
      userId: "ADMIN-001",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      department: "CSE",
      batch: "",
      phone: "01700000000",
      bio: "System Admin",
      supervisor: null,
      isActive: true,
      avatar: "",
      notifications: []
    }
  ];
  
  console.log("📦 Mock data initialized with test users");
  console.log("   Student: 2021-CS-046 / password123 (Md. Rafiqul Islam)");
  console.log("   Supervisor: SUP-001 / password123 (Dr. Ahmed Hassan)");
  console.log("   Admin: ADMIN-001 / password123 (System Administrator)");
};

module.exports = connectDB;
