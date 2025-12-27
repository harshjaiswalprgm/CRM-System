import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import InternDashboard from "./pages/InternDashboard";
import ManagerStipend from "./pages/ManagerStipend";
import ManagerRevenue from "./pages/ManagerRevenue";
import ManagerViewDashboard from "./pages/ManagerViewDashboard";
import UserProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";
import EditUserPage from "./pages/EditUserPage";
import AddUserPage from "./pages/AddUserPage";
import ManageUsers from "./pages/ManageUsers";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* =========================
   ✅ PROTECTED ROUTE
========================= */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* =========================
   ✅ APP ROUTER
========================= */
const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const getRedirectPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "manager":
        return "/manager";
      case "employee":
        return "/employee";
      case "intern":
        return "/intern";
      default:
        return "/";
    }
  };

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />

      <Routes>
        {/* ================= LOGIN ================= */}
        <Route
          path="/"
          element={
            user ? <Navigate to={getRedirectPath()} replace /> : <Login />
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-user/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= MANAGER ================= */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/stipend"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerStipend />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/revenue"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerRevenue />
            </ProtectedRoute>
          }
        />
        {/* ================= MANAGER VIEW USER DASHBOARD ================= */}
        <Route
          path="/manager/view-dashboard/:id"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerViewDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= EMPLOYEE ================= */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= INTERN ================= */}
        <Route
          path="/intern"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
