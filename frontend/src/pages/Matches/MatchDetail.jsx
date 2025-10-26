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

const MatchDetail = () => {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [homeClub, setHomeClub] = useState(null);
  const [awayClub, setAwayClub] = useState(null);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(1); // Default to Preparation tab
  const [loading, setLoading] = useState(true);

  const { getMatchById } = useMatchesStore();
  const { getClubById } = useClubsStore();
  const { getPlayersByClubId } = usePlayersStore();

  const steps = [
    { id: "overview", label: "Overview", description: "Match Summary" },
    { id: "prepare", label: "Prepare", description: "Data Setup" },
    { id: "analysis", label: "Analysis", description: "Video Annotation" },
    { id: "review", label: "Review", description: "QA & Assessment" },
    { id: "complete", label: "Complete", description: "Final Report" },
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
        setHomePlayers(homePlayersData?.data?.players || []);
        setAwayPlayers(awayPlayersData?.data?.players || []);
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

  const handleStepComplete = (stepData = {}) => {
    // Update match data if needed from child components
    if (stepData.updatedMatch) {
      setMatchData((prev) => ({ ...prev, ...stepData.updatedMatch }));
    }
    handleNextStep();
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
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length} •{" "}
              {steps[currentStep]?.label}
            </div>

            <Button
              onClick={handleNextStep}
              disabled={currentStep === steps.length - 1}
            >
              Next Step
            </Button>
          </div>
        </div>

        {/* Video Player Section */}
        {matchData?.video_url && (
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
