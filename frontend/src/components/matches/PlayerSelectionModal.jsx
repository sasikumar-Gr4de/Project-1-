import { useState, useEffect } from "react";
import { Search, X, User, Shirt, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const PlayerSelectionModal = ({
  isOpen,
  onClose,
  players,
  selectedPlayers = [],
  onSelectPlayer,
  teamType,
  existingLineup = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (players) {
      const filtered = players.filter((player) => {
        const matchesSearch =
          player.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.jersey_number?.toString().includes(searchTerm) ||
          player.position?.toLowerCase().includes(searchTerm.toLowerCase());

        // Exclude players already in lineup
        const alreadyInLineup = existingLineup.some(
          (p) => p.player_id === player.player_id
        );

        return matchesSearch && !alreadyInLineup;
      });
      setFilteredPlayers(filtered);
    }
  }, [players, searchTerm, existingLineup]);

  const handlePlayerSelect = (player) => {
    onSelectPlayer(player);
    onClose();
  };

  const isPlayerSelected = (playerId) => {
    return selectedPlayers.some((p) => p.player_id === playerId);
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">
              Select Player - {teamType} Team
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 truncate">
              Choose a player from substitutes
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 shrink-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 sm:p-4 border-b border-border shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, jersey, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          {isMobile && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Smartphone className="h-3 w-3" />
              <span>Swipe to see more info</span>
            </div>
          )}
        </div>

        {/* Players List - Fixed scrolling area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2 sm:p-4">
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <User className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">No players found</p>
                  <p className="text-xs sm:text-sm mt-1">
                    {searchTerm
                      ? "Try a different search term"
                      : "All players are already in the lineup"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPlayers.map((player) => (
                    <div
                      key={player.player_id}
                      className={`flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer transition-all hover:bg-accent ${
                        isPlayerSelected(player.player_id)
                          ? "bg-primary/10 border-primary/20"
                          : ""
                      }`}
                      onClick={() => handlePlayerSelect(player)}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                          {player.avatar_url ? (
                            <img
                              src={player.avatar_url}
                              alt={player.full_name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base truncate">
                            {player.full_name}
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center space-x-1">
                              <Shirt className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                #{player.jersey_number}
                              </span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate">{player.position}</span>
                            {player.nationality && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline truncate">
                                  {player.nationality}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {isPlayerSelected(player.player_id) && (
                        <Badge
                          variant="secondary"
                          className="text-xs ml-2 shrink-0"
                        >
                          Selected
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 p-3 sm:p-4 border-t border-border shrink-0">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left mb-2 sm:mb-0 sm:mr-4">
            {filteredPlayers.length} player
            {filteredPlayers.length !== 1 ? "s" : ""} available
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;
