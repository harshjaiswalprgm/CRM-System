import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RevenueChart from "../components/RevenueChart";
import AttendanceSummary from "../components/AttendanceSummary";
import { ArrowLeft } from "lucide-react";

const ManagerViewDashboard = () => {
  const { id } = useParams(); // 👈 TARGET USER ID
  const navigate = useNavigate();
  const manager = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchPerformance();
    fetchAttendance();
  }, [id]);

  /* ================= FETCH TARGET USER ================= */
  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error("User fetch failed");
    }
  };

  /* ================= FETCH REVENUE ================= */
  const fetchPerformance = async () => {
    try {
      const res = await api.get(`/revenue/${id}`);
      setPerformance(res.data);
    } catch (err) {
      setPerformance([]);
    }
  };

  /* ================= FETCH ATTENDANCE ================= */
  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/summary/${id}`);
      setAttendance(res.data.summary || []);
    } catch {
      setAttendance([]);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Navbar user={manager} />

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* ================= PROFILE ================= */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="capitalize text-sm text-gray-500">{user.role}</p>
        </div>

        {/* ================= PERFORMANCE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Revenue Performance</h3>
            <RevenueChart data={performance} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Attendance Summary</h3>
            <AttendanceSummary data={attendance} />
          </div>
        </div>

        {/* 🔒 READ-ONLY NOTICE */}
        <p className="text-sm text-gray-500 mt-6">
          * Read-only view. Managers cannot modify data here.
        </p>
      </div>
    </div>
  );
};

export default ManagerViewDashboard;
