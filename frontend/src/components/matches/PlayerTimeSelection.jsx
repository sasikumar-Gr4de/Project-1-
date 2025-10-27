import { useState, useEffect } from "react";
import { Plus, Users, Shirt, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Tabs from "@/components/common/Tabs";
import PlayerSelectionModal from "@/components/matches/PlayerSelectionModal";
import LineupPlayerCard from "@/components/matches/LineupPlayerCard";

const PlayerTimeSelection = ({
  homePlayers = [],
  awayPlayers = [],
  matchDuration = 90,
  existingTimes = {},
  onUpdate,
  onComplete, // New prop for completing lineup
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [homeLineup, setHomeLineup] = useState([]);
  const [awayLineup, setAwayLineup] = useState([]);

  // Initialize lineups from existing data
  useEffect(() => {
    if (existingTimes && Object.keys(existingTimes).length > 0) {
      const homePlayersWithTimes = homePlayers
        .map((player) => ({
          ...player,
          ...existingTimes[player.player_id],
        }))
        .filter((player) => existingTimes[player.player_id]);

      const awayPlayersWithTimes = awayPlayers
        .map((player) => ({
          ...player,
          ...existingTimes[player.player_id],
        }))
        .filter((player) => existingTimes[player.player_id]);

      setHomeLineup(homePlayersWithTimes);
      setAwayLineup(awayPlayersWithTimes);
    }
  }, [existingTimes, homePlayers, awayPlayers]);

  const currentPlayers = activeTab === 0 ? homePlayers : awayPlayers;
  const currentLineup = activeTab === 0 ? homeLineup : awayLineup;
  const setCurrentLineup = activeTab === 0 ? setHomeLineup : setAwayLineup;

  const handleAddPlayer = (player) => {
    const newPlayer = {
      ...player,
      start_time: 0,
      end_time: matchDuration,
      position: player.position, // Default to player's main position
    };

    setCurrentLineup((prev) => [...prev, newPlayer]);
    updateParentData();
  };

  const handleRemovePlayer = (playerId) => {
    setCurrentLineup((prev) => prev.filter((p) => p.player_id !== playerId));
    updateParentData();
  };

  const handlePlayerUpdate = (playerId, updates) => {
    setCurrentLineup((prev) =>
      prev.map((player) =>
        player.player_id === playerId ? { ...player, ...updates } : player
      )
    );
    updateParentData();
  };

  const updateParentData = () => {
    if (onUpdate) {
      const allPlayerTimes = {};

      [...homeLineup, ...awayLineup].forEach((player) => {
        allPlayerTimes[player.player_id] = {
          start_time: player.start_time || 0,
          end_time: player.end_time || matchDuration,
          position: player.position,
          player_name: player.full_name,
          jersey_number: player.jersey_number,
        };
      });

      onUpdate(allPlayerTimes);
    }
  };

  const getAvailablePlayers = () => {
    const currentLineupIds = currentLineup.map((p) => p.player_id);
    return currentPlayers.filter(
      (player) => !currentLineupIds.includes(player.player_id)
    );
  };

  const getFormationSummary = (lineup) => {
    const positionCount = {};
    lineup.forEach((player) => {
      if (player.position) {
        positionCount[player.position] =
          (positionCount[player.position] || 0) + 1;
      }
    });

    return Object.entries(positionCount)
      .map(([pos, count]) => `${count} ${pos}`)
      .join(", ");
  };

  // Check if lineup is complete (at least one player per team with valid times)
  const isLineupComplete = () => {
    const homeHasValidPlayers =
      homeLineup.length > 0 &&
      homeLineup.every(
        (player) =>
          player.start_time !== undefined &&
          player.end_time !== undefined &&
          player.start_time < player.end_time
      );

    const awayHasValidPlayers =
      awayLineup.length > 0 &&
      awayLineup.every(
        (player) =>
          player.start_time !== undefined &&
          player.end_time !== undefined &&
          player.start_time < player.end_time
      );

    return homeHasValidPlayers && awayHasValidPlayers;
  };

  const handleCompleteLineup = () => {
    if (isLineupComplete() && onComplete) {
      onComplete();
    }
  };

  // Prepare tabs data for the custom Tabs component
  const tabsData = [
    {
      id: "home",
      label: "Home Team",
      icon: Users,
      badge: homeLineup.length,
      content: (
        <TeamLineup
          lineup={homeLineup}
          availablePlayers={getAvailablePlayers()}
          onAddPlayer={() => setShowPlayerModal(true)}
          onRemovePlayer={handleRemovePlayer}
          onUpdatePlayer={handlePlayerUpdate}
          matchDuration={matchDuration}
          teamType="home"
          formationSummary={getFormationSummary(homeLineup)}
        />
      ),
    },
    {
      id: "away",
      label: "Away Team",
      icon: Users,
      badge: awayLineup.length,
      content: (
        <TeamLineup
          lineup={awayLineup}
          availablePlayers={getAvailablePlayers()}
          onAddPlayer={() => setShowPlayerModal(true)}
          onRemovePlayer={handleRemovePlayer}
          onUpdatePlayer={handlePlayerUpdate}
          matchDuration={matchDuration}
          teamType="away"
          formationSummary={getFormationSummary(awayLineup)}
        />
      ),
    },
  ];

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="space-y-6">
      {/* Team Selection Tabs */}
      <Tabs
        tabs={tabsData}
        defaultTab={activeTab}
        onTabChange={handleTabChange}
        variant="pills"
        fullWidth={true}
        responsive={true}
        className="mb-6"
      />

      {/* Player Selection Modal */}
      <PlayerSelectionModal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        players={getAvailablePlayers()}
        onSelectPlayer={handleAddPlayer}
        teamType={activeTab === 0 ? "home" : "away"}
        existingLineup={currentLineup}
      />

      {/* Complete Lineup Button */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {isLineupComplete() ? (
            <div className="flex items-center space-x-2 text-primary">
              <CheckCircle className="h-4 w-4" />
              <span>Lineup configuration complete! Ready for analysis.</span>
            </div>
          ) : (
            <div>
              <span>
                Complete lineup configuration for both teams to continue
              </span>
              {homeLineup.length === 0 && (
                <div className="text-destructive text-xs mt-1">
                  • Add players to home team
                </div>
              )}
              {awayLineup.length === 0 && (
                <div className="text-destructive text-xs mt-1">
                  • Add players to away team
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={handleCompleteLineup}
          disabled={!isLineupComplete()}
          className="gap-2"
          size="lg"
        >
          <CheckCircle className="h-4 w-4" />
          Complete Lineup Configuration
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-2xl text-primary">
              {homeLineup.length + awayLineup.length}
            </div>
            <div className="text-muted-foreground">Total Players</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-2xl text-primary">
              {homeLineup.length}
            </div>
            <div className="text-muted-foreground">Home Players</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-2xl text-primary">
              {awayLineup.length}
            </div>
            <div className="text-muted-foreground">Away Players</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Lineup Sub-component
const TeamLineup = ({
  lineup,
  availablePlayers,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayer,
  matchDuration,
  teamType,
  formationSummary,
}) => {
  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="font-semibold text-lg capitalize">
            {teamType} Team Lineup
          </h4>
          {formationSummary && (
            <p className="text-sm text-muted-foreground">
              Formation: {formationSummary}
            </p>
          )}
        </div>

        <Button
          onClick={onAddPlayer}
          disabled={availablePlayers.length === 0}
          size="sm"
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Player
          {availablePlayers.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {availablePlayers.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Available Players Info */}
      {availablePlayers.length === 0 && lineup.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No players available</p>
          <p className="text-sm text-muted-foreground mt-1">
            All players are already in the lineup
          </p>
        </div>
      )}

      {/* Lineup Grid */}
      {lineup.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lineup.map((player, index) => (
            <LineupPlayerCard
              key={player.player_id}
              player={player}
              onRemove={onRemovePlayer}
              onUpdate={onUpdatePlayer}
              matchDuration={matchDuration}
              index={index}
              teamType={teamType}
            />
          ))}
        </div>
      ) : availablePlayers.length > 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <Shirt className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No players in lineup</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Add Player" to build your lineup
          </p>
        </div>
      ) : null}

      {/* Match Duration Info */}
      <div className="flex items-center justify-center text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <Clock className="h-4 w-4 mr-2" />
        Match Duration: {matchDuration} minutes
      </div>
    </div>
  );
};

export default PlayerTimeSelection;
