// backend/routes/revenue.js
import express from "express";
import Revenue from "../models/Revenue.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * -----------------------------------
 * 📌 ADD / UPDATE DAILY REVENUE
 * -----------------------------------
 * Admin  → anyone
 * Manager → assigned interns / employees
 * User → self only
 */
router.post("/add", protect, async (req, res) => {
  try {
    const { userId, amount, date } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({ message: "userId and amount are required" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 ROLE CHECK
    if (req.user.role === "manager") {
      if (targetUser.manager?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not your assigned user" });
      }
    }

    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      req.user._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const revenueDate = date
      ? new Date(new Date(date).setHours(0, 0, 0, 0))
      : new Date(new Date().setHours(0, 0, 0, 0));

    // ✅ UPSERT = one revenue per day
    const entry = await Revenue.findOneAndUpdate(
      { user: userId, date: revenueDate },
      {
        $set: {
          amount,
          manager: targetUser.manager || null,
          description: "Daily revenue update",
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, entry });
  } catch (err) {
    console.error("Revenue update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * -----------------------------------
 * 📌 GET USER REVENUE (DAILY)
 * -----------------------------------
 */
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 ACCESS RULES
    if (req.user.role === "manager") {
      if (targetUser.manager?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not your assigned user" });
      }
    }

    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      req.user._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const entries = await Revenue.find({ user: userId })
      .sort({ date: 1 })
      .select("date amount");

    res.json(entries);
  } catch (err) {
    console.error("Revenue fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
