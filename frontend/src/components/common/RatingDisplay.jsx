import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const RatingDisplay = ({ rating = 0, size = "md", className = "" }) => {
  const numericRating = Number(rating) || 0;
  const hasRating = numericRating > 0;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const starSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  // If rating is 0, show gray zero box
  if (!hasRating) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center",
          "border border-gray-600 rounded-lg",
          "bg-transparent text-gray-600 font-medium",
          sizeClasses[size],
          className
        )}
      >
        <Star
          size={starSizes[size]}
          //   className="fill-yellow-500 text-yellow-500"
          fill="currentColor"
        />{" "}
        &nbsp; 0.0
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        "bg-yellow-50 border border-yellow-200 rounded-lg",
        "text-yellow-800 font-medium",
        sizeClasses[size],
        className
      )}
    >
      {/* Star icon */}
      <Star
        size={starSizes[size]}
        className="fill-yellow-500 text-yellow-500"
        fill="currentColor"
      />

      {/* Rating score */}
      <span className="font-semibold">
        {numericRating % 1 === 0 ? numericRating : numericRating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingDisplay;
