import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

const TeamPerformanceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await api.get("/performance");
        setData(res.data || []);
      } catch (err) {
        console.error("Error fetching team performance:", err);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-gray-700 font-semibold mb-4">👥 Team Performance</h3>
      {data.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No performance data yet.</p>
      )}
    </div>
  );
};

export default TeamPerformanceChart;
