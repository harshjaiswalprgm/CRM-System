import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  BarChart3,
  Megaphone,
  LogOut,
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <Home size={20} /> },
    { name: "Manage Users", path: "/admin/manage-users", icon: <UserPlus size={20} /> },
    { name: "Employees", path: "/admin/employees", icon: <Users size={20} /> },
    { name: "Interns", path: "/admin/interns", icon: <Users size={20} /> },
    { name: "Revenue", path: "/admin/revenue", icon: <BarChart3 size={20} /> },
    { name: "Announcements", path: "/admin/announcements", icon: <Megaphone size={20} /> },
  ];

  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-64 h-screen fixed left-0 top-0 flex flex-col bg-gradient-to-b from-orange-500 via-orange-600 to-orange-800 shadow-2xl text-white"
    >
      {/* Logo / Title */}
      <div className="p-6 border-b border-orange-300/30">
        <h2 className="text-3xl font-bold tracking-wide text-center">
          <span className="text-white">Glowlogics</span>
        </h2>
        <p className="text-sm text-center text-orange-100 mt-1">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-8 space-y-1 px-4">
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                active
                  ? "bg-orange-100/20 text-yellow-300 border-l-4 border-yellow-400"
                  : "hover:bg-orange-400/30 hover:text-yellow-200 text-white/90"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Divider Line */}
      <div className="mt-auto mb-4 mx-4 border-t border-orange-300/30 pt-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-200 hover:text-red-400 hover:bg-orange-400/20 rounded-lg transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>

        <p className="text-xs text-orange-200 text-center mt-3 opacity-70">
          © 2025 Glowlogics
        </p>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
