import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import RevenueChart from "./RevenueChart";
import AttendanceSummary from "./AttendanceSummary";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchPerformance();
    fetchAttendance();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchPerformance = async () => {
    try {
      const res = await api.get(`/users/${id}/performance`);
      setPerformance(res.data);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/users/${id}/attendance`);
      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-gray-800">
            Revenue Performance
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
    </div>
  );
};

export default UserProfile;
