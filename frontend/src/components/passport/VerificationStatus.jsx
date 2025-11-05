import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const VerificationStatus = ({
  status,
  currentStep,
  onRestart,
  loading = false,
}) => {
  const getStepInfo = (step) => {
    const steps = {
      1: {
        label: "Identity & Headshot",
        description: "Complete your profile information",
      },
      2: {
        label: "Document Upload",
        description: "Upload required verification documents",
      },
      3: {
        label: "Under Review",
        description: "Documents being verified by our team",
      },
      4: { label: "Complete", description: "Verification process completed" },
    };
    return steps[step] || steps[1];
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "verified":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          label: "Verified",
          description: "Your account has been successfully verified",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
          label: "Under Review",
          description: "Your documents are being reviewed by our team",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          label: "Rejected",
          description:
            "Some documents were rejected. Please restart verification.",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-[#B0AFAF]",
          bgColor: "bg-[#343434]",
          borderColor: "border-[#343434]",
          label: "Unverified",
          description: "Start the verification process to unlock all features",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-xl ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
            >
              <statusConfig.icon className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                {statusConfig.label}
              </h3>
              <p className="text-[#B0AFAF] mt-1">{statusConfig.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge
                  className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}
                >
                  Step {currentStep} of 4
                </Badge>
                <span className="text-sm text-[#B0AFAF]">
                  {getStepInfo(currentStep).label}
                </span>
              </div>
            </div>
          </div>

          {status === "rejected" && (
            <Button
              onClick={onRestart}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Restart Verification
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;
