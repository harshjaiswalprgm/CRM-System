import express from "express";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   ✅ MARK ATTENDANCE
   Self | Admin | Manager (for team)
===================================================== */
router.post("/mark", protect, async (req, res) => {
  try {
    const { userId, type } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ message: "userId and type required" });
    }

    const allowedTypes = [
      "checkIn",
      "lunchOut",
      "lunchIn",
      "breakOut",
      "breakIn",
      "checkOut",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid attendance type" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Permission check
    const isSelf = req.user._id.toString() === userId;
    const isAdmin = req.user.role === "admin";
    const isManagerForUser =
      req.user.role === "manager" &&
      targetUser.manager?.toString() === req.user._id.toString();

    if (!isSelf && !isAdmin && !isManagerForUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const today = new Date().toISOString().split("T")[0];

    let record = await Attendance.findOne({ user: userId, date: today });

    if (!record) {
      record = new Attendance({
        user: userId,
        role: targetUser.role, // ✅ CORRECT ROLE
        date: today,
        events: [],
      });
    }

    if (record.events.some((e) => e.type === type)) {
      return res.status(400).json({ message: `${type} already marked` });
    }

    record.events.push({ type, time: new Date() });
    await record.save();

    res.json({ success: true, record });
  } catch (error) {
    console.error("Attendance mark error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ GET MY ATTENDANCE
===================================================== */
router.get("/me", protect, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ MANAGER → TEAM ATTENDANCE
===================================================== */
router.get("/team", protect, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const teamUsers = await User.find({
      manager: req.user._id,
      role: { $in: ["intern", "employee"] },
    }).select("_id");

    const ids = teamUsers.map((u) => u._id);

    const records = await Attendance.find({ user: { $in: ids } })
      .populate("user", "name email role")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ ADMIN → ALL ATTENDANCE
===================================================== */
router.get("/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const records = await Attendance.find()
      .populate("user", "name email role")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ SUMMARY (SELF | MANAGER | ADMIN)
===================================================== */
router.get("/summary/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSelf = req.user._id.toString() === userId;
    const isAdmin = req.user.role === "admin";
    const isManagerForUser =
      req.user.role === "manager" &&
      targetUser.manager?.toString() === req.user._id.toString();

    if (!isSelf && !isAdmin && !isManagerForUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const records = await Attendance.find({ user: userId });

    const summary = records.map((r) => {
      const inTime = r.events.find((e) => e.type === "checkIn");
      const outTime = r.events.find((e) => e.type === "checkOut");

      let hours = 0;
      if (inTime && outTime) {
        hours =
          Math.round(
            ((new Date(outTime.time) - new Date(inTime.time)) /
              (1000 * 60 * 60)) *
            10
          ) / 10;
      }

      return { date: r.date, hours, events: r.events };
    });

    res.json({ totalDays: summary.length, summary });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
/* =====================================================
   ✅ ACTIVE TODAY (ADMIN / MANAGER)
   Auto inactive after X hours
===================================================== */
router.get("/active-today", protect, async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const today = new Date().toISOString().split("T")[0];
    const MAX_ACTIVE_HOURS = 9;
    const now = new Date();

    // Step 1: find today's attendance with checkIn
    const records = await Attendance.find({
      date: today,
      "events.type": "checkIn",
    }).populate("user", "name role teamName manager");

    // Step 2: filter ACTIVE users
    const activeUsers = records.filter((record) => {
      const events = record.events;

      const checkIn = events.find((e) => e.type === "checkIn");
      const checkOut = events.find((e) => e.type === "checkOut");

      // ❌ Already checked out
      if (checkOut) return false;

      if (!checkIn) return false;

      // ⏱️ Hours since check-in
      const hoursPassed =
        (now - new Date(checkIn.time)) / (1000 * 60 * 60);

      // ❌ Auto inactive after X hours
      if (hoursPassed > MAX_ACTIVE_HOURS) return false;

      // 🔐 Manager → only team users
      if (
        req.user.role === "manager" &&
        record.user.manager?.toString() !== req.user._id.toString()
      ) {
        return false;
      }

      return true;
    });

    // Step 3: send clean response
    res.json(
      activeUsers.map((r) => ({
        _id: r.user._id,
        name: r.user.name,
        role: r.user.role,
        teamName: r.user.teamName || "-",
      }))
    );
  } catch (error) {
    console.error("Active today error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/* =====================================================
   ✅ EXPORT (ADMIN)
===================================================== */
router.get("/export", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const records = await Attendance.find()
      .populate("user", "name email role")
      .sort({ date: -1 });

    const exportData = records.map((r) => ({
      Name: r.user.name,
      Email: r.user.email,
      Role: r.user.role,
      Date: r.date,
      Events: r.events.map((e) => `${e.type}@${e.time}`).join(", "),
    }));

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
