import React from "react";

const Navbar = ({ user }) => {
  return (
    <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 rounded-xl mb-6">
      <h1 className="text-2xl font-bold text-gray-700">Welcome, {user?.name}</h1>
      <p className="text-gray-500">{new Date().toDateString()}</p>
    </div>
  );
};

export default Navbar;
