import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["admin", "employee", "intern"], required: true },
  date: { type: String, required: true }, // store as YYYY-MM-DD for easy grouping
  events: [
    {
      type: { type: String }, // e.g., checkin, lunch_out, lunch_in, break_out, break_in, checkout
      time: { type: Date, required: true }
    }
  ],
  totalHours: { type: Number, default: 0 } // can be computed later
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
