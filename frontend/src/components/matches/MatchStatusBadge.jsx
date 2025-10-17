import React from "react";
import { cn } from "@/lib/utils";
import { MATCH_STATUS_OPTIONS } from "@/utils/constants";
import { Clock, Play, Check, X, Calendar } from "lucide-react";

const MatchStatusBadge = ({ status, className = "" }) => {
  const statusConfig = MATCH_STATUS_OPTIONS.find((s) => s.value === status) || {
    label: status,
    color: "gray",
  };

  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    gray: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const statusIcons = {
    upcoming: Clock,
    live: Play,
    completed: Check,
    cancelled: X,
    postponed: Calendar,
  };

  const StatusIcon = statusIcons[status] || Clock;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colorClasses[statusConfig.color],
        className
      )}
    >
      <StatusIcon className="w-3 h-3 mr-1" />
      {statusConfig.label}
    </span>
  );
};

export default MatchStatusBadge;
