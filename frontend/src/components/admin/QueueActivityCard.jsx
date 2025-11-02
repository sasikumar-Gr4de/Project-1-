import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Trash2, Calendar, Clock, User } from "lucide-react";

const QueueActivityCard = ({
  job,
  onRetry,
  onDelete,
  avgProcessingTime = 15,
  showActions = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const getStatusColor = (status) => {
    const colors = {
      uploaded: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      failed: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || colors.pending;
  };

  const getPlayerInitials = (playerName) => {
    if (!playerName) return "??";
    return playerName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlayerColor = (playerName) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-blue-500",
      "from-teal-500 to-green-500",
      "from-amber-500 to-orange-500",
    ];
    const index = playerName ? playerName.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div
      className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4 hover:border-primary/50 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Player Avatar */}
          <div
            className={`w-12 h-12 rounded-xl bg-linear-to-br ${getPlayerColor(
              job.users?.player_name
            )} flex items-center justify-center shadow-lg shrink-0`}
          >
            <span className="text-white font-bold text-sm">
              {getPlayerInitials(job.users?.player_name)}
            </span>
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-white font-semibold truncate">
                {job.users?.player_name || "Unknown Player"}
              </h3>
              {job.users?.position && (
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md font-medium shrink-0">
                  {job.users.position}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-[#B0AFAF] space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="truncate">{formatDate(job.match_date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="truncate">{getTimeAgo(job.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex flex-col items-end space-y-3 ml-3">
          <div
            className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
              job.status
            )} whitespace-nowrap`}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </div>

          {showActions && (
            <div
              className={`flex items-center space-x-2 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {job.status === "failed" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRetry?.(job.id)}
                  className="h-8 w-8 p-0 bg-primary/10 text-primary hover:bg-primary/20"
                  title="Retry Job"
                >
                  <Play className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(job.id)}
                className="h-8 w-8 p-0 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                title="Delete Job"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar for processing jobs */}
      {job.status === "processing" && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[#B0AFAF] mb-1">
            <span>Processing...</span>
            <span>~{avgProcessingTime} min</span>
          </div>
          <Progress value={65} className="h-1 bg-[#343434]" />
        </div>
      )}
    </div>
  );
};

export default QueueActivityCard;
