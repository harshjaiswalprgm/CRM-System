import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  position: { type: String }, // for Employee
  teamName: { type: String }, // for Intern
  role: { type: String, enum: ["admin", "employee", "intern"], default: "intern" },
  joiningDate: { type: Date },
  password: { type: String, required: true },
  avatar: { type: String }, // URL or base64
  createdAt: { type: Date, default: Date.now },
});

// hash password before save (if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
