import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tabs from "@/components/common/Tabs";
import PlayerProfilePage from "@/pages/players/PlayerProfilePage";
import PlayerActivityPage from "@/pages/players/PlayerActivityPage";
import PlayerVectorPage from "@/pages/players/PlayerVectorPage";
import PlayerSpotlightPage from "@/pages/Players/PlayerSpotlightPage";
import PlayerDistributionMapPage from "@/pages/Players/PlayerDistributionMapPage";
import { generatePlayerPDF } from "@/utils/pdfGenerator";
import { mockPlayersData, mockPlayerMetrics } from "@/mock/playerData";
import { player_events } from "@/mock/eventData";

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundPlayer = Object.values(mockPlayersData)
        .flat()
        .find((p) => p.player_id === id);

      if (foundPlayer) {
        setPlayer(foundPlayer);
        setMetrics(mockPlayerMetrics[id] || mockPlayerMetrics["player-1"]);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleGenerateReport = async () => {
    if (player && metrics) {
      await generatePlayerPDF(player, metrics);
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile & Performance",
      content: (
        <PlayerProfilePage player={player} player_events={player_events} />
      ),
    },
    {
      id: "activity",
      label: "Activity Field",
      content: <PlayerActivityPage player_events={player_events} />,
    },
    {
      id: "vector",
      label: "Vector Field",
      content: <PlayerVectorPage player_events={player_events} />,
    },
    {
      id: "distribution",
      label: "Distribution Map Field",
      content: <PlayerDistributionMapPage player_events={player_events} />,
    },
    {
      id: "spotlight",
      label: "Spotlight",
      content: <PlayerSpotlightPage player={player} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Loading player data...</div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Player not found</div>
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
              <h1 className="text-2xl lg:text-3xl font-bold">
                {player.full_name}
              </h1>
              <p className="text-muted-foreground">
                {player.position} • #{player.jersey_number} •{" "}
                {player.current_club_name}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerateReport} className="gap-2">
              <Download className="h-4 w-4" />
              Generate Player Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        {/* Tabs Section */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Tabs
            tabs={tabs}
            defaultTab={0}
            variant="default"
            size="md"
            responsive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;
