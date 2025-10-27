import { useState, useEffect } from "react";
import { Search, X, User, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        const searchLower = searchTerm.toLowerCase();
        return (
          player.full_name?.toLowerCase().includes(searchLower) ||
          player.jersey_number?.toString().includes(searchTerm) ||
          player.position?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPlayers(filtered);
    }
  }, [players, searchTerm]);

  const handlePlayerSelect = (player) => {
    console.log("🎯 Player selected:", player);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 m-0">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <CardHeader className="shrink-0 border-b">
          <CardTitle className="flex items-center justify-between text-foreground">
            <div>
              <span className="text-xl font-bold">
                Add Player - {teamType} Team
              </span>
              <p className="text-muted-foreground text-sm mt-1 font-normal">
                Select players who participated in the match
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        {/* Search Section */}
        <div className="shrink-0 p-6 border-b bg-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search players by name, jersey number, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        {/* Scrollable Players List */}
        <CardContent className="flex-1 overflow-y-auto p-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-base font-medium text-foreground">
                    No players found
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm
                      ? "Try a different search term"
                      : "No players available to add"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPlayers.map((player) => (
                    <div
                      key={player.player_id}
                      className="flex items-center p-4 border border-border rounded-lg cursor-pointer bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 group shadow-sm"
                      onClick={() => handlePlayerSelect(player)}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-600 flex items-center justify-center shadow-md">
                          {player.avatar_url ? (
                            <img
                              src={player.avatar_url}
                              alt={player.full_name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-background"
                            />
                          ) : (
                            <User className="h-6 w-6 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {player.full_name}
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center space-x-1">
                              <Shirt className="h-3 w-3" />
                              <span>#{player.jersey_number}</span>
                            </div>
                            <span className="text-border">•</span>
                            <span className="font-medium text-foreground">
                              {player.position}
                            </span>
                            {player.nationality && (
                              <>
                                <span className="text-border">•</span>
                                <span className="text-muted-foreground">
                                  {player.nationality}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
                        Select ✓
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Fixed Footer */}
        <div className="shrink-0 border-t p-6 bg-card">
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border text-foreground hover:bg-accent hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlayerSelectionModal;
