// backend/routes/analytics.js
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Revenue from "../models/Revenue.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   ✅ OVERVIEW STATS (ADMIN DASHBOARD CARDS)
   GET /api/analytics/overview
===================================================== */
router.get("/overview", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const totalUsers = await User.countDocuments();
    const employees = await User.countDocuments({ role: "employee" });
    const interns = await User.countDocuments({ role: "intern" });
    const managers = await User.countDocuments({ role: "manager" });

    // 🔹 Total Revenue (REAL)
    const revenueAgg = await Revenue.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // 🔹 Active Today (Attendance)
    const today = new Date().toISOString().split("T")[0];
    const activeToday = await Attendance.countDocuments({ date: today });

    res.json({
      totalUsers,
      employees,
      interns,
      managers,
      activeToday,
      revenue: totalRevenue,
    });
  } catch (error) {
    console.error("❌ Analytics overview error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ REVENUE CHART (DAY-WISE)
   GET /api/analytics/revenue
===================================================== */
router.get("/revenue", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const revenue = await Revenue.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      revenue.map((r) => ({
        date: r._id,
        amount: r.amount,
      }))
    );
  } catch (error) {
    console.error("❌ Revenue chart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ TEAM PERFORMANCE (USER-WISE)
   GET /api/analytics/performance
===================================================== */
router.get("/performance", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const performance = await Revenue.aggregate([
      {
        $group: {
          _id: "$user",
          revenue: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          role: "$user.role",
          revenue: 1,
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json(performance);
  } catch (error) {
    console.error("❌ Team performance error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
