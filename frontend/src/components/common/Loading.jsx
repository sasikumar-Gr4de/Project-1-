import React from "react";
import { cn } from "@/lib/utils";

const Loading = ({
  size = "default",
  variant = "gradient-spinner",
  text = "Loading...",
  fullScreen = false,
  className = "",
  overlay = false,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-purple-600",
    green: "from-green-400 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-400 to-red-500",
    teal: "from-teal-400 to-blue-500",
  };

  const sizeClasses = {
    sm: "h-6 w-6",
    default: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const textSizes = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  // Modern Gradient Spinner with glow effect
  const GradientSpinner = () => (
    <div className={cn("relative", sizeClasses[size])}>
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-r animate-spin border-2 border-transparent",
          colorClasses[color],
          "shadow-lg"
        )}
      />
      <div
        className={cn(
          "absolute inset-2 rounded-full bg-gray-900/90 backdrop-blur-sm"
        )}
      />
    </div>
  );

  // Holographic Wave Animation
  const HolographicWave = () => (
    <div className={cn("relative", sizeClasses[size])}>
      {/* Base orb */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br opacity-80",
          colorClasses[color],
          "animate-pulse"
        )}
      />

      {/* Moving wave lines */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 opacity-60",
          `border-${color.split("-")[0]}-400`,
          "animate-wave"
        )}
      />

      <div
        className={cn(
          "absolute inset-1 rounded-full border opacity-40",
          `border-${color.split("-")[0]}-300`,
          "animate-wave-reverse"
        )}
      />

      {/* Glow effect */}
      <div
        className={cn(
          "absolute -inset-2 rounded-full opacity-30 blur-md",
          "bg-gradient-to-r animate-pulse",
          colorClasses[color]
        )}
      />
    </div>
  );

  // Neural Network Dots
  const NeuralDots = () => (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="relative">
          <div
            className={cn(
              "rounded-full bg-gradient-to-br animate-pulse",
              colorClasses[color],
              size === "sm" && "h-2 w-2",
              size === "default" && "h-3 w-3",
              size === "lg" && "h-4 w-4",
              size === "xl" && "h-5 w-5"
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
          {/* Connecting lines */}
          {i < 4 && (
            <div
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 bg-gradient-to-r",
                colorClasses[color],
                size === "sm" && "h-0.5 w-3 -right-2",
                size === "default" && "h-0.5 w-4 -right-2.5",
                size === "lg" && "h-1 w-6 -right-3",
                size === "xl" && "h-1 w-8 -right-4"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Liquid Bubble Animation
  const LiquidBubbles = () => (
    <div className={cn("flex space-x-2", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full bg-gradient-to-br animate-bounce",
            colorClasses[color],
            size === "sm" && "h-2 w-2",
            size === "default" && "h-3 w-3",
            size === "lg" && "h-4 w-4",
            size === "xl" && "h-5 w-5"
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );

  const CyberLoader = ({ size = "default", className = "" }) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      default: "h-12 w-12",
      lg: "h-16 w-16",
    };

    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        {/* Simplified version without style jsx */}
        <div className="absolute inset-0 border-2 border-blue-500/30 rounded-lg" />
        <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-lg animate-spin" />
        <div className="absolute inset-1 border border-blue-400/20 rounded" />
      </div>
    );
  };

  const renderLoader = () => {
    switch (variant) {
      case "holographic-wave":
        return <HolographicWave />;
      case "neural-dots":
        return <NeuralDots />;
      case "liquid-bubbles":
        return <LiquidBubbles />;
      case "cyberpunk-scan":
        return <CyberLoader />;
      case "gradient-spinner":
      default:
        return <GradientSpinner />;
    }
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        fullScreen && "min-h-screen",
        overlay && "bg-gray-900/90 backdrop-blur-xl absolute inset-0 z-50"
      )}
    >
      {renderLoader()}
      {text && (
        <p
          className={cn(
            "text-white font-medium bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text",
            textSizes[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  return content;
};

export default Loading;
