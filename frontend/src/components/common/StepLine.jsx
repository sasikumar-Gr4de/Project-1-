import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const StepLine = ({
  steps,
  currentStep,
  className,
  orientation = "horizontal",
}) => {
  const isHorizontal = orientation === "horizontal";

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  const getStepIcon = (status, step) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "current":
        return (
          <div className="w-5 h-5 bg-primary rounded-full animate-pulse" />
        );
      case "pending":
        return step.optional ? (
          <Clock className="w-5 h-5 text-[#B0AFAF]" />
        ) : (
          <div className="w-5 h-5 border-2 border-[#343434] rounded-full" />
        );
      default:
        return (
          <div className="w-5 h-5 border-2 border-[#343434] rounded-full" />
        );
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 border-green-400";
      case "current":
        return "text-primary border-primary";
      default:
        return "text-[#B0AFAF] border-[#343434]";
    }
  };

  if (isHorizontal) {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    getStepColor(status)
                  )}
                >
                  {getStepIcon(status, step)}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      status === "completed"
                        ? "text-green-400"
                        : status === "current"
                        ? "text-primary"
                        : "text-[#B0AFAF]"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-[#B0AFAF] mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 transition-colors duration-300",
                    status === "completed" ? "bg-green-400" : "bg-[#343434]"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className={cn("space-y-6", className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex">
            {/* Step line and icon */}
            <div className="flex flex-col items-center mr-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  getStepColor(status)
                )}
              >
                {getStepIcon(status, step)}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 w-0.5 mt-2 transition-colors duration-300",
                    status === "completed" ? "bg-green-400" : "bg-[#343434]"
                  )}
                />
              )}
            </div>

            {/* Step content */}
            <div className="flex-1 pb-6">
              <div className="space-y-1">
                <h3
                  className={cn(
                    "text-lg font-semibold transition-colors duration-300",
                    status === "completed"
                      ? "text-green-400"
                      : status === "current"
                      ? "text-primary"
                      : "text-[#B0AFAF]"
                  )}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[#B0AFAF]">{step.description}</p>
                {step.optional && (
                  <Badge
                    variant="outline"
                    className="bg-[#343434] text-[#B0AFAF] border-[#343434] text-xs"
                  >
                    Optional
                  </Badge>
                )}
              </div>

              {/* Step content */}
              {status === "current" && step.content && (
                <div className="mt-4">{step.content}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepLine;
