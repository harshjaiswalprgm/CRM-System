import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// ✅ Import route files
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import attendanceRoutes from "./routes/attendance.js"; // ✅ NEW
import announcementRoutes from "./routes/announcements.js"; // ✅ NEW
import analyticsRoutes from "./routes/analytics.js";
import revenueRoutes from "./routes/Revenue.js"; //
import performanceRoutes from "./routes/performance.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/crm_db";

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
connectDB(MONGO_URI);

// ✅ Test route
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from CRM backend" });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes); // ✅ ATTENDANCE ROUTE ADDED
app.use("/api/announcements", announcementRoutes);
app.use("/api", revenueRoutes);



// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});
app.use("/api", analyticsRoutes);
app.use("/api/performance", performanceRoutes);



// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);


});
