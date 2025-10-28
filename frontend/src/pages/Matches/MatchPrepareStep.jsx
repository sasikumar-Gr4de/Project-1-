import { useState, useEffect } from "react";
import {
  Settings,
  CheckCircle,
  Clock,
  Video,
  Users,
  Loader2,
  Edit,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoUpload from "@/components/common/VideoUpload";
import MatchInfoForm from "@/components/matches/MatchInfoForm";
import PlayerTimeSelection from "@/components/matches/PlayerTimeSelection";
import { useMatchesStore } from "@/store/matches.store";
import { useMatchInfoStore } from "@/store/match-info.store";
import { useToast } from "@/contexts/ToastContext";

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
  const [savingMatchInfo, setSavingMatchInfo] = useState(false);
  const [savingLineup, setSavingLineup] = useState(false);
  const [loadingLineup, setLoadingLineup] = useState(true);
  const [lineupData, setLineupData] = useState({});

  const { updateMatch } = useMatchesStore();
  const {
    createBulkMatchInfo,
    getMatchInfoByMatch,
    createMatchInfo,
    updateMatchInfo,
    deleteMatchInfo,
  } = useMatchInfoStore();
  const { toast } = useToast();

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

  // Load existing match info on component mount
  useEffect(() => {
    const loadExistingMatchInfo = async () => {
      if (matchData?.match_id) {
        try {
          setLoadingLineup(true);
          const result = await getMatchInfoByMatch(matchData.match_id);

          if (result.success && result.data) {
            // Convert existing match info to lineup data format
            const loadedLineupData = {};
            result.data.forEach((info) => {
              loadedLineupData[info.player_id] = {
                start_time: info.start_time || 0,
                end_time: info.end_time || matchData.duration_minutes || 90,
                position: info.position || "",
                player_name: info.players?.full_name || "",
                jersey_number: info.players?.jersey_number || "",
                match_info_id: info.match_info_id,
              };
            });

            setLineupData(loadedLineupData);

            // Update local match data with loaded lineup
            if (onDataUpdate) {
              onDataUpdate((prev) => ({
                ...prev,
                player_playing_times: loadedLineupData,
              }));
            }

            // If we have existing match info, mark lineup as completed
            if (result.data.length > 0) {
              setPreparationSteps((prev) =>
                prev.map((step) =>
                  step.id === "lineups"
                    ? { ...step, status: "completed" }
                    : step
                )
              );
            }
          }
        } catch (error) {
          console.error("Error loading existing match info:", error);
          toast({
            title: "Error",
            description: "Failed to load player lineup data",
            variant: "destructive",
          });
        } finally {
          setLoadingLineup(false);
        }
      }
    };

    loadExistingMatchInfo();
  }, [
    matchData?.match_id,
    getMatchInfoByMatch,
    matchData.duration_minutes,
    onDataUpdate,
    toast,
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

  const handleMatchInfoUpdate = async (updatedInfo) => {
    setSavingMatchInfo(true);

    try {
      // Update match data in backend
      const result = await updateMatch(matchData.match_id, updatedInfo);

      if (result.success) {
        // Update local state
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
        toast({
          title: "Success",
          description: "Match information updated successfully",
          variant: "success",
        });
      } else {
        throw new Error(result.error || "Failed to update match information");
      }
    } catch (error) {
      console.error("Error updating match information:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update match information",
        variant: "destructive",
      });
    } finally {
      setSavingMatchInfo(false);
    }
  };

  // Handle adding a new player to lineup with real-time backend save
  const handleAddPlayer = async (playerId, playerData) => {
    try {
      const matchInfoData = {
        match_id: matchData.match_id,
        club_id: homePlayers.find((p) => p.player_id === playerId)
          ? matchData.home_club_id
          : matchData.away_club_id,
        player_id: playerId,
        position: playerData.position || "",
        start_time: playerData.start_time || 0,
        end_time: playerData.end_time || matchData.duration_minutes || 90,
      };

      const result = await createMatchInfo(matchInfoData);

      if (result.success) {
        // Update local state with the new player including match_info_id
        setLineupData((prev) => ({
          ...prev,
          [playerId]: {
            ...playerData,
            match_info_id: result.data.match_info_id,
          },
        }));

        // toast({
        //   title: "Success",
        //   description: "Player added to lineup",
        //   variant: "success",
        // });
        return true;
      } else {
        throw new Error(result.error || "Failed to add player");
      }
    } catch (error) {
      console.error("Error adding player:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add player",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle updating player data with real-time backend save
  const handleUpdatePlayer = async (playerId, updates) => {
    try {
      // Find the match_info_id for this player
      const playerMatchInfoId = lineupData[playerId]?.match_info_id;

      if (!playerMatchInfoId) {
        throw new Error("Player not found in lineup");
      }

      const result = await updateMatchInfo(playerMatchInfoId, updates);

      if (result.success) {
        // Update local state immediately - NO RELOADING
        setLineupData((prev) => ({
          ...prev,
          [playerId]: {
            ...prev[playerId],
            ...updates,
          },
        }));

        // toast({
        //   title: "Success",
        //   description: "Player updated successfully",
        //   variant: "success",
        // });
        return true;
      } else {
        throw new Error(result.error || "Failed to update player");
      }
    } catch (error) {
      console.error("Error updating player:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update player",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle deleting player with real-time backend save
  const handleDeletePlayer = async (playerId) => {
    try {
      // Find the match_info_id for this player
      const playerMatchInfoId = lineupData[playerId]?.match_info_id;

      if (!playerMatchInfoId) {
        throw new Error("Player not found in lineup");
      }

      const result = await deleteMatchInfo(playerMatchInfoId);

      if (result.success) {
        // Update local state immediately - NO RELOADING
        setLineupData((prev) => {
          const newLineup = { ...prev };
          delete newLineup[playerId];
          return newLineup;
        });

        // toast({
        //   title: "Success",
        //   description: "Player removed from lineup",
        //   variant: "success",
        // });
        return true;
      } else {
        throw new Error(result.error || "Failed to remove player");
      }
    } catch (error) {
      console.error("Error removing player:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove player",
        variant: "destructive",
      });
      return false;
    }
  };

  // Save entire lineup to backend (for bulk operations or final save)
  const handleSaveLineupToBackend = async () => {
    setSavingLineup(true);

    try {
      // Transform lineup data to match_info table format
      const matchInfoData = Object.entries(lineupData).map(
        ([playerId, data]) => ({
          match_id: matchData.match_id,
          club_id: homePlayers.find((p) => p.player_id === playerId)
            ? matchData.home_club_id
            : matchData.away_club_id,
          player_id: playerId,
          position: data.position || "",
          start_time: data.start_time || 0,
          end_time: data.end_time || matchData.duration_minutes || 90,
        })
      );

      // Save to backend using bulk create
      const result = await createBulkMatchInfo(
        matchData.match_id,
        matchInfoData
      );

      if (result.success) {
        console.log("Lineup saved successfully to backend");
        // toast({
        //   title: "Success",
        //   description: "Player lineup saved successfully",
        //   variant: "success",
        // });
        return true;
      } else {
        throw new Error(result.error || "Failed to save player lineup");
      }
    } catch (error) {
      console.error("Error saving player lineup:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save player lineup",
        variant: "destructive",
      });
      return false;
    } finally {
      setSavingLineup(false);
    }
  };

  const handleStartAnalysis = async () => {
    // Final save to ensure all data is persisted
    if (Object.keys(lineupData).length > 0) {
      const saved = await handleSaveLineupToBackend();
      if (!saved) {
        return; // Don't proceed if save failed
      }
    }

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
                disabled={savingMatchInfo}
                className="gap-2"
              >
                {savingMatchInfo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                {savingMatchInfo ? "Saving..." : isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>

          <MatchInfoForm
            matchData={matchData}
            homeClub={homeClub}
            awayClub={awayClub}
            isEditing={isEditing}
            onSave={handleMatchInfoUpdate}
            saving={savingMatchInfo}
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
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Set exact playing time intervals for each player
            </div>
            {loadingLineup && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading lineup...
              </div>
            )}
          </div>
        </div>

        {loadingLineup ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">
              Loading player lineup data...
            </p>
          </div>
        ) : (
          <PlayerTimeSelection
            homePlayers={homePlayers}
            awayPlayers={awayPlayers}
            matchDuration={matchData.duration_minutes || 90}
            existingTimes={lineupData}
            onAddPlayer={handleAddPlayer}
            onUpdatePlayer={handleUpdatePlayer}
            onDeletePlayer={handleDeletePlayer}
            onComplete={() => {
              // Mark lineup step as completed
              setPreparationSteps((prev) =>
                prev.map((step) =>
                  step.id === "lineups"
                    ? { ...step, status: "completed" }
                    : step
                )
              );
            }}
          />
        )}
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
          {allStepsCompleted ? (
            <div className="flex items-center space-x-2 text-primary">
              <CheckCircle className="h-4 w-4" />
              <span>
                All preparation steps completed. Ready for video analysis.
              </span>
            </div>
          ) : (
            <div>
              <span>Complete all preparation steps to continue</span>
              {preparationSteps.find((s) => s.id === "video")?.status !==
                "completed" && (
                <div className="text-destructive text-xs mt-1">
                  • Upload match video
                </div>
              )}
              {preparationSteps.find((s) => s.id === "metadata")?.status !==
                "completed" && (
                <div className="text-destructive text-xs mt-1">
                  • Confirm match information
                </div>
              )}
              {preparationSteps.find((s) => s.id === "lineups")?.status !==
                "completed" && (
                <div className="text-destructive text-xs mt-1">
                  • Configure player lineups
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleStartAnalysis}
            disabled={!allStepsCompleted || savingLineup || currentStep > 0}
            className="gap-2"
            // disabled={currentStep > 0}
            size="lg"
          >
            {savingLineup ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {savingLineup
              ? "Saving..."
              : currentStep === 0
              ? "Start Video Analysis"
              : "Already submitted"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchPrepareStep;
