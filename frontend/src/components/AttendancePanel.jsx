import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AttendancePanel = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const emptyAttendance = {
    checkIn: null,
    lunchOut: null,
    lunchIn: null,
    breakOut: null,
    breakIn: null,
    checkOut: null,
  };

  const [attendance, setAttendance] = useState(emptyAttendance);

  /* ===============================
     LOAD TODAY ATTENDANCE (ALL ROLES)
  =============================== */
  useEffect(() => {
    if (!user?._id) return;

    const loadTodayAttendance = async () => {
      try {
        const res = await api.get("/attendance/me");
        const today = new Date().toISOString().split("T")[0];

        const todayRecord = res.data.find((r) => r.date === today);
        if (!todayRecord) return;

        const updated = { ...emptyAttendance };
        todayRecord.events.forEach((e) => {
          updated[e.type] = new Date(e.time).toLocaleTimeString();
        });

        setAttendance(updated);
      } catch (err) {
        console.warn("No attendance marked yet");
      }
    };

    loadTodayAttendance();
  }, [user?._id]);

  /* ===============================
     MARK ATTENDANCE
  =============================== */
  const handleMark = async (type) => {
    try {
      await api.post("/attendance/mark", {
        userId: user._id,
        type,
      });

      setAttendance((prev) => ({
        ...prev,
        [type]: new Date().toLocaleTimeString(),
      }));

      toast.success(`${type.replace(/([A-Z])/g, " $1")} marked`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to mark attendance"
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-gray-700 font-semibold mb-4">
        Attendance Panel ({user?.role?.toUpperCase()})
      </h3>

      {/* BUTTONS */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(attendance).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleMark(key)}
            disabled={!!value}
            className={`py-2 px-4 rounded-lg font-medium transition ${
              value
                ? "bg-green-100 text-green-600 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-400"
            }`}
          >
            {value
              ? `${key.replace(/([A-Z])/g, " $1")} ✅`
              : key.replace(/([A-Z])/g, " $1")}
          </button>
        ))}
      </div>

      {/* STATUS */}
      <div className="mt-6 border-t pt-4 text-sm text-gray-600">
        {Object.entries(attendance).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span>{key.replace(/([A-Z])/g, " $1")}:</span>
            <span>{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendancePanel;
