import express from "express";
import Revenue from "../models/Revenue.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

/**
 * ✅ POST /api/revenue/add
 * Add new revenue entry (Admin or Employee)
 */
router.post("/revenue/add", protect, authorizeRoles("admin", "employee"), async (req, res) => {
  try {
    const { userId, amount, date } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: "userId and amount are required" });
    }

    const entry = new Revenue({
      user: userId,
      amount,
      date: date ? new Date(date) : new Date(),
    });

    await entry.save();

    res.status(201).json({
      success: true,
      message: "Revenue entry added successfully",
      entry,
    });
  } catch (err) {
    console.error("❌ Error adding revenue:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * ✅ GET /api/revenue/:userId
 * Get all revenue entries for a specific user
 */
router.get("/revenue/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await Revenue.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error("❌ Error fetching revenues:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * ✅ GET /api/revenue
 * Admin only - list all revenue entries
 */
router.get("/revenue", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const all = await Revenue.find().populate("user", "name email role");
    res.status(200).json(all);
  } catch (err) {
    console.error("❌ Error fetching all revenue:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
