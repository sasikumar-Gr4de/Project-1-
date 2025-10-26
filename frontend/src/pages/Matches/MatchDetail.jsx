// src/pages/Matches/MatchDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Video, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepProgress from "@/components/matches/StepProgress";
import Tabs from "@/components/common/Tabs";
import VideoPlayer from "@/components/matches/VideoPlayer";
import MatchOverviewStep from "@/pages/Matches/MatchOverviewStep";
import MatchAnalysisStep from "@/pages/Matches/MatchAnalysisStep";
import MatchReviewStep from "@/pages/Matches/MatchReviewStep";
import MatchCompleteStep from "@/pages/Matches/MatchCompleteStep";
import MatchPrepareStep from "@/pages/Matches/MatchPrepareStep";

import { useMatchesStore } from "@/store/matches.store";

const MatchDetail = () => {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const { getMatchById } = useMatchesStore();

  const steps = [
    { id: "prepare", label: "Prepare", description: "Data Setup" },
    { id: "analysis", label: "Analysis", description: "Performance Metrics" },
    { id: "review", label: "Review", description: "QA & Assessment" },
    { id: "complete", label: "Complete", description: "Final Report" },
  ];

  useEffect(() => {
    const fetchMatchData = async () => {
      console.log("MatchDetail: fetching match", id);
      try {
        const { data } = await getMatchById(id);
        console.log("MatchDetail: fetched", data);
        setMatchData(data);
      } catch (err) {
        console.error("MatchDetail: fetch error", err);
      }
    };

    fetchMatchData();
  }, [id, getMatchById]);

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      setActiveTab(stepIndex);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setActiveTab(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setActiveTab(currentStep - 1);
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "Match Overview",
      content: <MatchOverviewStep matchId={id} currentStep={currentStep} />,
    },
    {
      id: "prepare",
      label: "Preparation",
      content: (
        <MatchPrepareStep
          matchId={id}
          currentStep={currentStep}
          onStepComplete={handleNextStep}
        />
      ),
    },
    {
      id: "analysis",
      label: "Performance Analysis",
      content: <MatchAnalysisStep matchId={id} currentStep={currentStep} />,
    },
    {
      id: "review",
      label: "Review & QA",
      content: <MatchReviewStep matchId={id} currentStep={currentStep} />,
    },
    {
      id: "complete",
      label: "Completion",
      content: <MatchCompleteStep matchId={id} currentStep={currentStep} />,
    },
  ];

  // Guard render until match data is loaded to avoid runtime errors during initial render
  if (!matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Loading match...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Match Analysis</h1>
              {/* <p className="text-muted-foreground">ID: {id}</p> */}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Video className="h-4 w-4" />
              Watch Video
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <StepProgress
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            orientation="horizontal"
          />

          {/* Step Navigation */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>

            <Button
              onClick={handleNextStep}
              disabled={currentStep === steps.length - 1}
            >
              Next Step
            </Button>
          </div>
        </div>

        {/* Video Player Section (only when URL exists) */}
        {matchData?.video_url ? (
          <div className="mb-6">
            <VideoPlayer
              videoUrl={matchData.video_url}
              title="Match Highlights"
            />
          </div>
        ) : null}

        {/* Tabs Section */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Tabs
            tabs={tabs}
            defaultTab={activeTab}
            onTabChange={setActiveTab}
            variant="default"
            size="md"
            responsive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
