import React from "react";

const OverviewCards = ({ stats }) => {
  const cardStyles = "bg-white rounded-xl shadow-md p-5 w-full text-center";

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className={cardStyles}>
        <h3 className="text-gray-500">Total Employees</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.employees}</p>
      </div>
      <div className={cardStyles}>
        <h3 className="text-gray-500">Total Interns</h3>
        <p className="text-3xl font-bold text-green-600">{stats.interns}</p>
      </div>
      <div className={cardStyles}>
        <h3 className="text-gray-500">Revenue</h3>
        <p className="text-3xl font-bold text-purple-600">₹{stats.revenue}</p>
      </div>
    </div>
  );
};

export default OverviewCards;
