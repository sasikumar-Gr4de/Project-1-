// src/pages/Matches/MatchAnalysisStep.jsx
import { BarChart3, Target, Zap, Brain } from "lucide-react";
import { mockPlayersData, mockMetricsData } from "@/mock/matchData";

const MatchAnalysisStep = ({ matchId, currentStep }) => {
  if (currentStep < 1) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Complete Overview First
        </h3>
        <p className="text-muted-foreground">
          Please complete the match overview to access detailed analysis.
        </p>
      </div>
    );
  }

  const topPerformers = mockPlayersData.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Avg. Talent Index</span>
          </div>
          <div className="text-2xl font-bold text-primary">89.8</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Top Speed</span>
          </div>
          <div className="text-2xl font-bold text-primary">34.2 km/h</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Avg. Decision Making</span>
          </div>
          <div className="text-2xl font-bold text-primary">88.7</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Pass Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-primary">93.2%</div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
        <div className="space-y-4">
          {topPerformers.map((player, index) => {
            const metrics = mockMetricsData[player.player_id];
            return (
              <div
                key={player.player_id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {player.position} • #{player.jersey_number}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {metrics?.talent_index_score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    GR4DE Score
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          Detailed Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(mockMetricsData["player-001"] || {})
            .slice(0, 8)
            .map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center p-3 border border-border rounded-lg"
              >
                <span className="text-sm capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {value}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MatchAnalysisStep;
