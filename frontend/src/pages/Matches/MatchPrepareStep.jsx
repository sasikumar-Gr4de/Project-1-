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
  Edit,
  Save,
  Play,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoUpload from "@/components/common/VideoUpload";
import MatchInfoForm from "@/components/matches/MatchInfoForm";
import PlayerTimeSelection from "@/components/matches/PlayerTimeSelection";

const MatchPrepareStep = ({
  matchData,
  homeClub,
  awayClub,
  homePlayers,
  awayPlayers,
  currentStep,
  onStepComplete,
  onDataUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [matchInfoCompleted, setMatchInfoCompleted] = useState(false);
  const [preparationSteps, setPreparationSteps] = useState([
    {
      id: "video",
      label: "Video Upload",
      status: matchData?.video_url ? "completed" : "pending",
      description: "Upload match footage",
    },
    {
      id: "lineups",
      label: "Lineup Configuration",
      status: "pending",
      description: "Set player playing time intervals",
    },
    {
      id: "metadata",
      label: "Match Information",
      status:
        matchData?.venue && matchData?.competition ? "completed" : "pending",
      description: "Verify and confirm match details",
    },
  ]);

  const handleVideoUpload = (results) => {
    const result = results[0];
    console.log("Video uploaded:", result);

    // Update preparation steps
    setPreparationSteps((prev) =>
      prev.map((step) =>
        step.id === "video" ? { ...step, status: "completed" } : step
      )
    );

    // Update match data with video URL
    if (onDataUpdate && result.url) {
      onDataUpdate((prev) => ({ ...prev, video_url: result.url }));
    }
  };

  const handleMatchInfoUpdate = (updatedInfo) => {
    if (onDataUpdate) {
      onDataUpdate((prev) => ({ ...prev, ...updatedInfo }));
    }
    setIsEditing(false);
    setMatchInfoCompleted(true);

    // Update preparation steps
    setPreparationSteps((prev) =>
      prev.map((step) =>
        step.id === "metadata" ? { ...step, status: "completed" } : step
      )
    );
  };

  const handlePlayerTimeUpdate = (playerTimes) => {
    console.log("Player times updated:", playerTimes);

    // Update preparation steps
    const allPlayersHaveTimes = [...homePlayers, ...awayPlayers].every(
      (player) => playerTimes[player.player_id]?.start !== undefined
    );

    setPreparationSteps((prev) =>
      prev.map((step) =>
        step.id === "lineups" && allPlayersHaveTimes
          ? { ...step, status: "completed" }
          : step
      )
    );

    // Update match data with player times
    if (onDataUpdate) {
      onDataUpdate((prev) => ({
        ...prev,
        player_playing_times: playerTimes,
      }));
    }
  };

  const handleStartAnalysis = () => {
    if (onStepComplete) {
      onStepComplete({
        updatedMatch: matchData,
        message: "Preparation completed successfully",
      });
    }
  };

  const allStepsCompleted = preparationSteps.every(
    (step) => step.status === "completed"
  );

  if (!matchData || !homeClub || !awayClub) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground">Loading preparation data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-3">
      {/* Preparation Header */}
      <div className="bg-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Match Preparation</h2>
            <p className="text-muted-foreground">
              Upload video, set player playing times, and confirm match
              information
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
        <div className="w-full bg-muted rounded-full h-2 mb-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Upload Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Video className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Video Upload</h3>
            </div>
            {matchData.video_url && (
              <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                Uploaded
              </div>
            )}
          </div>

          <div className="space-y-4">
            {!matchData.video_url ? (
              <VideoUpload
                maxSize={2 * 1024 * 1024 * 1024}
                onUpload={handleVideoUpload}
                accept="video/mp4,video/mov,video/avi"
              />
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="font-medium text-primary mb-1">Video Uploaded</p>
                <p className="text-sm text-muted-foreground">
                  Match video is ready for analysis
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    // Reset video URL to allow re-upload
                    if (onDataUpdate) {
                      onDataUpdate((prev) => ({ ...prev, video_url: null }));
                    }
                    setPreparationSteps((prev) =>
                      prev.map((step) =>
                        step.id === "video"
                          ? { ...step, status: "pending" }
                          : step
                      )
                    );
                  }}
                >
                  Replace Video
                </Button>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <strong>Supported formats:</strong> MP4, MOV, AVI
              <br />
              <strong>Max file size:</strong> 2GB
              <br />
              <strong>Recommended:</strong> 1080p or higher
            </div>
          </div>
        </div>

        {/* Match Information Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Match Information</h3>
            </div>
            <div className="flex items-center gap-2">
              {matchInfoCompleted && (
                <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                  Confirmed
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="gap-2"
              >
                {isEditing ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>

          <MatchInfoForm
            matchData={matchData}
            homeClub={homeClub}
            awayClub={awayClub}
            isEditing={isEditing}
            onSave={handleMatchInfoUpdate}
          />
        </div>
      </div>

      {/* Player Time Selection */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">
              Player Lineup & Playing Time
            </h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Set exact playing time intervals for each player
          </div>
        </div>

        <PlayerTimeSelection
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          matchDuration={matchData.duration_minutes || 90}
          existingTimes={matchData.player_playing_times || {}}
          onUpdate={handlePlayerTimeUpdate}
        />
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
            ? "All preparation steps completed. Ready for video analysis."
            : "Complete all preparation steps to continue"}
        </div>

        <Button
          onClick={handleStartAnalysis}
          disabled={!allStepsCompleted}
          className="gap-2"
          size="lg"
        >
          <CheckCircle className="h-4 w-4" />
          Start Video Analysis
        </Button>
      </div>
    </div>
  );
};

export default MatchPrepareStep;
