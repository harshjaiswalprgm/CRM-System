// backend/models/Salary.js
import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Monthly fixed salary / stipend
    baseSalary: {
      type: Number,
      required: true,
    },

    // Incentives
    bonus: {
      type: Number,
      default: 0,
    },

    // Penalties / deductions
    deductions: {
      type: Number,
      default: 0,
    },

    // Calculated field
    totalSalary: {
      type: Number,
      required: true,
    },

    // YYYY-MM
    month: {
      type: String,
      required: true,
    },

    // salary | stipend
    type: {
      type: String,
      enum: ["salary", "stipend"],
      default: "salary",
    },

    // Admin / Manager who updated this record
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* ✅ Prevent duplicate salary per user per month */
salarySchema.index({ user: 1, month: 1 }, { unique: true });

export default mongoose.model("Salary", salarySchema);
