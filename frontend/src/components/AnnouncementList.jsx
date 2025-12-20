import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  /* ===============================
     FETCH ANNOUNCEMENTS
  =============================== */
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  /* ===============================
     DELETE ANNOUNCEMENT (ADMIN)
  =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements(); // refresh list
    } catch (error) {
  console.error("Delete announcement failed:", error);
  alert("Failed to delete announcement");
}

  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mt-6">
      <h3 className="text-gray-700 font-semibold mb-4">
        Recent Announcements
      </h3>

      {announcements.length === 0 ? (
        <p className="text-gray-500 text-sm">No announcements yet.</p>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          {announcements.map((a) => (
            <li
              key={a._id}
              className="border-b pb-3 flex justify-between items-start"
            >
              <div>
                <p className="font-medium text-gray-800">{a.title}</p>
                <p className="text-sm text-gray-600">{a.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* 🔴 DELETE BUTTON → ADMIN ONLY */}
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnnouncementList;
