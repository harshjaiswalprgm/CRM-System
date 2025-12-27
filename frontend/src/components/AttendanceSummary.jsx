import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AttendanceSummary = ({ userId }) => {
  const [data, setData] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const targetUserId = userId || loggedInUser?._id;

  useEffect(() => {
    if (!targetUserId) return;

    const fetchSummary = async () => {
      try {
        const res = await api.get(`/attendance/summary/${targetUserId}`);
        setData(res.data?.summary || []);
      } catch (err) {
        console.error("Error fetching attendance summary:", err);
        setData([]);
      }
    };

    fetchSummary();
  }, [targetUserId]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h3 className="text-gray-700 font-semibold mb-4">
        Attendance Summary
      </h3>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {/* 🔥 FIXED KEY */}
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No attendance data yet.</p>
      )}
    </div>
  );
};

export default AttendanceSummary;
