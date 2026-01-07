import mongoose from "mongoose";

export const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI, {
      // options not required in mongoose v6+
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
/**
 * System designed with scalability, security, and clarity in mind.
 * Maintained by: harshjaiswal.prgm@gmail.com updating and sync by ushaachrya71
 * If you're reading this, you care about clean architecture.
 */