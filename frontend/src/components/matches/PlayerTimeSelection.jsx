import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Clock,
  CheckCircle,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Tabs from "@/components/common/Tabs";
import PlayerSelectionModal from "@/components/matches/PlayerSelectionModal";

const PlayerTimeSelection = ({
  homePlayers = [],
  awayPlayers = [],
  matchDuration = 90,
  existingTimes = {},
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
  onComplete,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [homeLineup, setHomeLineup] = useState([]);
  const [awayLineup, setAwayLineup] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize lineups from existing times data
  useEffect(() => {
    if (isInitialized) return;

    const homeLineupData = [];
    const awayLineupData = [];

    // Process existing times to populate lineups
    Object.entries(existingTimes).forEach(([playerId, data]) => {
      const playerData = [...homePlayers, ...awayPlayers].find(
        (p) => p.player_id === playerId
      );

      if (playerData) {
        const lineupItem = {
          ...playerData,
          start_time: data.start_time || 0,
          end_time: data.end_time || matchDuration,
          position: data.position || playerData.position || "",
          match_info_id: data.match_info_id,
        };

        // Determine which team the player belongs to
        if (homePlayers.find((p) => p.player_id === playerId)) {
          homeLineupData.push(lineupItem);
        } else {
          awayLineupData.push(lineupItem);
        }
      }
    });

    setHomeLineup(homeLineupData);
    setAwayLineup(awayLineupData);

    setIsInitialized(true);
  }, [existingTimes, homePlayers, awayPlayers, matchDuration, isInitialized]);

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
    setShowPlayerModal(true);
  };

  const handleAddPlayer = async (player) => {
    const { lineup, setLineup } = getCurrentTeamData();

    // Check if player is already in lineup
    const isAlreadyInLineup = lineup.some(
      (p) => p.player_id === player.player_id
    );
    if (isAlreadyInLineup) {
      return;
    }

    // Create new player with default match data
    const newPlayer = {
      ...player,
      start_time: 0,
      end_time: matchDuration,
      position: player.position || "",
    };

    // Update lineup state immediately for better UX
    setLineup((prev) => {
      const newLineup = [...prev, newPlayer];
      return newLineup;
    });

    // Save to backend
    if (onAddPlayer) {
      const success = await onAddPlayer(player.player_id, {
        start_time: 0,
        end_time: matchDuration,
        position: player.position || "",
      });

      if (!success) {
        // Rollback if save failed
        setLineup((prev) =>
          prev.filter((p) => p.player_id !== player.player_id)
        );
      }
    }
  };

  const handleRemovePlayer = async (playerId) => {
    const { setLineup } = getCurrentTeamData();

    // Store the player data for rollback
    const playerToRemove = getCurrentTeamData().lineup.find(
      (p) => p.player_id === playerId
    );

    // Update lineup state immediately for better UX
    setLineup((prev) => {
      const newLineup = prev.filter((p) => p.player_id !== playerId);
      return newLineup;
    });

    // Delete from backend
    if (onDeletePlayer) {
      const success = await onDeletePlayer(playerId);

      if (!success) {
        // Rollback if delete failed
        setLineup((prev) => [...prev, playerToRemove]);
      }
    }
  };

  const handleStartEdit = (player) => {
    setEditingPlayer(player.player_id);
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
  };

  const handleSaveEdit = async (playerId, updates) => {
    const { setLineup } = getCurrentTeamData();

    // Store old data for rollback
    const oldPlayerData = getCurrentTeamData().lineup.find(
      (p) => p.player_id === playerId
    );

    // Update lineup state immediately for better UX
    setLineup((prev) => {
      const updatedLineup = prev.map((player) =>
        player.player_id === playerId ? { ...player, ...updates } : player
      );
      return updatedLineup;
    });

    setEditingPlayer(null);

    // Update in backend
    if (onUpdatePlayer) {
      const success = await onUpdatePlayer(playerId, updates);

      if (!success) {
        // Rollback if update failed
        setLineup((prev) =>
          prev.map((player) =>
            player.player_id === playerId ? oldPlayerData : player
          )
        );
        setEditingPlayer(playerId); // Stay in edit mode if failed
      }
    }
  };

  // Get available players for current team (players not in lineup)
  const getAvailablePlayers = () => {
    const { players, lineup } = getCurrentTeamData();
    const currentLineupIds = lineup.map((p) => p.player_id);
    const available = players.filter(
      (player) => !currentLineupIds.includes(player.player_id)
    );

    return available;
  };

  // Check if both teams have at least one player
  const isLineupComplete = () => {
    const homeComplete = homeLineup.length > 0;
    const awayComplete = awayLineup.length > 0;

    return homeComplete && awayComplete;
  };

  const handleCompleteLineup = () => {
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
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          editingPlayer={editingPlayer}
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
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          editingPlayer={editingPlayer}
          matchDuration={matchDuration}
          teamType="away"
        />
      ),
    },
  ];

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
        teamType={getCurrentTeamData().teamType}
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

        {/* <Button
          onClick={handleCompleteLineup}
          disabled={!isLineupComplete()}
          className="gap-2"
          size="lg"
        >
          <CheckCircle className="h-4 w-4" />
          Complete Lineup
        </Button> */}
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
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  editingPlayer,
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
                onStartEdit={onStartEdit}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                isEditing={editingPlayer === player.player_id}
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
const PlayerRow = ({
  player,
  onRemove,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  isEditing,
  matchDuration,
}) => {
  const [editData, setEditData] = useState({
    position: player.position || "",
    start_time: player.start_time || 0,
    end_time: player.end_time || matchDuration,
  });

  const handleTimeChange = (field, value) => {
    const time = Math.max(0, Math.min(matchDuration, parseInt(value) || 0));
    setEditData((prev) => ({ ...prev, [field]: time }));
  };

  const handlePositionChange = (e) => {
    const newPosition = e.target.value;
    setEditData((prev) => ({ ...prev, position: newPosition }));
  };

  const handleSave = () => {
    onSaveEdit(player.player_id, editData);
  };

  const handleCancel = () => {
    setEditData({
      position: player.position || "",
      start_time: player.start_time || 0,
      end_time: player.end_time || matchDuration,
    });
    onCancelEdit();
  };

  const playingTime = Math.max(
    0,
    (player.end_time || matchDuration) - (player.start_time || 0)
  );

  const editPlayingTime = Math.max(
    0,
    (editData.end_time || matchDuration) - (editData.start_time || 0)
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
        {isEditing ? (
          <input
            type="text"
            value={editData.position}
            onChange={handlePositionChange}
            placeholder="Position"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        ) : (
          <div className="text-sm text-foreground">
            {player.position || "No position"}
          </div>
        )}
      </div>

      {/* Start Time */}
      <div className="col-span-2">
        {isEditing ? (
          <input
            type="number"
            min="0"
            max={matchDuration}
            value={editData.start_time}
            onChange={(e) => handleTimeChange("start_time", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
          />
        ) : (
          <div className="text-sm text-foreground text-center">
            {player.start_time || 0}m
          </div>
        )}
      </div>

      {/* End Time */}
      <div className="col-span-2">
        {isEditing ? (
          <input
            type="number"
            min="0"
            max={matchDuration}
            value={editData.end_time}
            onChange={(e) => handleTimeChange("end_time", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
          />
        ) : (
          <div className="text-sm text-foreground text-center">
            {player.end_time || matchDuration}m
          </div>
        )}
      </div>

      {/* Actions & Duration */}
      <div className="col-span-2 flex items-center justify-center space-x-2">
        {isEditing ? (
          <>
            <div className="text-xs text-muted-foreground mr-2">
              {editPlayingTime}m
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="text-xs text-muted-foreground mr-2">
              {playingTime}m
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartEdit(player)}
              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(player.player_id)}
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerTimeSelection;
