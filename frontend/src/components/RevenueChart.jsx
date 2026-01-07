import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  const [chartType, setChartType] = useState("line");

  const totalRevenue = data.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            Revenue Overview
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Daily revenue performance
          </p>
        </div>

        {/* TOTAL */}
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm">
          Total: ₹ {totalRevenue.toLocaleString()}
        </div>
      </div>

      {/* TOGGLE */}
      <div className="flex gap-2 mb-4">
        {["line", "bar"].map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              chartType === type
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type === "line" ? "Line Chart" : "Bar Chart"}
          </button>
        ))}
      </div>

      {/* CHART */}
      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No revenue data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => [`₹ ${value}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => [`₹ ${value}`, "Revenue"]}
              />
              <Bar
                dataKey="amount"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;
