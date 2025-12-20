// backend/routes/performance.js
import express from "express";
import mongoose from "mongoose";
import Revenue from "../models/Revenue.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * ------------------------------------------------
 * 📊 PERFORMANCE OVERVIEW (ADMIN / MANAGER)
 * ------------------------------------------------
 * Admin   → Overall company revenue (daily)
 * Manager → Team revenue (daily)
 */
router.get("/", protect, async (req, res) => {
  try {
    let matchStage = {};

    // 🔐 MANAGER → only team revenue
    if (req.user.role === "manager") {
      matchStage.manager = new mongoose.Types.ObjectId(req.user._id);
    }

    // ❌ Others not allowed
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const performanceData = await Revenue.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      performanceData.map((p) => ({
        date: p._id,
        amount: p.totalRevenue,
      }))
    );
  } catch (error) {
    console.error("Performance route error:", error);
    res.status(500).json({
      message: "Server error fetching performance data",
      error: error.message,
    });
  }
});

export default router;
