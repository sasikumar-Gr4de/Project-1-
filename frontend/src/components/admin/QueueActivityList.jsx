import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import QueueActivityCard from "./QueueActivityCard";

const QueueActivityList = ({
  jobs = [],
  onRetry,
  onDelete,
  avgProcessingTime = 15,
  showActions = true,
  emptyStateTitle = "No Active Jobs",
  emptyStateDescription = "There are no data processing jobs in the queue at the moment.",
  viewAllHref,
  viewAllText = "View All Jobs",
  className = "",
}) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div
        className={`text-center py-12 border-2 border-dashed border-[#343434] rounded-xl ${className}`}
      >
        <BarChart3 className="w-12 h-12 text-[#B0AFAF] mx-auto mb-4" />
        <p className="text-[#B0AFAF] font-medium">{emptyStateTitle}</p>
        <p className="text-sm text-[#B0AFAF] mt-1">{emptyStateDescription}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <QueueActivityCard
            key={job.id || index}
            job={job}
            onRetry={onRetry}
            onDelete={onDelete}
            avgProcessingTime={avgProcessingTime}
            showActions={showActions}
          />
        ))}
      </div>

      {/* View All Button */}
      {viewAllHref && jobs.length > 0 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => (window.location.href = viewAllHref)}
            className="border-[#343434] text-[#B0AFAF] hover:bg-[#262626] hover:text-white"
          >
            {viewAllText}
            <BarChart3 className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QueueActivityList;
