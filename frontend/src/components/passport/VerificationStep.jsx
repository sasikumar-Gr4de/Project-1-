import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  FileText,
  Shield,
} from "lucide-react";

const VerificationStep = ({
  title,
  description,
  status = "pending",
  children,
  icon: Icon = User,
  stepNumber,
  isCurrent = false,
}) => {
  const statusConfig = {
    completed: {
      color: "green",
      icon: CheckCircle,
      label: "Completed",
      bgColor: "bg-green-500/20",
      textColor: "text-green-400",
      borderColor: "border-green-500/30",
    },
    current: {
      color: "primary",
      icon: Clock,
      label: "In Progress",
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      borderColor: "border-primary/30",
    },
    pending: {
      color: "gray",
      icon: AlertCircle,
      label: "Pending",
      bgColor: "bg-[#343434]",
      textColor: "text-[#B0AFAF]",
      borderColor: "border-[#343434]",
    },
    failed: {
      color: "red",
      icon: AlertCircle,
      label: "Failed",
      bgColor: "bg-red-500/20",
      textColor: "text-red-400",
      borderColor: "border-red-500/30",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  // Default icons based on step number
  const getDefaultIcon = (step) => {
    switch (step) {
      case 1:
        return User;
      case 2:
        return FileText;
      case 3:
        return Shield;
      case 4:
        return CheckCircle;
      default:
        return User;
    }
  };

  const StepIcon = Icon === User ? getDefaultIcon(stepNumber) : Icon;

  return (
    <Card
      className={`bg-[#262626] border-[#343434] ${
        isCurrent ? "ring-2 ring-primary/20" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Step Number and Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor} ${config.borderColor} border-2`}
            >
              <StepIcon className={`w-6 h-6 ${config.textColor}`} />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-xl font-bold text-white">
                  {title}
                </CardTitle>
                {stepNumber && (
                  <Badge
                    variant="outline"
                    className="bg-[#1A1A1A] text-[#B0AFAF] border-[#343434]"
                  >
                    Step {stepNumber}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-[#B0AFAF] text-base">
                {description}
              </CardDescription>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            className={`
            ${config.bgColor} ${config.textColor} ${config.borderColor}
            border px-3 py-1 text-sm font-medium
          `}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      {/* Step Content */}
      {children && (
        <CardContent className="pt-4 border-t border-[#343434]">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

// Compound components for better organization
VerificationStep.Header = ({ children }) => (
  <div className="mb-4">{children}</div>
);

VerificationStep.Content = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

VerificationStep.Actions = ({ children }) => (
  <div className="flex justify-end space-x-3 pt-4 border-t border-[#343434]">
    {children}
  </div>
);

VerificationStep.Progress = ({ progress, label }) => (
  <div className="bg-[#1A1A1A] border border-[#343434] rounded-lg p-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-[#B0AFAF]">{label}</span>
      <span className="text-sm font-medium text-white">{progress}%</span>
    </div>
    <div className="w-full bg-[#343434] rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export default VerificationStep;
