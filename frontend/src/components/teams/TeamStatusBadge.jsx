import React from "react";
import { cn } from "../../lib/utils";
import { TEAM_STATUS_OPTIONS } from "../../utils/constants";

const TeamStatusBadge = ({ status, className = "" }) => {
  const statusConfig = TEAM_STATUS_OPTIONS.find((s) => s.value === status) || {
    label: status,
    color: "gray",
  };

  const colorClasses = {
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
    gray: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colorClasses[statusConfig.color],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          statusConfig.color === "green" && "bg-green-400",
          statusConfig.color === "red" && "bg-red-400",
          statusConfig.color === "gray" && "bg-gray-400"
        )}
      />
      {statusConfig.label}
    </span>
  );
};

export default TeamStatusBadge;
