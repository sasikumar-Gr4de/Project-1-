// src/pages/Matches/MatchPrepareStep.jsx
import { useState } from "react";
import {
  Upload,
  Settings,
  CheckCircle,
  Clock,
  Video,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MatchPrepareStep = ({ matchId, currentStep, onStepComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preparationSteps, setPreparationSteps] = useState([
    {
      id: "video",
      label: "Video Upload",
      status: "pending",
      description: "Upload match footage",
    },
    {
      id: "lineups",
      label: "Lineup Configuration",
      status: "pending",
      description: "Set starting formations",
    },
    {
      id: "metadata",
      label: "Match Metadata",
      status: "pending",
      description: "Verify match details",
    },
    {
      id: "processing",
      label: "Data Processing",
      status: "pending",
      description: "Analyze video data",
    },
  ]);

  const handleFileUpload = () => {
    setIsProcessing(true);
    setPreparationSteps((steps) =>
      steps.map((step) =>
        step.id === "video" ? { ...step, status: "in-progress" } : step
      )
    );

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setPreparationSteps((steps) =>
          steps.map((step) =>
            step.id === "video" ? { ...step, status: "completed" } : step
          )
        );
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleStartAnalysis = () => {
    if (onStepComplete) {
      onStepComplete();
    }
  };

  const allStepsCompleted = preparationSteps.every(
    (step) => step.status === "completed"
  );

  return (
    <div className="space-y-8 p-3">
      {/* Preparation Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Match Preparation</h2>
            <p className="text-muted-foreground">
              Prepare all necessary data before starting the analysis
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {preparationSteps.filter((s) => s.status === "completed").length}/
              {preparationSteps.length}
            </div>
            <div className="text-sm text-muted-foreground">Steps Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                (preparationSteps.filter((s) => s.status === "completed")
                  .length /
                  preparationSteps.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Preparation Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Upload Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Video className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">Video Upload</h3>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Drag and drop your match video or click to browse
              </p>
              <Button
                onClick={handleFileUpload}
                disabled={isProcessing}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isProcessing ? "Uploading..." : "Select Video File"}
              </Button>

              {isProcessing && (
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {uploadProgress}% Complete
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>Supported formats:</strong> MP4, MOV, AVI
              <br />
              <strong>Max file size:</strong> 2GB
              <br />
              <strong>Recommended:</strong> 1080p or higher
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">Match Configuration</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">Formations</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Home: 4-3-3
                  <br />
                  Away: 4-2-3-1
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Venue</span>
                </div>
                <div className="text-sm text-muted-foreground">Camp Nou</div>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Match Details</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Date: March 15, 2024</div>
                <div>Competition: La Liga Juvenil U19</div>
                <div>Duration: 92 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Steps Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Preparation Status</h3>
        <div className="space-y-4">
          {preparationSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === "completed"
                      ? "bg-primary text-primary-foreground"
                      : step.status === "in-progress"
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : step.status === "in-progress" ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{step.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  step.status === "completed"
                    ? "bg-primary/20 text-primary"
                    : step.status === "in-progress"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.status === "completed"
                  ? "Completed"
                  : step.status === "in-progress"
                  ? "In Progress"
                  : "Pending"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {allStepsCompleted
            ? "Ready to start analysis"
            : "Complete all preparation steps to continue"}
        </div>

        <Button
          onClick={handleStartAnalysis}
          disabled={!allStepsCompleted}
          className="gap-2"
          size="lg"
        >
          <CheckCircle className="h-4 w-4" />
          Start Match Analysis
        </Button>
      </div>
    </div>
  );
};

export default MatchPrepareStep;
