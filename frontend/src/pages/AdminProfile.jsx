import React, { useState } from "react";
import api from "../api/axios";
import { Save } from "lucide-react";

const AdminProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    avatar: storedUser?.avatar || "",
  });

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save updated profile
  const handleSave = async () => {
    try {
      const res = await api.put(`/users/${storedUser._id}`, form);
      localStorage.setItem("user", JSON.stringify(res.data)); // refresh stored user
      alert("✅ Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

        <div className="flex flex-col items-center gap-4 mb-4">
          <img
            src={form.avatar || "https://via.placeholder.com/100"}
            alt="avatar"
            className="w-24 h-24 rounded-full border"
          />
          <input
            type="text"
            name="avatar"
            placeholder="Avatar URL"
            value={form.avatar}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <button
            onClick={handleSave}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg gap-2 transition"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
