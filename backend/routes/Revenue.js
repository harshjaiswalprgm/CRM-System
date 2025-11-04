import express from "express";
import Revenue from "../models/Revenue.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// POST /api/revenue/add
router.post("/revenue/add", protect, async (req, res) => {
  try {
    const { userId, amount, date } = req.body;
    if (!userId || !amount)
      return res.status(400).json({ message: "userId and amount required" });

    const entry = new Revenue({
      user: userId,
      amount,
      date: date ? new Date(date) : new Date(),
    });

    await entry.save();
    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
