import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Save, ArrowLeft } from "lucide-react";

const AddUserPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "intern",
    teamName: "",
    position: "",
    joiningDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.password || !form.role) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await api.post("/users", form);
      alert(`✅ ${res.data.name} added successfully!`);
      navigate("/admin"); // redirect to Admin dashboard
    } catch (err) {
      console.error("Error adding user:", err);
      alert(
        err.response?.data?.message ||
          "❌ Failed to add user. Check console for details."
      );
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <input
            type="password"
            name="password"
            placeholder="Temporary Password"
            value={form.password}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="employee">Employee</option>
            <option value="intern">Intern</option>
          </select>

          <input
            type="text"
            name="teamName"
            placeholder="Team Name (for Interns)"
            value={form.teamName}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="text"
            name="position"
            placeholder="Position (for Employees)"
            value={form.position}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <button
            type="submit"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg gap-2 transition"
          >
            <Save size={18} /> Save User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserPage;
