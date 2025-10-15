// components/PlayerStatusBadge.jsx
import React from "react";

const PlayerStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const config = {
      active: {
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        label: "Active",
      },
      injured: {
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        label: "Injured",
      },
      suspended: {
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        label: "Suspended",
      },
      inactive: {
        color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        label: "Inactive",
      },
    };

    return config[status] || config.inactive;
  };

  const { color, label } = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}
    >
      {label}
    </span>
  );
};

export default PlayerStatusBadge;
