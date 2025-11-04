import express from "express";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

/**
 * ✅ OVERVIEW STATS (Dashboard Cards)
 * GET /api/analytics/overview
 */
router.get("/analytics/overview", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const employees = await User.countDocuments({ role: "employee" });
    const interns = await User.countDocuments({ role: "intern" });
    const totalRevenue = 54000; // Static for now — link real revenue later

    const today = new Date().toISOString().split("T")[0];
    const activeToday = await Attendance.countDocuments({ date: today });

    res.status(200).json({
      totalUsers,
      employees,
      interns,
      activeToday,
      revenue: totalRevenue,
    });
  } catch (error) {
    console.error("❌ Error fetching overview:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ✅ REVENUE CHART DATA
 * GET /api/analytics/revenue
 */
router.get("/analytics/revenue", async (req, res) => {
  try {
    // Temporary sample — replace with real DB logic later
    const revenueData = [
      { label: "Mon", amount: 1800 },
      { label: "Tue", amount: 2200 },
      { label: "Wed", amount: 3100 },
      { label: "Thu", amount: 4000 },
      { label: "Fri", amount: 5200 },
      { label: "Sat", amount: 3500 },
      { label: "Sun", amount: 2000 },
    ];
    res.status(200).json(revenueData);
  } catch (error) {
    console.error("❌ Error fetching revenue chart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ✅ TEAM PERFORMANCE CHART DATA
 * GET /api/analytics/performance
 */
router.get("/analytics/performance", async (req, res) => {
  try {
    const teamPerformance = [
      { name: "Harsh (Emp 1)", revenue: 4800 },
      { name: "Aman (Intern)", revenue: 2500 },
      { name: "Riya (Emp 2)", revenue: 4100 },
      { name: "Aditi (Intern)", revenue: 2000 },
    ];
    res.status(200).json(teamPerformance);
  } catch (error) {
    console.error("❌ Error fetching performance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
