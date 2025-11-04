import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePassportStore } from "@/store/passportStore";
import { useToast } from "@/contexts/ToastContext";
import StepLine from "@/components/common/StepLine";
import HeadshotUpload from "@/components/passport/HeadshotUpload";
import DocumentUploadStep from "@/components/passport/DocumentUploadStep";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const Verification = () => {
  const { user } = useAuthStore();
  const { passport, fetchPlayerPassport } = usePassportStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    if (user?.id) {
      fetchPlayerPassport(user.id);
    }
  }, [user?.id, fetchPlayerPassport]);

  useEffect(() => {
    // Determine completed steps based on passport data
    const newCompletedSteps = new Set();

    // Step 1 completed if headshot exists
    if (passport?.identity?.headshot_url) {
      newCompletedSteps.add(1);
    }

    // Step 2 completed if all required documents are uploaded
    const requiredDocs = ["passport", "club_letter"];
    const hasRequiredDocs = requiredDocs.every((docType) =>
      passport?.verifications?.some((v) => v.document_type === docType)
    );

    if (hasRequiredDocs) {
      newCompletedSteps.add(2);
    }

    // Step 3 completed if all documents are approved
    const allApproved =
      passport?.verifications?.every((v) => v.status === "approved") || false;
    if (allApproved && passport?.verifications?.length >= 2) {
      newCompletedSteps.add(3);
    }

    setCompletedSteps(newCompletedSteps);

    // Set current step to first incomplete step
    if (!newCompletedSteps.has(1)) {
      setCurrentStep(1);
    } else if (!newCompletedSteps.has(2)) {
      setCurrentStep(2);
    } else if (!newCompletedSteps.has(3)) {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }
  }, [passport]);

  const steps = [
    {
      id: 1,
      title: "Upload Headshot",
      description: "Add a clear profile photo",
      content: (
        <HeadshotUpload
          onComplete={() => handleStepComplete(1)}
          currentStep={currentStep}
        />
      ),
    },
    {
      id: 2,
      title: "Upload Documents",
      description: "Provide identity verification",
      content: (
        <DocumentUploadStep
          onComplete={() => handleStepComplete(2)}
          currentStep={currentStep}
        />
      ),
    },
    {
      id: 3,
      title: "Under Review",
      description: "Documents being verified",
      content: (
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-400" />
              Verification in Progress
            </CardTitle>
            <CardDescription className="text-[#B0AFAF]">
              Your documents are being reviewed by our team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4 py-8">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Under Review
                </h3>
                <p className="text-[#B0AFAF]">
                  Your verification documents are being reviewed. This usually
                  takes 1-2 business days.
                </p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4 max-w-md mx-auto">
                <h4 className="font-semibold text-white mb-3">What's Next?</h4>
                <ul className="space-y-2 text-sm text-[#B0AFAF] text-left">
                  <li className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span>Document verification in progress</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    <span>You'll be notified once completed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Full platform access after approval</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: 4,
      title: "Verified",
      description: "Account fully verified",
      content: (
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Verification Complete!
            </CardTitle>
            <CardDescription className="text-[#B0AFAF]">
              Your account has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Account Verified
                </h3>
                <p className="text-[#B0AFAF]">
                  Congratulations! Your player identity has been verified and
                  you now have full access to all platform features.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 max-w-md mx-auto">
                <div className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white text-sm">
                    Full Access
                  </h4>
                  <p className="text-xs text-[#B0AFAF]">
                    All platform features unlocked
                  </p>
                </div>
                <div className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-white text-sm">
                    Verified Badge
                  </h4>
                  <p className="text-xs text-[#B0AFAF]">
                    Trusted player status
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
              >
                <a href="/passport">
                  View Your Passport
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleStepComplete = (stepId) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));

    // Auto-advance to next step if not the last step
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const getOverallStatus = () => {
    if (completedSteps.has(4)) {
      return { status: "verified", label: "Fully Verified", color: "green" };
    } else if (completedSteps.has(3)) {
      return { status: "review", label: "Under Review", color: "yellow" };
    } else if (completedSteps.has(2)) {
      return {
        status: "submitted",
        label: "Documents Submitted",
        color: "blue",
      };
    } else if (completedSteps.has(1)) {
      return { status: "started", label: "In Progress", color: "yellow" };
    } else {
      return { status: "not_started", label: "Not Started", color: "gray" };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Player Verification
          </h1>
          <p className="text-[#B0AFAF] text-lg mt-2 font-['Orbitron']">
            Complete your player identity verification
          </p>
        </div>
        <Badge
          className={
            overallStatus.color === "green"
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : overallStatus.color === "yellow"
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : overallStatus.color === "blue"
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
              : "bg-[#343434] text-[#B0AFAF] border-[#343434]"
          }
        >
          <Shield className="w-3 h-3 mr-1" />
          {overallStatus.label}
        </Badge>
      </div>

      {/* Step Progress */}
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Verification Steps
          </CardTitle>
          <CardDescription className="text-[#B0AFAF]">
            Complete all steps to verify your player identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepLine
            steps={steps}
            currentStep={currentStep}
            orientation="horizontal"
            className="mb-8"
          />
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div>
        {steps.map((step) => (
          <div
            key={step.id}
            style={{ display: currentStep === step.id ? "block" : "none" }}
          >
            {step.content}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="bg-[#262626] border-[#343434] text-white hover:bg-[#343434]"
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentStep((prev) => Math.min(steps.length, prev + 1))
            }
            disabled={
              currentStep === steps.length || !completedSteps.has(currentStep)
            }
            className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Verification;
