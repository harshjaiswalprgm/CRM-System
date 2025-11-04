import express from "express";
import Revenue from "../models/Revenue.js";

const router = express.Router();

// ✅ GET /api/performance
router.get("/", async (req, res) => {
  try {
    const performanceData = await Revenue.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(performanceData);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    res.status(500).json({
      message: "Server error fetching performance data",
      error: error.message,
    });
  }
});

export default router;
