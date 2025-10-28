// In MatchDetail.jsx - Update the component
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
import { useClubsStore } from "@/store/clubs.store";
import { usePlayersStore } from "@/store/players.store";
import { useAuthStore } from "@/store/auth.store";

const MatchDetail = () => {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [homeClub, setHomeClub] = useState(null);
  const [awayClub, setAwayClub] = useState(null);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);

  const { getMatchById, updateMatch } = useMatchesStore();
  const { getClubById } = useClubsStore();
  const { getPlayersByClubId } = usePlayersStore();
  const { user } = useAuthStore();

  const isAdmin = user?.role === "admin";

  // Define steps with their corresponding qa_status values
  const steps = [
    {
      id: "prepare",
      label: "Prepare",
      description: "Data Setup",
      qa_status: 0,
    },
    {
      id: "analysis",
      label: "Analysis",
      description: "Video Annotation",
      qa_status: 1,
    },
    {
      id: "review",
      label: "Review",
      description: "QA & Assessment",
      qa_status: 2,
    },
    {
      id: "complete",
      label: "Complete",
      description: "Final Report",
      qa_status: 3,
    },
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        console.log("Fetching match data for ID:", id);

        const { data: matchData } = await getMatchById(id);
        console.log("Match data:", matchData);

        if (!matchData) {
          throw new Error("Match not found");
        }

        setMatchData(matchData);

        // Set current step based on qa_status
        const qaStatus = matchData.qa_status || 0;
        setCurrentStep(qaStatus);
        setActiveTab(qaStatus + 1); // +1 because Overview is tab 0

        // Fetch all related data in parallel
        const [homeClubData, awayClubData, homePlayersData, awayPlayersData] =
          await Promise.all([
            getClubById(matchData.home_club_id),
            getClubById(matchData.away_club_id),
            getPlayersByClubId(matchData.home_club_id),
            getPlayersByClubId(matchData.away_club_id),
          ]);

        setHomeClub(homeClubData?.data || null);
        setAwayClub(awayClubData?.data || null);
        setHomePlayers(homePlayersData?.data || []);
        setAwayPlayers(awayPlayersData?.data || []);
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllData();
    }
  }, [id, getMatchById, getClubById, getPlayersByClubId]);

  // Update QA status in backend
  const updateQaStatus = async (newQaStatus) => {
    try {
      const result = await updateMatch(id, { qa_status: newQaStatus });
      if (result.success) {
        setMatchData((prev) => ({ ...prev, qa_status: newQaStatus }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating QA status:", error);
      return false;
    }
  };

  const handleStepClick = (stepIndex) => {
    // Only allow navigating to completed steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      setActiveTab(stepIndex + 1);
    }
  };

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      const nextQaStatus = steps[nextStep].qa_status;

      // Update QA status in backend
      const success = await updateQaStatus(nextQaStatus);

      if (success) {
        setCurrentStep(nextStep);
        setActiveTab(nextStep + 1);
      }
    }
  };

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);

    // If switching to Overview tab (index 0), don't change currentStep
    if (tabIndex === 0) {
      return;
    }

    // For step tabs, only allow switching to completed steps
    // const stepIndex = tabIndex - 1;
    // if (stepIndex <= currentStep) {
    //   setCurrentStep(stepIndex);
    // } else {
    //   // If trying to switch to an incomplete step, revert to current step's tab
    //   setActiveTab(currentStep + 1);
    // }
  };

  const handleStepComplete = async (stepData = {}) => {
    // Update match data if needed from child components
    if (stepData.updatedMatch) {
      setMatchData((prev) => ({ ...prev, ...stepData.updatedMatch }));
    }

    // For non-admin users, they complete their work but don't progress the step
    if (!isAdmin) {
      return;
    }

    // Only admin can progress to next step
    await handleNextStep();
  };

  // Enhanced tabs with proper data passing
  const tabs = [
    {
      id: "overview",
      label: "Match Overview",
      content: (
        <MatchOverviewStep
          matchData={matchData}
          homeClub={homeClub}
          awayClub={awayClub}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          currentStep={currentStep}
        />
      ),
    },
    {
      id: "prepare",
      label: "Preparation",
      content: (
        <MatchPrepareStep
          matchData={matchData}
          homeClub={homeClub}
          awayClub={awayClub}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
          onDataUpdate={setMatchData}
          isAdmin={isAdmin}
        />
      ),
    },
    {
      id: "analysis",
      label: "Video Analysis",
      content: (
        <MatchAnalysisStep
          matchData={matchData}
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
          isAdmin={isAdmin}
        />
      ),
    },
    {
      id: "review",
      label: "Quality Review",
      content: (
        <MatchReviewStep
          matchData={matchData}
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
          isAdmin={isAdmin}
        />
      ),
    },
    {
      id: "complete",
      label: "Completion",
      content: (
        <MatchCompleteStep
          matchData={matchData}
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
          isAdmin={isAdmin}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">
            Loading match data...
          </div>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-lg text-destructive">Match not found</div>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </div>
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
              <p className="text-muted-foreground">
                {homeClub?.club_name} vs {awayClub?.club_name}
                <span className="ml-2 px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                  Step {currentStep + 1}/4
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {matchData?.video_url && (
              <Button variant="outline" size="sm" className="gap-2">
                <Video className="h-4 w-4" />
                Watch Video
              </Button>
            )}
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
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length} •{" "}
              {steps[currentStep]?.label}
              {isAdmin && " • You can progress steps"}
            </div>

            {isAdmin && currentStep < steps.length - 1 && (
              <Button onClick={handleNextStep} size="sm">
                Next Step: {steps[currentStep + 1]?.label}
              </Button>
            )}
          </div>
        </div>

        {matchData.video_url && (
          <div className="mb-6">
            <VideoPlayer
              videoUrl={matchData.video_url}
              title={`${homeClub?.club_name} vs ${awayClub?.club_name}`}
            />
          </div>
        )}

        {/* Tabs Section */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Tabs
            tabs={tabs}
            defaultTab={activeTab}
            onTabChange={handleTabChange}
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
