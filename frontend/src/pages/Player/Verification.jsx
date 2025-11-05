import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePassportStore } from "@/store/passportStore";
import { useToast } from "@/contexts/ToastContext";
import StepLine from "@/components/common/StepLine";
import IdentityForm from "@/components/passport/IdentityForm";
import DocumentUploadStep from "@/components/passport/DocumentUploadStep";
import VerificationStep from "@/components/passport/VerificationStep";
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
  User,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";

const Verification = () => {
  const { user } = useAuthStore();
  const { passport, getVerificationStatus } = usePassportStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadVerificationStatus();
    }
  }, [user?.id]);

  const loadVerificationStatus = async () => {
    try {
      setIsLoading(true);
      const { data: status } = await getVerificationStatus(user.id);
      setVerificationStatus(status);
      console.log("Verification status:", status);

      // Determine current step based on verification progress
      if (status.currentStep) {
        setCurrentStep(status.currentStep);
      } else {
        // Fallback logic
        if (!status.identity?.first_name) {
          setCurrentStep(1);
        } else if (!status.identity?.headshot_url) {
          setCurrentStep(1);
        } else if (!hasRequiredDocuments(status.verifications)) {
          setCurrentStep(2);
        } else if (status.verificationBadge?.status === "pending") {
          setCurrentStep(3);
        } else if (status.verificationBadge?.status === "verified") {
          setCurrentStep(4);
        } else if (status.verificationBadge?.status === "rejected") {
          setCurrentStep(5);
        } else {
          setCurrentStep(1);
        }
      }
    } catch (error) {
      console.error("Failed to load verification status:", error);
      toast({
        title: "Error",
        description: "Failed to load verification status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasRequiredDocuments = (verifications) => {
    console.log(verifications);
    if (!verifications) return false;
    const requiredDocs = ["passport", "club_letter"];
    const uploadedDocs = verifications.filter((v) =>
      requiredDocs.includes(v.document_type)
    );
    console.log(uploadedDocs, requiredDocs);
    return uploadedDocs.length >= requiredDocs.length;
  };

  const handleStepComplete = () => {
    loadVerificationStatus();
  };

  const handleRestartVerification = () => {
    setCurrentStep(1);
    loadVerificationStatus();
  };

  const steps = [
    {
      id: 1,
      title: "Identity Verification",
      description: "Complete your personal information and upload headshot",
      status:
        currentStep === 1
          ? "current"
          : currentStep > 1
          ? "completed"
          : "pending",
      content: (
        <VerificationStep
          title="Identity Verification"
          description="Complete your personal information and upload a clear headshot"
          status={
            currentStep === 1
              ? "current"
              : currentStep > 1
              ? "completed"
              : "pending"
          }
          stepNumber={1}
          isCurrent={currentStep === 1}
        >
          <IdentityForm
            onComplete={handleStepComplete}
            currentStep={currentStep}
          />
        </VerificationStep>
      ),
    },
    {
      id: 2,
      title: "Document Upload",
      description: "Upload required verification documents",
      status:
        currentStep === 2
          ? "current"
          : currentStep > 2
          ? "completed"
          : "pending",
      content: (
        <VerificationStep
          title="Document Upload"
          description="Upload your passport and club registration documents"
          status={
            currentStep === 2
              ? "current"
              : currentStep > 2
              ? "completed"
              : "pending"
          }
          stepNumber={2}
          isCurrent={currentStep === 2}
        >
          <DocumentUploadStep
            onComplete={handleStepComplete}
            currentStep={currentStep}
          />
        </VerificationStep>
      ),
    },
    {
      id: 3,
      title: "Under Review",
      description: "Your documents are being verified",
      status:
        currentStep === 3
          ? "current"
          : currentStep > 3
          ? "completed"
          : "pending",
      content: (
        <VerificationStep
          title="Under Review"
          description="Your documents are being reviewed by our verification team"
          status={
            currentStep === 3
              ? "current"
              : currentStep > 3
              ? "completed"
              : "pending"
          }
          stepNumber={3}
          isCurrent={currentStep === 3}
        >
          <CardContent>
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Under Review
                </h3>
                <p className="text-[#B0AFAF] max-w-md mx-auto">
                  Your verification documents are being reviewed. This usually
                  takes 1-2 business days.
                </p>
              </div>

              {verificationStatus?.verificationProgress && (
                <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
                  <VerificationStep.Progress
                    progress={verificationStatus.verificationProgress.identity}
                    label="Identity"
                  />
                  <VerificationStep.Progress
                    progress={verificationStatus.verificationProgress.documents}
                    label="Documents"
                  />
                  <VerificationStep.Progress
                    progress={verificationStatus.verificationProgress.approval}
                    label="Approval"
                  />
                </div>
              )}

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
        </VerificationStep>
      ),
    },
    {
      id: 4,
      title: "Verification Complete",
      description: "Your account has been successfully verified",
      status:
        currentStep === 4
          ? "current"
          : currentStep > 4
          ? "completed"
          : "pending",
      content: (
        <VerificationStep
          title="Verification Complete"
          description="Your player identity has been successfully verified"
          status="completed"
          stepNumber={4}
          isCurrent={currentStep === 4}
        >
          <CardContent>
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Account Verified
                </h3>
                <p className="text-[#B0AFAF] max-w-md mx-auto">
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
                <Link to="/passport">
                  View Your Passport
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </VerificationStep>
      ),
    },
    {
      id: 5,
      title: "Verification Failed",
      description: "Your verification needs attention",
      status: currentStep === 5 ? "current" : "pending",
      content: (
        <VerificationStep
          title="Verification Failed"
          description="There was an issue with your verification. Please review and try again."
          status="failed"
          stepNumber={5}
          isCurrent={currentStep === 5}
        >
          <CardContent>
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Verification Failed
                </h3>
                <p className="text-[#B0AFAF] max-w-md mx-auto">
                  We encountered issues with your verification documents. Please
                  review the requirements and try again.
                </p>
              </div>

              <div className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4 max-w-md mx-auto text-left">
                <h4 className="font-semibold text-white mb-3">
                  Common Issues:
                </h4>
                <ul className="space-y-2 text-sm text-[#B0AFAF]">
                  <li className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Blurry or unclear document images</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Expired identification documents</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Missing required information</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Document doesn't match identity information</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleRestartVerification}
                className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Verification
              </Button>
            </div>
          </CardContent>
        </VerificationStep>
      ),
    },
  ];

  const getOverallStatus = () => {
    if (!verificationStatus)
      return { status: "loading", label: "Loading...", color: "gray" };

    const badge = verificationStatus.verificationBadge;
    if (badge?.status === "verified")
      return { status: "verified", label: "Fully Verified", color: "green" };
    if (badge?.status === "pending")
      return { status: "review", label: "Under Review", color: "yellow" };
    if (badge?.status === "rejected")
      return { status: "failed", label: "Verification Failed", color: "red" };
    if (verificationStatus.identity?.first_name)
      return { status: "documents", label: "Upload Documents", color: "blue" };
    return { status: "identity", label: "Complete Identity", color: "gray" };
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
          className={`
          ${
            overallStatus.color === "green"
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : overallStatus.color === "yellow"
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : overallStatus.color === "blue"
              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
              : overallStatus.color === "red"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "bg-[#343434] text-[#B0AFAF] border-[#343434]"
          }
        `}
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
            currentStep={currentStep - 1}
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
    </div>
  );
};

export default Verification;
