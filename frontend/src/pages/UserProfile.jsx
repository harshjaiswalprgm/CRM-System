import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import RevenueChart from "../components/RevenueChart";
import AttendanceSummary from "../components/AttendanceSummary";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salary, setSalary] = useState([]);

  const [baseSalary, setBaseSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [deductions, setDeductions] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchPerformance();
    fetchAttendance();
    fetchSalary();
  }, [id]);

  /* ---------------- FETCH USER ---------------- */
  const fetchUserData = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  /* ---------------- FETCH PERFORMANCE ---------------- */
  const fetchPerformance = async () => {
    try {
      const res = await api.get(`/users/${id}/performance`);
      setPerformance(res.data);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  /* ---------------- FETCH ATTENDANCE ---------------- */
  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/user/${id}`);
      setAttendance(res.data);
    } catch (err) {
      console.warn("Attendance not found");
      setAttendance([]);
    }
  };

  /* ---------------- FETCH SALARY ---------------- */
  const fetchSalary = async () => {
    try {
      const res = await api.get(`/salary/${id}`);
      setSalary(res.data);
    } catch (err) {
      setSalary([]);
    }
  };

  /* ---------------- UPDATE SALARY (ADMIN / MANAGER) ---------------- */
  const handleSalarySubmit = async (e) => {
    e.preventDefault();

    if (!month) {
      alert("Please select month");
      return;
    }

    try {
      await api.post("/salary/set", {
        userId: id,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus),
        deductions: Number(deductions),
        month,
      });

      alert("✅ Salary / Stipend updated");
      fetchSalary();
      setBaseSalary("");
      setBonus("");
      setDeductions("");
    } catch (err) {
      alert("Failed to update salary");
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  const canManageSalary =
    loggedInUser?.role === "admin" ||
    loggedInUser?.role === "manager";

  const hideSalaryForUser =
    user.role === "intern" || user.role === "employee";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar || "https://via.placeholder.com/100"}
            alt={user.name}
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            <p className="text-sm text-gray-500">
              {user.teamName || user.position || "—"}
            </p>
            <p className="text-sm text-gray-500">
              Joined: {new Date(user.joiningDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* ================= PERFORMANCE ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-gray-800">
            Daily Revenue Performance
          </h3>
          <RevenueChart data={performance} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-gray-800">
            Attendance Summary
          </h3>
          <AttendanceSummary data={attendance} />
        </div>
      </div>

      {/* ================= SALARY (ADMIN / MANAGER ONLY) ================= */}
      {canManageSalary && !hideSalaryForUser && (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Salary / Stipend Management
          </h3>

          <form
            onSubmit={handleSalarySubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="number"
              placeholder="Base Amount"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Incentives"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Deductions"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-2"
            >
              Update
            </button>
          </form>

          {/* HISTORY */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">History</h4>

            {salary.length === 0 ? (
              <p className="text-gray-500">No records</p>
            ) : (
              <ul className="space-y-3">
                {salary.map((s) => (
                  <li key={s._id} className="border p-3 rounded bg-gray-50">
                    <p className="font-semibold">{s.month}</p>
                    <p>Base: ₹{s.baseSalary}</p>
                    <p>Incentives: ₹{s.bonus}</p>
                    <p>Deductions: ₹{s.deductions}</p>
                    <p className="font-bold">
                      Net Pay: ₹{s.totalSalary}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
