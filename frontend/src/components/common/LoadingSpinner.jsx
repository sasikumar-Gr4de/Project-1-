import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "primary",
  text = "Loading...",
  showText = true,
  className = "",
  centered = true,
  fullWidth = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  // Harmonized color palette using your primary blue
  const colorClasses = {
    primary: "text-primary",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const containerClasses = `
    ${
      centered
        ? "flex flex-col items-center justify-center"
        : "flex flex-col items-start justify-center"
    }
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  const spinnerClasses = `
    ${sizeClasses[size]}
    ${colorClasses[color]}
    animate-spin rounded-full border-4 border-solid border-current border-r-transparent
    flex-shrink-0
  `;

  return (
    <div className={containerClasses}>
      <div
        className={`flex items-center ${
          centered ? "justify-center" : "justify-start"
        } ${fullWidth ? "w-full" : ""}`}
      >
        <div className={spinnerClasses} role="status" aria-label="Loading">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {showText && (
        <p
          className={`mt-2 ${textSizeClasses[size]} ${
            colorClasses[color]
          } font-medium ${centered ? "text-center" : "text-left"} ${
            fullWidth ? "w-full" : ""
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
