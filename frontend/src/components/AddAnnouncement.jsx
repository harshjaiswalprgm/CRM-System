import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Megaphone } from "lucide-react";

const AddAnnouncement = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/announcements/create", {
        ...form,
        adminId: user._id,
      });
      toast.success(res.data.message);
      setForm({ title: "", message: "", type: "general" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating announcement");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Megaphone className="text-blue-600" size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Create Announcement
          </h3>
          <p className="text-sm text-gray-500">
            Share updates with your team
          </p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TITLE */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Title
          </label>
          <input
            type="text"
            placeholder="Announcement title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Message
          </label>
          <textarea
            placeholder="Write your announcement message..."
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            rows="4"
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            required
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Announcement Type
          </label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="general">📢 General</option>
            <option value="birthday">🎂 Birthday</option>
            <option value="work-anniversary">🏆 Work Anniversary</option>
            <option value="festival">🎉 Festival</option>
            <option value="event">📅 Event</option>
          </select>
        </div>

        {/* BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
          >
            Publish Announcement
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAnnouncement;
