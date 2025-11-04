import React from "react";
import { motion } from "framer-motion";

const AnalyticsCards = ({ data }) => {
  const cards = [
    { title: "Total Users", value: data.totalUsers || 0 },
    { title: "Employees", value: data.employees || 0 },
    { title: "Interns", value: data.interns || 0 },
    { title: "Active Today", value: data.activeToday || 0 },
    { title: "Total Revenue", value: `₹${data.revenue || 0}` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-center text-center"
        >
          <p className="text-sm text-gray-500">{card.title}</p>
          <h3 className="text-2xl font-semibold text-blue-600 mt-1">{card.value}</h3>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
