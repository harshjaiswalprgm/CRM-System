import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "employee", "intern"],
      required: true,
    },

    // YYYY-MM-DD
    date: {
      type: String,
      required: true,
    },

    events: [
      {
        type: {
          type: String,
          enum: [
            "checkIn",
            "lunchOut",
            "lunchIn",
            "breakOut",
            "breakIn",
            "checkOut",
          ],
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// 🔥 One attendance doc per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
