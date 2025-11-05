// components/common/AppLoading.jsx
import { useEffect, useState } from "react";

const AppLoading = ({
  message = "Loading GR4DE Platform...",
  size = "lg",
  showLogo = true,
  variant = "default",
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const sizes = {
    sm: {
      logo: "h-16",
      text: "text-sm",
      container: "max-w-xs",
    },
    md: {
      logo: "h-24",
      text: "text-base",
      container: "max-w-sm",
    },
    lg: {
      logo: "h-32",
      text: "text-lg",
      container: "max-w-md",
    },
  };

  const variants = {
    default: {
      background: "bg-background",
      text: "text-muted-foreground",
      accent: "text-primary",
      gradient: "from-primary to-[#94D44A]",
    },
    dark: {
      background: "bg-[#0F0F0E]",
      text: "text-[#B0AFAF]",
      accent: "text-primary",
      gradient: "from-primary to-[#94D44A]",
    },
    minimal: {
      background: "bg-transparent",
      text: "text-foreground",
      accent: "text-current",
      gradient: "from-current to-current",
    },
  };

  const { background, text, accent, gradient } = variants[variant];
  const {
    logo: logoSize,
    text: textSize,
    container: containerSize,
  } = sizes[size];

  // Wave animation dots
  const renderWaveDots = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full bg-linear-to-r ${gradient} transition-all duration-500 ${
          index === currentStep % 5
            ? "opacity-100 scale-125"
            : "opacity-30 scale-100"
        }`}
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      />
    ));
  };

  // Progress steps
  const steps = ["System", "Modules", "Security", "Interface"];

  return (
    <div
      className={`min-h-screen ${background} flex items-center justify-center p-6`}
    >
      <div className={`text-center space-y-8 ${containerSize} mx-auto`}>
        {/* Large Logo Section */}
        {showLogo && (
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src="https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/serverfavicon-flat.png-1761828572874-cz3vcaezhrb"
                alt="GR4DE Logo"
                className={`${logoSize} object-contain drop-shadow-lg`}
              />
              {/* Subtle glow effect */}
              <div
                className="absolute inset-0 bg-linear-to-r from-primary/20 to-[#94D44A]/20 blur-xl rounded-full -z-10"
                style={{
                  transform: "scale(1.2)",
                }}
              />
            </div>
          </div>
        )}

        {/* Modern Loading Indicator */}
        <div className="space-y-6">
          {/* Animated Bars */}
          {/* <div className="flex justify-center space-x-1 h-8 items-end">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`w-3 bg-linear-to-t ${gradient} rounded-t-lg transition-all duration-300 ${
                  index === currentStep % 5
                    ? "h-6 opacity-100"
                    : index === (currentStep + 1) % 5
                    ? "h-5 opacity-80"
                    : index === (currentStep + 2) % 5
                    ? "h-4 opacity-60"
                    : "h-3 opacity-40"
                }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              />
            ))}
          </div> */}

          {/* Loading Text */}
          <div className="space-y-4">
            <p className={`${textSize} ${text} font-medium`}>{message}</p>

            {/* Progress Track */}
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-primary to-[#94D44A] rounded-full transition-all duration-1000"
                style={{
                  width: `${((currentStep % 4) + 1) * 25}%`,
                }}
              />
            </div>

            {/* Wave Dots */}
            <div className="flex justify-center space-x-2">
              {renderWaveDots()}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-4 gap-3 text-xs text-muted-foreground pt-6 border-t border-border/40">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`text-center transition-all duration-300 ${
                index <= currentStep % 4
                  ? `${accent} font-semibold scale-105`
                  : "opacity-50"
              }`}
            >
              <div className="font-medium mb-1">{step}</div>
              <div
                className={`w-1.5 h-1.5 rounded-full mx-auto transition-colors ${
                  index <= currentStep % 4
                    ? `bg-linear-to-r ${gradient}`
                    : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Loading Percentage */}
        <div className="text-xs text-muted-foreground font-mono">
          {(((currentStep % 4) + 1) * 25) % 100 || 25}% Complete
        </div>
      </div>
    </div>
  );
};

export default AppLoading;
