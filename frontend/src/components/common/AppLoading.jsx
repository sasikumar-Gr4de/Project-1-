// components/common/AppLoading.jsx
import { useEffect, useState } from "react";

const AppLoading = ({
  message = "Loading GR4DE Platform...",
  size = "lg",
  showLogo = true,
  variant = "default",
}) => {
  const [currentDot, setCurrentDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDot((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizes = {
    sm: {
      spinner: "h-8 w-8",
      text: "text-sm",
      logo: "h-6",
    },
    md: {
      spinner: "h-12 w-12",
      text: "text-base",
      logo: "h-8",
    },
    lg: {
      spinner: "h-16 w-16",
      text: "text-lg",
      logo: "h-12",
    },
  };

  const variants = {
    default: {
      background: "bg-background",
      text: "text-muted-foreground",
      spinner: "border-primary",
      gradient: "from-primary to-[#94D44A]",
    },
    dark: {
      background: "bg-[#0F0F0E]",
      text: "text-[#B0AFAF]",
      spinner: "border-primary",
      gradient: "from-primary to-[#94D44A]",
    },
    minimal: {
      background: "bg-transparent",
      text: "text-foreground",
      spinner: "border-current",
      gradient: "from-current to-current",
    },
  };

  const { spinner, text, background, gradient } = variants[variant];
  const { spinner: spinnerSize, text: textSize, logo: logoSize } = sizes[size];

  const renderDots = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className={`w-1 h-1 rounded-full bg-linear-to-r ${gradient} transition-all duration-300 ${
          index === currentDot
            ? "opacity-100 scale-125"
            : "opacity-40 scale-100"
        }`}
      />
    ));
  };

  return (
    <div
      className={`min-h-screen ${background} flex items-center justify-center p-4`}
    >
      <div className="text-center space-y-6 max-w-sm mx-auto">
        {/* Logo Section */}
        {showLogo && (
          <div className="flex justify-center mb-4">
            <div className={`relative ${logoSize}`}>
              {/* GR4DE Logo Placeholder - Replace with your actual logo */}
              <div className="flex items-center justify-center space-x-2">
                <img
                  src="https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/serverfavicon-flat.png-1761828572874-cz3vcaezhrb"
                  alt="GR4DE Logo"
                  className="w-24 h-14 object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Animated Spinner */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer spinning ring */}
            <div
              className={`${spinnerSize} ${spinner} border-2 border-t-transparent rounded-full animate-spin`}
            />

            {/* Inner pulsing circle */}
            {/* <div
              className={`absolute inset-0 ${spinnerSize} bg-linear-to-r ${gradient} rounded-full animate-pulse opacity-20`}
            /> */}

            {/* Center dot */}
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-linear-to-r ${gradient} rounded-full`}
            />
          </div>
        </div>

        {/* Loading Text with Animated Dots */}
        <div className="space-y-3">
          <p className={`${textSize} ${text} font-medium`}>{message}</p>

          {/* Progress Bar */}
          <div className="w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-[#94D44A] rounded-full animate-pulse"
              style={{
                animation:
                  "pulse 2s ease-in-out infinite, progress 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-1">{renderDots()}</div>
        </div>

        {/* Optional: Loading Stats */}
        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50">
          <div>
            <div className="font-semibold">System</div>
            <div>Initializing</div>
          </div>
          <div>
            <div className="font-semibold">Modules</div>
            <div>Loading</div>
          </div>
          <div>
            <div className="font-semibold">Auth</div>
            <div>Verifying</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLoading;
