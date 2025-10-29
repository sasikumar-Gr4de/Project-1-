import React from "react";
import { cn } from "@/lib/utils";

const LoadingSpinner = ({
  size = "md",
  type = "spinner",
  color = "primary",
  text = "",
  centered = false,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
    white: "text-white",
    destructive: "text-destructive",
  };

  const Spinner = () => (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    />
  );

  const Pulse = () => (
    <div
      className={cn(
        "animate-pulse rounded-full bg-current",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    />
  );

  const Dots = () => (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-bounce rounded-full bg-current",
            size === "sm" && "w-1.5 h-1.5",
            size === "md" && "w-2 h-2",
            size === "lg" && "w-2.5 h-2.5",
            size === "xl" && "w-3 h-3",
            colorClasses[color]
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const Bars = () => (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-sm bg-current",
            size === "sm" && "w-1 h-2",
            size === "md" && "w-1.5 h-3",
            size === "lg" && "w-2 h-4",
            size === "xl" && "w-2.5 h-5",
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );

  const Ring = () => (
    <div
      className={cn(
        "animate-spin rounded-full border-4 border-t-4 border-current border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{ borderTopColor: "transparent" }}
      {...props}
    />
  );

  const renderSpinner = () => {
    switch (type) {
      case "pulse":
        return <Pulse />;
      case "dots":
        return <Dots />;
      case "bars":
        return <Bars />;
      case "ring":
        return <Ring />;
      case "spinner":
      default:
        return <Spinner />;
    }
  };

  if (centered) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        {renderSpinner()}
        {text && (
          <p
            className={cn(
              "text-sm",
              color === "white" ? "text-white" : "text-muted-foreground"
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex items-center space-x-3">
        {renderSpinner()}
        <span
          className={cn(
            "text-sm",
            color === "white" ? "text-white" : "text-muted-foreground"
          )}
        >
          {text}
        </span>
      </div>
    );
  }

  return renderSpinner();
};

export default LoadingSpinner;
