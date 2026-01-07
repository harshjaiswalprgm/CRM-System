import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  BarChart3,
  Megaphone,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ onLogout, isOpen, setIsOpen }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <Home size={20} /> },
    {
      name: "Manage Users",
      path: "/admin/manage-users",
      icon: <UserPlus size={20} />,
    },
    { name: "Employees", path: "/admin/employees", icon: <Users size={20} /> },
    { name: "Interns", path: "/admin/interns", icon: <Users size={20} /> },
    { name: "Revenue", path: "/admin/revenue", icon: <BarChart3 size={20} /> },
    {
      name: "Announcements",
      path: "/admin/announcements",
      icon: <Megaphone size={20} />,
    },
  ];

  const SidebarContent = (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      exit={{ x: -260 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="w-64 h-screen fixed left-0 top-0 z-50 flex flex-col
      bg-gradient-to-b from-orange-400 via-orange-700 to-orange-700
      shadow-2xl text-white"
    >
      {/* HEADER */}
      <div className="p-6 border-b border-orange-300/30 relative">
        <h2 className="text-2xl font-extrabold tracking-wide text-center">
          Glowlogics
        </h2>
        <p className="text-xs text-center text-orange-100 mt-1 tracking-wider">
          ADMIN PANEL
        </p>

        {/* MOBILE CLOSE */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:hidden text-white/80 hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex flex-col mt-6 space-y-1 px-3">
        {links.map((link) => {
          const active = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
                ${
                  active
                    ? "bg-white/20 text-yellow-300 shadow-inner"
                    : "hover:bg-white/10 hover:text-yellow-200 text-white/90"
                }`}
            >
              <span className="opacity-90">{link.icon}</span>
              <span className="text-sm tracking-wide">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto mb-5 mx-4 border-t border-orange-300/30 pt-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-red-200 hover:text-red-400
          hover:bg-white/10 rounded-xl transition-all w-full"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>

        <p className="text-[11px] text-orange-200 text-center mt-4 opacity-70">
          © 2025 Glowlogics
        </p>
      </div>
    </motion.aside>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block">{SidebarContent}</div>

      {/* MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {SidebarContent}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
