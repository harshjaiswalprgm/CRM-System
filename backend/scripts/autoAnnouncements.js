import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Announcement from "../models/Announcement.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// ✅ Helper: Format today’s month and day
const todayMD = () => {
  const now = new Date();
  return { m: now.getMonth(), d: now.getDate() };
};

// ✅ Helper: Same month/day check
const sameMonthDay = (date) => {
  if (!date) return false;
  const test = new Date(date);
  const { m, d } = todayMD();
  return test.getMonth() === m && test.getDate() === d;
};

// ✅ Check existing announcement to avoid duplicates
const alreadyPosted = async (title) => {
  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0));
  const end = new Date(today.setHours(23, 59, 59, 999));
  const existing = await Announcement.findOne({
    title,
    createdAt: { $gte: start, $lte: end },
  });
  return !!existing;
};

// ✅ Main Logic
const createAutoAnnouncements = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected for auto announcements");

  const users = await User.find({ role: { $in: ["employee", "intern"] } });

  for (const u of users) {
    const today = new Date();

    // 🎂 Birthday Check
    if (sameMonthDay(u.birthday)) {
      const title = `🎂 Happy Birthday ${u.name}!`;
      const message = `Wishing ${u.name} a wonderful year ahead 🎉.`;
      if (!(await alreadyPosted(title))) {
        await Announcement.create({
          title,
          message,
          type: "birthday",
        });
        console.log("🎉 Birthday posted for", u.name);
      }
    }

    // 🎉 Work Anniversary Check (1+ years)
    if (u.joiningDate) {
      const joinDate = new Date(u.joiningDate);
      const years = today.getFullYear() - joinDate.getFullYear();
      if (years >= 1 && sameMonthDay(joinDate)) {
        const title = `🎉 Work Anniversary - ${u.name}`;
        const message = `${u.name} completes ${years} years with us today! 🥳`;
        if (!(await alreadyPosted(title))) {
          await Announcement.create({
            title,
            message,
            type: "work-anniversary",
          });
          console.log("🥳 Work anniversary posted for", u.name);
        }
      }
    }

    // 🗓️ Probation Completion (2 months)
    const diffMs = today - new Date(u.joiningDate);
    const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30);
    if (diffMonths >= 2 && diffMonths < 2.1) {
      const title = `✅ ${u.name} completed 2 months with us!`;
      const message = `Big applause for ${u.name} on completing the probation period 🎊.`;
      if (!(await alreadyPosted(title))) {
        await Announcement.create({
          title,
          message,
          type: "event",
        });
        console.log("✅ Probation completion posted for", u.name);
      }
    }
  }

  await mongoose.disconnect();
  console.log("✅ Auto-announcements done for today");
};

createAutoAnnouncements();
