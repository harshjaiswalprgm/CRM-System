import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const ManagerRevenue = () => {
  const manager = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  /* ===============================
     FETCH ASSIGNED USERS
  =============================== */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/manager/interns");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ===============================
     HANDLE INPUT CHANGE
  =============================== */
  const handleChange = (userId, field, value) => {
    setForm({
      ...form,
      [userId]: {
        ...form[userId],
        [field]: value,
      },
    });
  };

  /* ===============================
     SUBMIT REVENUE
  =============================== */
  const handleSubmit = async (userId) => {
    const data = form[userId];

    if (!data?.amount || Number(data.amount) <= 0) {
      alert("Enter valid revenue amount");
      return;
    }

    try {
      setLoading(true);

      await api.post("/revenue/add", {
        userId,
        amount: Number(data.amount),
        date: data.date || today,
        description: data.description || "",
      });

      alert("✅ Revenue added successfully");

      setForm({
        ...form,
        [userId]: { amount: "", description: "", date: today },
      });
    } catch (error) {
      console.error("Revenue update failed:", error);
      alert("Failed to add revenue");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Navbar user={manager} />

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Update Daily Revenue
        </h1>

        {users.length === 0 ? (
          <p className="text-gray-500">No users assigned to you.</p>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border text-left">Name</th>
                  <th className="p-3 border text-left">Role</th>
                  <th className="p-3 border text-left">Date</th>
                  <th className="p-3 border text-left">Revenue (₹)</th>
                  <th className="p-3 border text-left">Description</th>
                  <th className="p-3 border text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border">
                    <td className="p-3 border font-medium">{u.name}</td>
                    <td className="p-3 border capitalize">{u.role}</td>

                    <td className="p-3 border">
                      <input
                        type="date"
                        value={form[u._id]?.date || today}
                        onChange={(e) =>
                          handleChange(u._id, "date", e.target.value)
                        }
                        className="border p-1 rounded"
                      />
                    </td>

                    <td className="p-3 border">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={form[u._id]?.amount || ""}
                        onChange={(e) =>
                          handleChange(u._id, "amount", e.target.value)
                        }
                        className="border p-1 rounded w-32"
                      />
                    </td>

                    <td className="p-3 border">
                      <input
                        type="text"
                        placeholder="Optional note"
                        value={form[u._id]?.description || ""}
                        onChange={(e) =>
                          handleChange(u._id, "description", e.target.value)
                        }
                        className="border p-1 rounded w-48"
                      />
                    </td>

                    <td className="p-3 border">
                      <button
                        onClick={() => handleSubmit(u._id)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        {loading ? "Saving..." : "Add"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerRevenue;
