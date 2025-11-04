import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

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
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-gray-700 font-semibold mb-4">🗞️ Create Announcement</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-lg p-2"
          required
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border rounded-lg p-2"
          rows="3"
          required
        ></textarea>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border rounded-lg p-2"
        >
          <option value="general">General</option>
          <option value="birthday">Birthday</option>
          <option value="work-anniversary">Work Anniversary</option>
          <option value="festival">Festival</option>
          <option value="event">Event</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Post Announcement
        </button>
      </form>
    </div>
  );
};

export default AddAnnouncement;
