import express from "express";
import Announcement from "../models/Announcement.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * ✅ POST /api/announcements/create
 * Admin creates a new announcement
 */
router.post("/create", async (req, res) => {
  try {
    const { title, message, type, adminId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Only admin can post announcements" });
    }

    const newAnnouncement = new Announcement({
      title,
      message,
      type: type || "general",
      createdBy: adminId,
    });

    await newAnnouncement.save();
    res.status(201).json({ success: true, message: "Announcement created successfully", announcement: newAnnouncement });
  } catch (error) {
    console.error("❌ Error creating announcement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * ✅ GET /api/announcements
 * Fetch all announcements (visible to everyone)
 */
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(announcements);
  } catch (error) {
    console.error("❌ Error fetching announcements:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
