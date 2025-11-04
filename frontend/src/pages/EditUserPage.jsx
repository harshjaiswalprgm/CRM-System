import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { Save, ArrowLeft } from "lucide-react";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "intern",
    teamName: "",
    position: "",
    joiningDate: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setForm({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || "",
        role: res.data.role,
        teamName: res.data.teamName || "",
        position: res.data.position || "",
        joiningDate: res.data.joiningDate
          ? res.data.joiningDate.split("T")[0]
          : "",
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      alert("Failed to load user details");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${id}`, form);
      alert("✅ User updated successfully!");
      navigate("/admin"); // back to dashboard
    } catch (err) {
      console.error("Error updating user:", err);
      alert("❌ Failed to update user");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
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
            placeholder="Phone Number"
            value={form.phone}
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
            placeholder="Team Name"
            value={form.teamName}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="text"
            name="position"
            placeholder="Position"
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
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
