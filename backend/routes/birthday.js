import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   🎂 TODAY'S BIRTHDAYS
   Admin / Manager / Employee / Intern
===================================================== */
router.get("/today", protect, async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const users = await User.find({
      birthday: { $ne: null },
    }).select("name role teamName birthday avatar");

    // 🎯 Match day & month (ignore year)
    const todaysBirthdays = users.filter((u) => {
      const b = new Date(u.birthday);
      return (
        b.getDate() === day &&
        b.getMonth() + 1 === month
      );
    });

    res.json(todaysBirthdays);
  } catch (err) {
    console.error("Birthday fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
