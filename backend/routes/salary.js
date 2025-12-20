// backend/routes/salary.js
import express from "express";
import Salary from "../models/Salary.js";
import Revenue from "../models/Revenue.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   ✅ SET / UPDATE SALARY OR STIPEND
===================================================== */
router.post("/set", protect, async (req, res) => {
  try {
    const { userId, baseSalary, bonus = 0, deductions = 0, month } = req.body;

    if (!userId || baseSalary === undefined || !month) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    /* 🔐 PERMISSION CHECK */
    if (req.user.role === "manager") {
      if (String(targetUser.manager) !== String(req.user._id)) {
        return res.status(403).json({
          message: "Managers can update stipend only for their interns",
        });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const totalSalary =
      Number(baseSalary) + Number(bonus) - Number(deductions);

    /* 🔄 UPSERT SALARY RECORD */
    let record = await Salary.findOne({ user: userId, month });

    if (record) {
      record.baseSalary = baseSalary;
      record.bonus = bonus;
      record.deductions = deductions;
      record.totalSalary = totalSalary;
      record.updatedBy = req.user._id;
      await record.save();
    } else {
      record = await Salary.create({
        user: userId,
        baseSalary,
        bonus,
        deductions,
        totalSalary,
        month,
        updatedBy: req.user._id,
      });
    }

    /* 🔁 SYNC REVENUE (SALARY / STIPEND) */
    await Revenue.findOneAndUpdate(
      {
        user: userId,
        type: "salary",
        description: `Salary for ${month}`,
      },
      {
        user: userId,
        amount: totalSalary,
        type: "salary",
        description: `Salary for ${month}`,
        manager: req.user.role === "manager" ? req.user._id : null,
        date: new Date(),
      },
      { upsert: true }
    );

    /* 🔁 BONUS REVENUE */
    if (bonus > 0) {
      await Revenue.findOneAndUpdate(
        {
          user: userId,
          type: "bonus",
          description: `Bonus for ${month}`,
        },
        {
          user: userId,
          amount: bonus,
          type: "bonus",
          description: `Bonus for ${month}`,
          manager: req.user._id,
          date: new Date(),
        },
        { upsert: true }
      );
    }

    /* 🔁 DEDUCTION REVENUE */
    if (deductions > 0) {
      await Revenue.findOneAndUpdate(
        {
          user: userId,
          type: "deduction",
          description: `Deduction for ${month}`,
        },
        {
          user: userId,
          amount: -Math.abs(deductions),
          type: "deduction",
          description: `Deduction for ${month}`,
          manager: req.user._id,
          date: new Date(),
        },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: "Salary / stipend updated successfully",
      record,
    });
  } catch (error) {
    console.error("Salary update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ GET SALARY HISTORY (ROLE SAFE)
===================================================== */
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== userId
    ) {
      const user = await User.findById(userId);
      if (!user || user.manager?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }

    const records = await Salary.find({ user: userId }).sort({ month: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
