import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AnalyticsCards from "../components/AnalyticsCards";
import RevenueChart from "../components/RevenueChart";
import TeamPerformanceChart from "../components/TeamPerformanceChart";
import AnnouncementList from "../components/AnnouncementList";
import AddAnnouncement from "../components/AddAnnouncement";
import AdminLeaveApproval from "../components/AdminLeaveApproval";
import TopPerformers from "../components/TopPerformers";
import ManagerRevenue from "../components/ManagerRevenue";
import api from "../api/axios";
import BirthdayBanner from "../components/BirthdayBanner";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📅 Excel filters
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) return;
    setUser(u);
    fetchAdminAnalytics();
  }, []);

  /* ================= FETCH ANALYTICS ================= */
  const fetchAdminAnalytics = async () => {
    try {
      const [o, r, p] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/analytics/revenue"),
        api.get("/analytics/performance"),
      ]);
      setStats(o.data);
      setRevenueData(r.data);
      setPerformanceData(p.data);
    } catch (err) {
      console.error("Admin analytics failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD LEAVE EXCEL ================= */
  const downloadLeaveExcel = async () => {
    try {
      const res = await api.get(`/leaves/export?month=${month}&year=${year}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Leave_Report_${month}_${year}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Leave export failed", err);
      alert("Failed to download leave report");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* MAIN */}
      <div className="flex-1 p-4 md:ml-64">
        <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />

        {/* ANALYTICS */}
        <AnalyticsCards data={stats} loading={loading} />

        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <RevenueChart data={revenueData} />
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <TeamPerformanceChart data={performanceData} />
        </div>

        {/* MANAGER-WISE REVENUE */}
        <ManagerRevenue />
        <BirthdayBanner />

        {/* TOP PERFORMERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <TopPerformers type="daily" title="🏅 Daily Top Performers" />
          <TopPerformers type="weekly" title="🔥 Weekly Top Performers" />
          <TopPerformers type="monthly" title="🏆 Monthly Top Performers" />
        </div>

        {/* LEAVES + EXCEL */}
        <div className="bg-white rounded-xl shadow p-6 mt-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Leave Approvals</h2>

            <div className="flex gap-2 flex-wrap">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <button
                onClick={downloadLeaveExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                ⬇ Download Excel
              </button>
            </div>
          </div>

          <AdminLeaveApproval />
        </div>

        {/* ANNOUNCEMENTS */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <AddAnnouncement />
          <AnnouncementList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
