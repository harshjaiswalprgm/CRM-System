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
    activeToday: 0,
    revenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    fetchAdminAnalytics();
  }, []);

  /* ================= REAL ANALYTICS ================= */
  const fetchAdminAnalytics = async () => {
    try {
      const [overviewRes, revenueRes, performanceRes] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/analytics/revenue"),
        api.get("/analytics/performance"),
      ]);

      setStats(overviewRes.data);
      setRevenueData(revenueRes.data);
      setPerformanceData(performanceRes.data);
    } catch (error) {
      console.error("Admin analytics failed, using fallback:", error);
      fetchStatsFallback();
    } finally {
      setLoading(false);
    }
  };

  /* ================= FALLBACK (USERS ONLY) ================= */
  const fetchStatsFallback = async () => {
    try {
      const usersRes = await api.get("/users");
      const users = usersRes.data;

      setStats({
        totalUsers: users.length,
        interns: users.filter((u) => u.role === "intern").length,
        employees: users.filter((u) => u.role === "employee").length,
        managers: users.filter((u) => u.role === "manager").length,
        activeToday: 0,
        revenue: 0,
      });
    } catch (error) {
      console.error("Fallback stats failed:", error);
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

        {/* ================= ANALYTICS CARDS ================= */}
        <AnalyticsCards data={stats} loading={loading} />

        {/* ================= REVENUE ================= */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Revenue Overview
          </h2>
          <RevenueChart data={revenueData} />
        </div>

        {/* ================= TEAM PERFORMANCE ================= */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Team Performance
          </h2>
          <TeamPerformanceChart data={performanceData} />
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
