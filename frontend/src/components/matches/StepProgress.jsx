// src/components/common/StepProgress.jsx
import { Check, Lock } from "lucide-react";

const StepProgress = ({
  steps = [],
  currentStep = 0,
  onStepClick,
  orientation = "horizontal",
}) => {
  return (
    <div
      className={`flex ${
        orientation === "vertical" ? "flex-col space-y-4" : "space-x-4"
      } mb-8`}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div
            key={step.id}
            className={`flex items-center ${
              orientation === "vertical" ? "flex-row" : "flex-1"
            }`}
          >
            {/* Step Circle */}
            <div
              onClick={() => onStepClick && onStepClick(index)}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                isCompleted
                  ? "bg-primary border-primary text-primary-foreground"
                  : isCurrent
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-muted border-muted-foreground/30 text-muted-foreground"
              } ${onStepClick ? "hover:scale-110" : ""}`}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : isCurrent ? (
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              ) : isUpcoming ? (
                <Lock className="h-4 w-4" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>

            {/* Step Label */}
            <div
              className={`ml-3 ${orientation === "vertical" ? "flex-1" : ""}`}
            >
              <div
                className={`text-sm font-medium ${
                  isCompleted || isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {step.description}
              </div>
            </div>

            {/* Connector (for horizontal) */}
            {orientation === "horizontal" && index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
