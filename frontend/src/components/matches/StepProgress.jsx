import { useState, useEffect } from "react";
import {
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const StepProgress = ({
  steps = [],
  currentStep = 0,
  onStepChange,
  orientation = "horizontal", // 'horizontal' | 'vertical'
  showNavigation = true,
  showLabels = true,
  completedIcon = <Check className="h-4 w-4" />,
  errorIcon = <AlertCircle className="h-4 w-4" />,
  size = "md", // 'sm' | 'md' | 'lg'
}) => {
  const [internalStep, setInternalStep] = useState(currentStep);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update internal step when prop changes
  useEffect(() => {
    setInternalStep(currentStep);
  }, [currentStep]);

  // Auto-detect orientation on mobile
  const effectiveOrientation = isMobile ? "vertical" : orientation;

  const handleStepClick = (stepIndex) => {
    if (onStepChange && stepIndex <= internalStep) {
      onStepChange(stepIndex);
    }
  };

  const goToNextStep = () => {
    if (internalStep < steps.length - 1) {
      const newStep = internalStep + 1;
      setInternalStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const goToPrevStep = () => {
    if (internalStep > 0) {
      const newStep = internalStep - 1;
      setInternalStep(newStep);
      onStepChange?.(newStep);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      stepSize: "w-8 h-8",
      iconSize: "h-3 w-3",
      textSize: "text-sm",
      lineSize: "h-1",
      spacing: "gap-3",
    },
    md: {
      stepSize: "w-10 h-10",
      iconSize: "h-4 w-4",
      textSize: "text-base",
      lineSize: "h-1.5",
      spacing: "gap-4",
    },
    lg: {
      stepSize: "w-12 h-12",
      iconSize: "h-5 w-5",
      textSize: "text-lg",
      lineSize: "h-2",
      spacing: "gap-5",
    },
  };

  const config = sizeConfig[size];

  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
        <div className="text-center text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>No steps configured</p>
        </div>
      </div>
    );
  }

  const StepIcon = ({ step, index, isCompleted, isCurrent, hasError }) => {
    if (hasError) {
      return (
        <div
          className={`${config.stepSize} rounded-full bg-destructive flex items-center justify-center`}
        >
          {errorIcon}
        </div>
      );
    }

    if (isCompleted) {
      return (
        <div
          className={`${config.stepSize} rounded-full bg-primary flex items-center justify-center`}
        >
          {completedIcon}
        </div>
      );
    }

    if (isCurrent) {
      return (
        <div
          className={`${config.stepSize} rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center`}
        >
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      );
    }

    return (
      <div
        className={`${config.stepSize} rounded-full bg-muted border-2 border-muted-foreground/30 flex items-center justify-center`}
      >
        <span
          className={`${config.textSize} font-semibold text-muted-foreground`}
        >
          {index + 1}
        </span>
      </div>
    );
  };

  const StepConnector = ({ isCompleted, isLast }) => {
    if (isLast) return null;

    return (
      <div
        className={`flex-1 ${config.lineSize} ${
          isCompleted ? "bg-primary" : "bg-muted"
        } transition-colors duration-300`}
      />
    );
  };

  // Horizontal Layout
  if (effectiveOrientation === "horizontal") {
    return (
      <div className="w-full">
        {/* Steps */}
        <div className={`flex items-center ${config.spacing}`}>
          {steps.map((step, index) => {
            const isCompleted = index < internalStep;
            const isCurrent = index === internalStep;
            const hasError = step.error;
            const isClickable = onStepChange && index <= internalStep;

            return (
              <div key={step.id || index} className="flex items-center flex-1">
                {/* Step */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={`flex flex-col items-center transition-all ${
                      isClickable
                        ? "cursor-pointer hover:scale-105"
                        : "cursor-default"
                    }`}
                  >
                    <StepIcon
                      step={step}
                      index={index}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      hasError={hasError}
                    />

                    {showLabels && (
                      <div className="mt-2 text-center max-w-32">
                        <div
                          className={`font-medium ${config.textSize} ${
                            isCurrent
                              ? "text-primary"
                              : isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </div>
                        {step.description && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {step.description}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>

                {/* Connector */}
                <StepConnector
                  isCompleted={isCompleted}
                  isLast={index === steps.length - 1}
                />
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="flex justify-between items-center mt-8 p-4 bg-card/50 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground">
              Step {internalStep + 1} of {steps.length}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={goToPrevStep}
                disabled={internalStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={goToNextStep}
                disabled={internalStep === steps.length - 1}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Current Step Content */}
        {steps[internalStep]?.content && (
          <div className="mt-6 p-6 bg-card border border-border rounded-lg">
            {steps[internalStep].content}
          </div>
        )}
      </div>
    );
  }

  // Vertical Layout
  return (
    <div className="w-full">
      <div className="flex">
        {/* Steps */}
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const isCompleted = index < internalStep;
            const isCurrent = index === internalStep;
            const hasError = step.error;
            const isClickable = onStepChange && index <= internalStep;

            return (
              <div key={step.id || index} className="flex">
                {/* Step and Connector */}
                <div className="flex flex-col items-center mr-4">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={`flex items-center transition-all ${
                      isClickable
                        ? "cursor-pointer hover:scale-105"
                        : "cursor-default"
                    }`}
                  >
                    <StepIcon
                      step={step}
                      index={index}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      hasError={hasError}
                    />
                  </button>

                  {/* Vertical Connector */}
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 w-0.5 my-2 ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      } transition-colors duration-300`}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div
                  className={`flex-1 pb-6 ${
                    index === steps.length - 1 ? "" : "border-l border-border"
                  }`}
                >
                  <div
                    className={`ml-4 p-4 rounded-lg transition-all ${
                      isCurrent
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${config.textSize} ${
                            isCurrent
                              ? "text-primary"
                              : isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </h3>

                        {step.description && (
                          <p className="text-muted-foreground mt-1 text-sm">
                            {step.description}
                          </p>
                        )}

                        {step.status && (
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${
                              step.status === "completed"
                                ? "bg-primary/20 text-primary"
                                : step.status === "in-progress"
                                ? "bg-primary/10 text-primary"
                                : step.status === "pending"
                                ? "bg-muted text-muted-foreground"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {step.status === "in-progress" && (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {step.status === "completed" && (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            {step.status}
                          </div>
                        )}
                      </div>

                      {isCurrent && showNavigation && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPrevStep}
                            disabled={internalStep === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            onClick={goToNextStep}
                            disabled={internalStep === steps.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    {isCurrent && step.content && (
                      <div className="mt-4">{step.content}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && showNavigation && (
        <div className="flex justify-between items-center mt-6 p-4 bg-card/50 rounded-lg border border-border">
          <Button
            variant="outline"
            onClick={goToPrevStep}
            disabled={internalStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {internalStep + 1} / {steps.length}
          </div>

          <Button
            onClick={goToNextStep}
            disabled={internalStep === steps.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepProgress;
