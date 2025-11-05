import { useState, useEffect } from "react";
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
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const Verification = () => {
  const { user } = useAuthStore();
  const { passport, getVerificationStatus } = usePassportStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        // Improved step logic
        const badgeStatus = status.verificationBadge?.status;

        if (!status.identity?.first_name || !status.identity?.headshot_url) {
          setCurrentStep(1);
        } else if (!hasRequiredDocuments(status.verifications)) {
          setCurrentStep(2);
        } else if (badgeStatus === "pending") {
          setCurrentStep(3);
        } else if (badgeStatus === "verified" || badgeStatus === "rejected") {
          setCurrentStep(4); // Final step for both success and failure
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
    if (!verifications) return false;
    const requiredDocs = ["passport", "club_letter"];
    const uploadedDocs = verifications.filter((v) =>
      requiredDocs.includes(v.document_type)
    );
    return uploadedDocs.length >= requiredDocs.length;
  };

  const handleStepComplete = () => {
    loadVerificationStatus();
  };

  const handleRestartVerification = () => {
    setCurrentStep(1);
    loadVerificationStatus();
  };

  const getFinalStepStatus = () => {
    if (!verificationStatus) return "pending";

    const badge = verificationStatus.verificationBadge;
    if (badge?.status === "verified") return "completed";
    if (badge?.status === "rejected") return "failed";
    return "pending";
  };

  const getFinalStepIcon = () => {
    const finalStatus = getFinalStepStatus();
    return finalStatus === "completed" ? CheckCircle : AlertCircle;
  };

  const getFinalStepTitle = () => {
    const finalStatus = getFinalStepStatus();
    return finalStatus === "completed"
      ? "Verification Complete"
      : "Verification Required";
  };

  const getFinalStepDescription = () => {
    const finalStatus = getFinalStepStatus();
    return finalStatus === "completed"
      ? "Your player identity has been successfully verified"
      : "There was an issue with your verification. Please review and try again.";
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
      title: getFinalStepTitle(),
      description: "Your verification result",
      status: getFinalStepStatus(),
      content: (
        <VerificationStep
          title={getFinalStepTitle()}
          description={getFinalStepDescription()}
          status={getFinalStepStatus()}
          stepNumber={4}
          isCurrent={currentStep === 4}
          icon={getFinalStepIcon()}
        >
          <CardContent>
            {getFinalStepStatus() === "completed" ? (
              // Verification Complete
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
            ) : (
              // Verification Failed/Required
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Verification Required
                  </h3>
                  <p className="text-[#B0AFAF] max-w-md mx-auto">
                    {getFinalStepStatus() === "failed"
                      ? "We encountered issues with your verification documents. Please review the requirements and try again."
                      : "Please complete the verification process to access all platform features."}
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#343434] rounded-xl p-4 max-w-md mx-auto text-left">
                  <h4 className="font-semibold text-white mb-3">
                    {getFinalStepStatus() === "failed"
                      ? "Common Issues:"
                      : "Next Steps:"}
                  </h4>
                  <ul className="space-y-2 text-sm text-[#B0AFAF]">
                    {getFinalStepStatus() === "failed" ? (
                      <>
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
                          <span>
                            Document doesn't match identity information
                          </span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          <span>Complete identity information</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          <span>Upload required documents</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          <span>Wait for admin approval</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <Button
                  onClick={handleRestartVerification}
                  className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {getFinalStepStatus() === "failed"
                    ? "Restart Verification"
                    : "Start Verification"}
                </Button>
              </div>
            )}
          </CardContent>
        </VerificationStep>
      ),
    },
  ];

  const getOverallStatus = () => {
    if (isLoading)
      return { status: "loading", label: "Loading...", color: "gray" };
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

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header with Loading */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
              Player Verification
            </h1>
            <p className="text-[#B0AFAF] text-lg mt-2 font-['Orbitron']">
              Complete your player identity verification
            </p>
          </div>
          <Badge className="bg-[#343434] text-[#B0AFAF] border-[#343434]">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Loading...
          </Badge>
        </div>

        {/* Loading Skeleton for Steps */}
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
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-3 text-[#B0AFAF]">
                Loading verification status...
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    </div>
  );
};

export default Verification;
