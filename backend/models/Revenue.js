// backend/models/Revenue.js
import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    // 👤 Revenue owner (Intern / Employee / Manager)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👔 Manager (for intern / probation employee)
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // 💰 Revenue generated on that day
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // 📅 Revenue date (DAY-BASED, not timestamp based)
    date: {
      type: Date,
      required: true,
      index: true,
    },

    // 📝 Optional note
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 🔒 IMPORTANT RULE
 * One user can have ONLY ONE revenue entry per day
 */
revenueSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Revenue", revenueSchema);
