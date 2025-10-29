import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

// GET /api/users - admin only: list all users
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users - admin only: create user (employee/intern)
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, email, phone, role, position, teamName, joiningDate, password } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone,
      role,
      position,
      teamName,
      joiningDate,
      password
    });
    await newUser.save();
    const safeUser = newUser.toObject();
    delete safeUser.password;
    res.status(201).json(safeUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Additional routes (update / delete / get by id) will be added next
export default router;
