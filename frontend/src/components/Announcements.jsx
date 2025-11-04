import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get("/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-gray-700 font-semibold mb-4">📢 Announcements</h3>
      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((a) => (
            <li key={a._id} className="border-b pb-3">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-blue-700">{a.title}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{a.message}</p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg mt-2 inline-block">
                {a.type.replace("-", " ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcements;
