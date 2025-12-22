import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* -------------------------------
     FETCH ASSIGNED INTERNS / EMPLOYEES
  -------------------------------- */
  const fetchAssignedUsers = async () => {
    try {
      const res = await api.get("/users/manager/interns");
      setAssignedUsers(res.data);
    } catch (error) {
      console.error("Error fetching assigned users:", error);
    }
  };

  /* -------------------------------
     FETCH ANNOUNCEMENTS
  -------------------------------- */
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  useEffect(() => {
    fetchAssignedUsers();
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Navbar user={loggedInUser} />

        {/* ================= MANAGER PROFILE ================= */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Manager Dashboard
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your interns & probation employees, track performance, and
            update stipends.
          </p>

          <div className="mt-6 flex items-center gap-6">
            <img
              src={loggedInUser?.avatar || "https://via.placeholder.com/100"}
              alt="Manager Avatar"
              className="w-20 h-20 rounded-full border"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{loggedInUser?.name}</p>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{loggedInUser?.email}</p>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">Team</p>
                <p className="font-semibold">
                  {loggedInUser?.teamName || "Not Assigned"}
                </p>
              </div>
            </div>
          </div>

          {/* STIPEND BUTTON */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/manager/stipend")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Manage Intern Stipends
            </button>

            <button
              onClick={() => navigate("/manager/revenue")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition ml-3"
            >
              Update Revenue
            </button>
          </div>
        </div>

        {/* ================= ASSIGNED USERS ================= */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Assigned Interns & Probation Employees
          </h3>

          {assignedUsers.length === 0 ? (
            <p className="text-gray-500">No users assigned to you yet.</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Team</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedUsers.map((u) => (
                  <tr key={u._id} className="border">
                    <td className="p-3 border">{u.name}</td>
                    <td className="p-3 border">{u.email}</td>
                    <td className="p-3 border capitalize">{u.role}</td>
                    <td className="p-3 border">{u.teamName || "-"}</td>
                    <td className="p-3 border">
                      <button
                        onClick={() => navigate(`/admin/user/${u._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Performance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ================= ANNOUNCEMENTS ================= */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Announcements
          </h3>

          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements yet.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li key={a._id} className="border p-3 rounded-lg bg-gray-50">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-gray-600">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
