import React from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const LoadingContainer = ({
  loading,
  children,
  size = "md",
  text = "Loading data...",
  overlay = false,
  className = "",
}) => {
  if (loading) {
    if (overlay) {
      return (
        <div className={`relative ${className}`}>
          <div className="opacity-50 pointer-events-none">{children}</div>
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <LoadingSpinner size={size} text={text} />
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <LoadingSpinner size={size} text={text} />
      </div>
    );
  }

  return children;
};

export default LoadingContainer;
