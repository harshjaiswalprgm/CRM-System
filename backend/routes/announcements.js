import express from "express";
import Announcement from "../models/Announcement.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   ✅ CREATE ANNOUNCEMENT (ADMIN ONLY)
===================================================== */
router.post("/create", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create announcements",
      });
    }

    const { title, message, type = "general" } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      type,
      createdBy: req.user._id, // ✅ SAFE
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error("❌ Error creating announcement:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ GET ALL ANNOUNCEMENTS (ALL ROLES)
===================================================== */
router.get("/", protect, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error("❌ Error fetching announcements:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ DELETE ANNOUNCEMENT (ADMIN ONLY)
===================================================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    // 🔐 Only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deleted = await Announcement.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("❌ Delete announcement error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
