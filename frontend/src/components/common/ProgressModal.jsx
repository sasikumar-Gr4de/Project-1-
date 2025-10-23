import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProgressModal = ({
  isOpen,
  title = "Processing",
  progress = 0,
  currentStep = "",
  steps = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <div className="space-y-2">
            <p className="text-sm font-medium">{currentStep}</p>
            <div className="text-xs text-muted-foreground space-y-1">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index < steps.indexOf(currentStep)
                      ? "text-primary"
                      : index === steps.indexOf(currentStep)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="w-4 h-4 mr-2">
                    {index < steps.indexOf(currentStep) ? "✓" : "○"}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressModal;
