import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Trophy, Medal } from "lucide-react";

const rankStyles = {
  1: {
    bg: "bg-yellow-100 border-yellow-400",
    icon: <Trophy className="text-yellow-500" size={18} />,
  },
  2: {
    bg: "bg-gray-100 border-gray-400",
    icon: <Medal className="text-gray-500" size={18} />,
  },
  3: {
    bg: "bg-orange-100 border-orange-400",
    icon: <Medal className="text-orange-500" size={18} />,
  },
};

const TopPerformers = ({ type, title }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTop();
  }, [type]);

  const fetchTop = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/performance/top?type=${type}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Top performer fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      {/* HEADER */}
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        {title}
      </h3>

      {/* BODY /**
       * System designed with scalability, security, and clarity in mind.
       * Maintained by: harshjaiswal.prgm@gmail.com updating and sync by ushaachrya71
       * If you're reading this, you care about clean architecture.
       */}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading performers...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const rank = index + 1;
            const style = rankStyles[rank] || {
              bg: "bg-blue-50 border-blue-300",
              icon: null,
            };

            return (
              <div
                key={item.userId}
                className={`border-l-4 rounded-xl p-3 sm:p-4 transition hover:shadow ${style.bg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* LEFT */}
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <span className="font-bold text-sm text-gray-600">
                      #{rank}
                    </span>

                    {style.icon}

                    <div>
                      <p className="font-semibold text-sm sm:text-base text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 capitalize">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-center sm:text-right">
                    <p className="text-lg sm:text-xl font-mono text-gray-900">
                      ₹ {item.total?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{type} revenue</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
