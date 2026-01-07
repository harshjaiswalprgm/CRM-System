import React, { useEffect, useState } from "react";
import { Menu, Users } from "lucide-react";
import ActiveToday from "./ActiveToday";
import api from "../api/axios";

const Navbar = ({ user, onMenuClick }) => {
  const [showActive, setShowActive] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  const canViewActive =
    user?.role === "admin" || user?.role === "manager";

  // ✅ FETCH COUNT ON LOAD
  useEffect(() => {
    if (!canViewActive) return;

    const fetchCount = async () => {
      try {
        const res = await api.get("/attendance/active-today");
        setActiveCount(res.data?.length || 0);
      } catch (err) {
        console.error("Active count fetch failed");
      }
    };

    fetchCount();

    // 🔁 OPTIONAL: auto refresh every 60 sec
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [canViewActive]);

  return (
    <div className="relative flex items-center justify-between bg-white shadow-sm border px-4 md:px-6 py-4 rounded-2xl mb-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-base md:text-xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 capitalize">
            {user?.role} dashboard
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        {/* ACTIVE BADGE */}
        {canViewActive && (
          <div className="relative">
            <button
              onClick={() => setShowActive((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
              bg-green-50 text-green-700 hover:bg-green-100 transition shadow-sm"
            >
              <Users size={18} />
              <span className="text-sm font-semibold">
                Active ({activeCount})
              </span>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </button>

            {showActive && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowActive(false)}
                />
                <div className="absolute right-0 mt-3 z-40">
                  <ActiveToday compact />
                </div>
              </>
            )}
          </div>
        )}

        {/* DATE */}
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-400">Today</p>
          <p className="text-sm font-medium text-gray-600">
            {new Date().toDateString()}
          </p>
        </div>

        {/* AVATAR */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
