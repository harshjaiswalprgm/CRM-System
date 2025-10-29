import React from "react";

const AnnouncementList = () => {
  const announcements = [
    { id: 1, title: "Team Meeting Tomorrow", date: "2025-10-28" },
    { id: 2, title: "New Intern Batch Joining Next Week", date: "2025-11-01" },
    { id: 3, title: "Diwali Celebration Event 🎉", date: "2025-11-05" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mt-6">
      <h3 className="text-gray-700 font-semibold mb-4">Recent Announcements</h3>
      <ul className="space-y-3 max-h-48 overflow-y-auto">
        {announcements.map((a) => (
          <li key={a.id} className="flex justify-between border-b pb-2 text-gray-600">
            <span>{a.title}</span>
            <span className="text-sm text-gray-400">{a.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementList;
