import express from "express";
import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import XLSX from "xlsx";

const router = express.Router();

/* ================= APPLY LEAVE ================= */
router.post("/apply", protect, async (req, res) => {
  try {
    const { type, fromDate, toDate, reason } = req.body;

    if (!type || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user._id);

    if (user.role === "intern") {
      return res
        .status(403)
        .json({ message: "Interns are not allowed to apply leave" });
    }

    if (!["sick", "casual"].includes(type)) {
      return res.status(400).json({ message: "Invalid leave type" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      return res
        .status(400)
        .json({ message: "To date cannot be before from date" });
    }

    const totalDays =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const overlap = await Leave.findOne({
      user: user._id,
      status: { $in: ["pending", "approved"] },
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });

    if (overlap) {
      return res
        .status(400)
        .json({ message: "Leave overlaps with existing leave" });
    }

    const leave = await Leave.create({
      user: user._id,
      type,
      fromDate: start,
      toDate: end,
      reason,
      totalDays,
      status: "pending",
    });

    res.json({ success: true, leave });
  } catch (err) {
    console.error("Apply leave error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= MY LEAVES ================= */
router.get("/my", protect, async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id })
    .populate("approvedBy", "name role")
    .sort({ createdAt: -1 });

  res.json(leaves);
});

/* ================= LEAVE SUMMARY ================= */
router.get("/summary", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.role === "intern") {
    return res.json({
      casual: { total: 0, used: 0, remaining: 0 },
      sick: { total: 0, used: 0, remaining: 0 },
    });
  }

  const summary = {};

  for (const type of ["casual", "sick"]) {
    const agg = await Leave.aggregate([
      {
        $match: {
          user: user._id,
          type,
          status: "approved",
        },
      },
      { $group: { _id: null, used: { $sum: "$totalDays" } } },
    ]);

    const used = agg[0]?.used || 0;
    const total = user.leaves[type].total;

    summary[type] = {
      total,
      used,
      remaining: Math.max(total - used, 0),
    };
  }

  res.json(summary);
});

/* ================= PENDING LEAVES ================= */
router.get("/pending", protect, async (req, res) => {
  let query = { status: "pending" };

  if (req.user.role === "manager") {
    const employees = await User.find({
      manager: req.user._id,
      role: "employee",
    }).select("_id");

    query.user = { $in: employees.map((e) => e._id) };
  }

  const leaves = await Leave.find(query)
    .populate("user", "name role teamName")
    .sort({ createdAt: -1 });

  res.json(leaves);
});

/* ================= APPROVE / REJECT ================= */
router.post("/:id/action", protect, async (req, res) => {
  try {
    const { action } = req.body;

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const leave = await Leave.findById(req.params.id).populate("user");
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (
      req.user.role === "manager" &&
      leave.user.manager?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    leave.status = action;
    leave.approvedBy = req.user._id;
    leave.approvedByRole = req.user.role;

    await leave.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Leave action error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =====================================================
   📥 EXPORT LEAVES (MONTH-WISE + SEPARATE SHEETS)
   Admin   → All users
   Manager → Only team
===================================================== */
router.get("/export", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "month and year are required",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    let userFilter = {};

    // 👔 Manager → only employees + interns
    if (req.user.role === "manager") {
      const team = await User.find({
        manager: req.user._id,
      }).select("_id");

      userFilter = { user: { $in: team.map((u) => u._id) } };
    }

    // 🛡 Admin → all users (no filter)

    const leaves = await Leave.find({
      ...userFilter,
      fromDate: { $gte: startDate, $lte: endDate },
    })
      .populate("user", "name email role teamName")
      .populate("approvedBy", "name role")
      .sort({ fromDate: 1 });

    /* ================= SHEETS ================= */
    const casual = [];
    const sick = [];

    leaves.forEach((l) => {
      const row = {
        Name: l.user.name,
        Email: l.user.email,
        Role: l.user.role,
        Team: l.user.teamName || "-",
        Type: l.type,
        From: l.fromDate.toISOString().split("T")[0],
        To: l.toDate.toISOString().split("T")[0],
        Days: l.totalDays,
        Status: l.status,
        ApprovedBy: l.approvedBy?.name || "-",
        ApprovedByRole: l.approvedByRole || "-",
        AppliedOn: l.createdAt.toISOString().split("T")[0],
      };

      if (l.type === "casual") casual.push(row);
      if (l.type === "sick") sick.push(row);
    });

    /* ================= CREATE EXCEL ================= */
    const wb = XLSX.utils.book_new();

    if (casual.length > 0) {
      const wsCasual = XLSX.utils.json_to_sheet(casual);
      XLSX.utils.book_append_sheet(wb, wsCasual, "Casual Leaves");
    }

    if (sick.length > 0) {
      const wsSick = XLSX.utils.json_to_sheet(sick);
      XLSX.utils.book_append_sheet(wb, wsSick, "Sick Leaves");
    }

    if (casual.length === 0 && sick.length === 0) {
      const wsEmpty = XLSX.utils.json_to_sheet([
        { Message: "No leave data for selected month" },
      ]);
      XLSX.utils.book_append_sheet(wb, wsEmpty, "No Data");
    }

    const buffer = XLSX.write(wb, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Leave_Report_${month}_${year}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error("Leave export error:", err);
    res.status(500).json({ message: "Export failed" });
  }
});

export default router;
