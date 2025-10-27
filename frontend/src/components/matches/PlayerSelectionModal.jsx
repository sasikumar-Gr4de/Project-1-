import { useState, useEffect } from "react";
import { Search, X, User, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const PlayerSelectionModal = ({
  isOpen,
  onClose,
  players,
  onSelectPlayer,
  teamType,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  // Filter players based on search
  useEffect(() => {
    if (players && Array.isArray(players)) {
      const filtered = players.filter((player) => {
        const matchesSearch =
          player.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.jersey_number?.toString().includes(searchTerm) ||
          player.position?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
      });
      setFilteredPlayers(filtered);
    }
  }, [players, searchTerm]);

  const handlePlayerSelect = (player) => {
    console.log("Player selected in modal, calling onSelectPlayer:", player);
    onSelectPlayer(player);
    onClose();
  };

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">
              Select Player - {teamType} Team
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredPlayers.length} players available
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, jersey, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-base">No players found</p>
                <p className="text-sm mt-1">
                  {searchTerm
                    ? "Try a different search term"
                    : "No players available"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.player_id}
                    className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handlePlayerSelect(player)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        {player.avatar_url ? (
                          <img
                            src={player.avatar_url}
                            alt={player.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{player.full_name}</div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Shirt className="h-3 w-3" />
                            <span>#{player.jersey_number}</span>
                          </div>
                          <span>•</span>
                          <span>{player.position}</span>
                          {player.nationality && (
                            <>
                              <span>•</span>
                              <span>{player.nationality}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end p-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;
