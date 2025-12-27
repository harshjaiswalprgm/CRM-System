// import React, { useState } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// const AttendanceChart = ({ data }) => {
//   const [view, setView] = useState("bar");

//   // 🔄 format data for chart
//   const chartData = data.map((d) => ({
//     date: new Date(d.date).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//     }),
//     hours: d.hours,
//   }));

//   if (!chartData.length) {
//     return <p className="text-gray-500">No attendance data</p>;
//   }

//   return (
//     <div>
//       {/* 🔁 Toggle */}
//       <div className="flex gap-3 mb-4">
//         <button
//           onClick={() => setView("bar")}
//           className={`px-4 py-1 rounded ${
//             view === "bar"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Bar
//         </button>
//         <button
//           onClick={() => setView("line")}
//           className={`px-4 py-1 rounded ${
//             view === "line"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Line
//         </button>
//       </div>

//       {/* 📊 Chart */}
//       <ResponsiveContainer width="100%" height={280}>
//         {view === "bar" ? (
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="hours" fill="#3b82f6" />
//           </BarChart>
//         ) : (
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="hours"
//               stroke="#10b981"
//               strokeWidth={3}
//             />
//           </LineChart>
//         )}
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default AttendanceChart;
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({ data = [] }) => {
  const [view, setView] = useState("bar"); // bar | line

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No attendance data available
      </p>
    );
  }

  // normalize data for charts
  const chartData = data.map((d) => ({
    date: d.date,
    hours: d.hours || d.totalHours || 0,
  }));

  return (
    <div>
      {/* TOGGLE */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setView("bar")}
          className={`px-4 py-1 rounded ${
            view === "bar"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Bar
        </button>
        <button
          onClick={() => setView("line")}
          className={`px-4 py-1 rounded ${
            view === "line"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Line
        </button>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={300}>
        {view === "bar" ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#3b82f6" />
          </BarChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#16a34a"
              strokeWidth={3}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
