import React from "react";

const TournamentStatusBadge = ({ status }) => {
  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    live: {
      label: "Live",
      color: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    completed: {
      label: "Completed",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    },
    postponed: {
      label: "Postponed",
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
  };

  const config = statusConfig[status] || statusConfig.upcoming;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
    >
      {config.label}
    </span>
  );
};

export default TournamentStatusBadge;
