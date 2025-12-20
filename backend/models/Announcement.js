// backend/models/Announcement.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["general", "birthday", "work-anniversary", "festival", "event"],
      default: "general",
    },

    // ✅ Who created this announcement (Admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Role-based visibility (future use)
    visibleTo: {
      type: [String],
      enum: ["admin", "manager", "employee", "intern"],
      default: ["admin", "manager", "employee", "intern"],
    },

    // ✅ Soft delete (admin can remove safely)
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
