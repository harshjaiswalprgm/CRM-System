import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AnalyticsCards from "../components/AnalyticsCards";
import RevenueChart from "../components/RevenueChart";
import TeamPerformanceChart from "../components/TeamPerformanceChart";
import AnnouncementList from "../components/AnnouncementList";
import AddAnnouncement from "../components/AddAnnouncement";
import api from "../api/axios";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    employees: 0,
    interns: 0,
    managers: 0,
    revenue: 0,
    activeToday: 0,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    fetchStatsFallback();
  }, []);

  /* ---------------- SAFE ANALYTICS (NO 404) ---------------- */
  const fetchStatsFallback = async () => {
    try {
      const usersRes = await api.get("/users");
      const users = usersRes.data;

      const totalUsers = users.length;
      const interns = users.filter((u) => u.role === "intern").length;
      const employees = users.filter((u) => u.role === "employee").length;
      const managers = users.filter((u) => u.role === "manager").length;

      setStats((prev) => ({
        ...prev,
        totalUsers,
        interns,
        employees,
        managers,
      }));
    } catch (error) {
      console.error("Admin stats fallback failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Navbar user={user} />

        {/* ================= ANALYTICS ================= */}
        <AnalyticsCards data={stats} />

        {/* ================= REVENUE ================= */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Revenue Overview
          </h2>
          <RevenueChart />
        </div>

        {/* ================= TEAM PERFORMANCE ================= */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Team Performance
          </h2>
          <TeamPerformanceChart />
        </div>

        {/* ================= ANNOUNCEMENTS ================= */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <AddAnnouncement />
          <AnnouncementList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
