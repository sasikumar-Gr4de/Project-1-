import { useState, useEffect, useRef } from "react";
import { Plus, Users, Clock, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Tabs from "@/components/common/Tabs";
import PlayerSelectionModal from "@/components/matches/PlayerSelectionModal";

const PlayerTimeSelection = ({
  homePlayers = [],
  awayPlayers = [],
  matchDuration = 90,
  existingTimes = {},
  onUpdate,
  onComplete,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [homeLineup, setHomeLineup] = useState([]);
  const [awayLineup, setAwayLineup] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use refs to track previous values and prevent unnecessary updates
  const prevHomeLineupRef = useRef([]);
  const prevAwayLineupRef = useRef([]);
  const updateTimeoutRef = useRef(null);

  console.log("🔍 DEBUG - Component render", {
    homePlayersCount: homePlayers.length,
    awayPlayersCount: awayPlayers.length,
    homeLineupCount: homeLineup.length,
    awayLineupCount: awayLineup.length,
    isInitialized,
  });

  // Initialize lineups from existing data - ONLY ONCE
  useEffect(() => {
    if (isInitialized) return;

    console.log("🔄 INITIALIZING LINEUPS");

    if (existingTimes && Object.keys(existingTimes).length > 0) {
      console.log("📥 Loading from existing times");

      const homeLineupData = [];
      const awayLineupData = [];

      // Process home players
      homePlayers.forEach((player) => {
        if (existingTimes[player.player_id]) {
          const data = existingTimes[player.player_id];
          homeLineupData.push({
            ...player,
            start_time: data.start_time || 0,
            end_time: data.end_time || matchDuration,
            position: data.position || player.position || "",
          });
        }
      });

      // Process away players
      awayPlayers.forEach((player) => {
        if (existingTimes[player.player_id]) {
          const data = existingTimes[player.player_id];
          awayLineupData.push({
            ...player,
            start_time: data.start_time || 0,
            end_time: data.end_time || matchDuration,
            position: data.position || player.position || "",
          });
        }
      });

      console.log("🏠 Home lineup:", homeLineupData);
      console.log("🛫 Away lineup:", awayLineupData);

      setHomeLineup(homeLineupData);
      setAwayLineup(awayLineupData);
      prevHomeLineupRef.current = homeLineupData;
      prevAwayLineupRef.current = awayLineupData;
    }

    setIsInitialized(true);
  }, [existingTimes, homePlayers, awayPlayers, matchDuration, isInitialized]);

  // Update parent component only when lineups actually change
  useEffect(() => {
    if (!isInitialized) return;

    const homeChanged =
      JSON.stringify(homeLineup) !== JSON.stringify(prevHomeLineupRef.current);
    const awayChanged =
      JSON.stringify(awayLineup) !== JSON.stringify(prevAwayLineupRef.current);

    if (homeChanged || awayChanged) {
      console.log("🔄 Lineups changed, updating parent");

      // Clear any pending update
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce the update to prevent rapid successive calls
      updateTimeoutRef.current = setTimeout(() => {
        const allPlayerTimes = {};

        [...homeLineup, ...awayLineup].forEach((player) => {
          allPlayerTimes[player.player_id] = {
            start_time: player.start_time || 0,
            end_time: player.end_time || matchDuration,
            position: player.position || "",
            player_name: player.full_name,
            jersey_number: player.jersey_number,
          };
        });

        console.log(
          "📤 Sending to parent:",
          Object.keys(allPlayerTimes).length,
          "players"
        );

        if (onUpdate) {
          onUpdate(allPlayerTimes);
        }

        // Update refs with current values
        prevHomeLineupRef.current = [...homeLineup];
        prevAwayLineupRef.current = [...awayLineup];
      }, 100);
    }

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [homeLineup, awayLineup, matchDuration, onUpdate, isInitialized]);

  const getCurrentTeamData = () => {
    return activeTab === 0
      ? {
          players: homePlayers,
          lineup: homeLineup,
          setLineup: setHomeLineup,
          teamType: "home",
        }
      : {
          players: awayPlayers,
          lineup: awayLineup,
          setLineup: setAwayLineup,
          teamType: "away",
        };
  };

  const handleAddPlayerClick = () => {
    console.log(
      "📱 Opening player modal for team:",
      getCurrentTeamData().teamType
    );
    setShowPlayerModal(true);
  };

  const handleAddPlayer = (player) => {
    console.log("➕ ADDING PLAYER TO LINEUP:", player.full_name);

    const { lineup, setLineup } = getCurrentTeamData();

    // Check if player is already in lineup
    const isAlreadyInLineup = lineup.some(
      (p) => p.player_id === player.player_id
    );
    if (isAlreadyInLineup) {
      console.warn("⚠️ Player already in lineup:", player.full_name);
      return;
    }

    // Create new player with default match data
    const newPlayer = {
      ...player,
      start_time: 0,
      end_time: matchDuration,
      position: player.position || "",
    };

    console.log("🎯 New player data:", newPlayer);

    // Update lineup state
    setLineup((prev) => {
      const newLineup = [...prev, newPlayer];
      console.log("📊 Lineup after addition:", newLineup.length, "players");
      return newLineup;
    });
  };

  const handleRemovePlayer = (playerId) => {
    console.log("🗑️ REMOVING PLAYER:", playerId);
    const { setLineup } = getCurrentTeamData();

    setLineup((prev) => {
      const newLineup = prev.filter((p) => p.player_id !== playerId);
      console.log("📊 Lineup after removal:", newLineup.length, "players");
      return newLineup;
    });
  };

  const handlePlayerUpdate = (playerId, updates) => {
    console.log("✏️ UPDATING PLAYER:", playerId, updates);
    const { setLineup } = getCurrentTeamData();

    setLineup((prev) => {
      const updatedLineup = prev.map((player) =>
        player.player_id === playerId ? { ...player, ...updates } : player
      );
      return updatedLineup;
    });
  };

  // Get available players for current team (players not in lineup)
  const getAvailablePlayers = () => {
    const { players, lineup } = getCurrentTeamData();
    const currentLineupIds = lineup.map((p) => p.player_id);
    const available = players.filter(
      (player) => !currentLineupIds.includes(player.player_id)
    );
    console.log(`👥 Available players:`, available.length);
    return available;
  };

  // Check if both teams have at least one player
  const isLineupComplete = () => {
    const homeComplete = homeLineup.length > 0;
    const awayComplete = awayLineup.length > 0;

    return homeComplete && awayComplete;
  };

  const handleCompleteLineup = () => {
    console.log("🏁 Completing lineup configuration");
    if (isInitialized && isLineupComplete() && onComplete) {
      onComplete();
    }
  };

  // Prepare tabs data
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
          onAddPlayer={handleAddPlayerClick}
          onRemovePlayer={handleRemovePlayer}
          onUpdatePlayer={handlePlayerUpdate}
          matchDuration={matchDuration}
          teamType="home"
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
          onAddPlayer={handleAddPlayerClick}
          onRemovePlayer={handleRemovePlayer}
          onUpdatePlayer={handlePlayerUpdate}
          matchDuration={matchDuration}
          teamType="away"
        />
      ),
    },
  ];

  const currentTeam = getCurrentTeamData();

  return (
    <div className="space-y-6">
      {/* Team Selection Tabs */}
      <Tabs
        tabs={tabsData}
        defaultTab={activeTab}
        onTabChange={setActiveTab}
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
        teamType={currentTeam.teamType}
      />

      {/* Action Section */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {isLineupComplete() ? (
            <div className="flex items-center space-x-2 text-primary">
              <CheckCircle className="h-4 w-4" />
              <span>Lineup configuration complete! Ready for analysis.</span>
            </div>
          ) : (
            <div>
              <span>Add participating players to both teams</span>
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
          Complete Lineup
        </Button>
      </div>

      {/* Summary Statistics */}
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

// Team Lineup Component
const TeamLineup = ({
  lineup,
  availablePlayers,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayer,
  matchDuration,
  teamType,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="font-semibold text-lg capitalize">
            {teamType} Team Participants
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {lineup.length} players participating • {availablePlayers.length}{" "}
            available to add
          </p>
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

      {/* Empty State */}
      {lineup.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-muted/20">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg font-medium">
            No players added yet
          </p>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Add players who participated in this match
          </p>
          <Button
            onClick={onAddPlayer}
            disabled={availablePlayers.length === 0}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Player
          </Button>
        </div>
      )}

      {/* Players Table */}
      {lineup.length > 0 && (
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-semibold text-foreground">
            <div className="col-span-4">Player Information</div>
            <div className="col-span-2">Match Position</div>
            <div className="col-span-2">Start (min)</div>
            <div className="col-span-2">End (min)</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Players List */}
          <div className="space-y-3">
            {lineup.map((player) => (
              <PlayerRow
                key={player.player_id}
                player={player}
                onRemove={onRemovePlayer}
                onUpdate={onUpdatePlayer}
                matchDuration={matchDuration}
              />
            ))}
          </div>
        </div>
      )}

      {/* Match Info */}
      <div className="flex items-center justify-center text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <Clock className="h-4 w-4 mr-2" />
        Match Duration: {matchDuration} minutes
      </div>
    </div>
  );
};

// Individual Player Row Component
const PlayerRow = ({ player, onRemove, onUpdate, matchDuration }) => {
  const handleTimeChange = (field, value) => {
    const time = Math.max(0, Math.min(matchDuration, parseInt(value) || 0));
    onUpdate(player.player_id, { [field]: time });
  };

  const handlePositionChange = (e) => {
    const newPosition = e.target.value;
    onUpdate(player.player_id, { position: newPosition });
  };

  const playingTime = Math.max(
    0,
    (player.end_time || matchDuration) - (player.start_time || 0)
  );

  return (
    <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 border border-border rounded-lg bg-card hover:bg-accent/30 transition-colors">
      {/* Player Info */}
      <div className="col-span-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
          {player.avatar_url ? (
            <img
              src={player.avatar_url}
              alt={player.full_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Users className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm">{player.full_name}</div>
          <div className="text-xs text-muted-foreground">
            #{player.jersey_number} • {player.position || "No position"}
            {player.nationality && ` • ${player.nationality}`}
          </div>
        </div>
      </div>

      {/* Position Input */}
      <div className="col-span-2">
        <input
          type="text"
          value={player.position || ""}
          onChange={handlePositionChange}
          placeholder="Position"
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Start Time */}
      <div className="col-span-2">
        <input
          type="number"
          min="0"
          max={matchDuration}
          value={player.start_time || 0}
          onChange={(e) => handleTimeChange("start_time", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
        />
      </div>

      {/* End Time */}
      <div className="col-span-2">
        <input
          type="number"
          min="0"
          max={matchDuration}
          value={player.end_time || matchDuration}
          onChange={(e) => handleTimeChange("end_time", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
        />
      </div>

      {/* Actions & Duration */}
      <div className="col-span-2 flex items-center justify-center space-x-2">
        <div className="text-xs text-muted-foreground mr-2">{playingTime}m</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(player.player_id)}
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerTimeSelection;
