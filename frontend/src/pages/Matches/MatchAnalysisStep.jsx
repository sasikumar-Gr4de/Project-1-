// src/pages/Matches/MatchAnalysisStep.jsx
import { useState } from "react";
import {
  BarChart3,
  Target,
  Brain,
  TrendingUp,
  Users,
  Award,
  Activity,
} from "lucide-react";
import { mockPlayersData, mockMatchData } from "@/mock/matchData";
import {
  mockMetricsData,
  metricsCategories,
  getCategoryLabel,
  getMetricLabel,
} from "@/mock/analysisMetrics";

const MatchAnalysisStep = ({ matchId, currentStep }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("core");

  if (currentStep < 1) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Complete match preparation first
        </h3>
        <p className="text-muted-foreground">
          Please complete the match previous step to start analysis.
        </p>
      </div>
    );
  }

  const homePlayers = mockPlayersData[mockMatchData.home_club_id] || [];
  const awayPlayers = mockPlayersData[mockMatchData.away_club_id] || [];
  const allPlayers = [...homePlayers, ...awayPlayers];

  // Calculate team averages
  const calculateTeamAverages = (players) => {
    const metrics = [
      "talent_index_score",
      "technical_proficiency",
      "tactical_intelligence",
      "physical_attributes",
    ];
    return metrics.reduce((acc, metric) => {
      const sum = players.reduce(
        (total, player) => total + (player.metrics[metric] || 0),
        0
      );
      acc[metric] = sum / players.length;
      return acc;
    }, {});
  };

  const homeAverages = calculateTeamAverages(homePlayers);
  const awayAverages = calculateTeamAverages(awayPlayers);

  const MetricProgress = ({ value, label, max = 100 }) => (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
      <span className="text-sm flex-1">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-24 bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium w-12 text-right">
          {value}
          {max === 100
            ? ""
            : typeof value === "number"
            ? value.toFixed(1)
            : value}
        </span>
      </div>
    </div>
  );

  const PlayerComparison = ({ player1, player2, category }) => (
    <div className="space-y-3">
      {metricsCategories[category].map((metric) => (
        <div key={metric} className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground w-32 truncate">
            {getMetricLabel(metric)}
          </span>
          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="text-right w-20">
              <div className="font-medium">{player1[metric] || 0}</div>
            </div>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{
                  width: `${((player1[metric] || 0) / 100) * 50}%`,
                  marginLeft: `${50 - ((player1[metric] || 0) / 100) * 50}%`,
                }}
              />
            </div>
            <div className="text-left w-20">
              <div className="font-medium">{player2[metric] || 0}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Avg. Talent Index</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-primary">
              {homeAverages.talent_index_score.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              vs {awayAverages.talent_index_score.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Technical Level</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-primary">
              {homeAverages.technical_proficiency.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              vs {awayAverages.technical_proficiency.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Tactical IQ</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-primary">
              {homeAverages.tactical_intelligence.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              vs {awayAverages.tactical_intelligence.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Physical Level</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-primary">
              {homeAverages.physical_attributes.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              vs {awayAverages.physical_attributes.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Player Performance
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allPlayers.map((player) => (
              <div
                key={player.player_id}
                onClick={() => setSelectedPlayer(player)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPlayer?.player_id === player.player_id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-bold">
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
                    <div className="text-xl font-bold text-primary">
                      {mockMetricsData[player.player_id]?.talent_index_score ||
                        0}
                    </div>
                    <div className="text-xs text-muted-foreground">GR4DE</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Metrics */}
        <div className="lg:col-span-2">
          {selectedPlayer ? (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {selectedPlayer.name} - Detailed Analysis
                  </h3>
                  <div className="text-3xl font-bold text-primary">
                    {mockMetricsData[selectedPlayer.player_id]
                      ?.talent_index_score || 0}
                  </div>
                </div>

                {/* Category Selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.keys(metricsCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {getCategoryLabel(category)}
                    </button>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="space-y-3">
                  {metricsCategories[selectedCategory].map((metric) => {
                    const value =
                      mockMetricsData[selectedPlayer.player_id]?.[metric];
                    return value !== undefined ? (
                      <MetricProgress
                        key={metric}
                        value={
                          typeof value === "number" ? value.toFixed(1) : value
                        }
                        label={getMetricLabel(metric)}
                        max={
                          metric.includes("distance") ||
                          metric.includes("speed")
                            ? metric === "max_speed"
                              ? 40
                              : metric === "total_distance_covered"
                              ? 15000
                              : metric.includes("distance")
                              ? 2500
                              : 100
                            : 100
                        }
                      />
                    ) : null;
                  })}
                </div>
              </div>

              {/* Player Comparison */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">
                  Comparison with Team Average
                </h4>
                <PlayerComparison
                  player1={mockMetricsData[selectedPlayer.player_id] || {}}
                  player2={calculateTeamAverages(
                    selectedPlayer.club_id === mockMatchData.home_club_id
                      ? homePlayers
                      : awayPlayers
                  )}
                  category={selectedCategory}
                />
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Select a Player
              </h3>
              <p className="text-muted-foreground">
                Choose a player from the list to view detailed performance
                metrics and analysis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Team Comparison */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Team Performance Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-3 text-primary">
              FC Barcelona Juvenil A
            </h4>
            <div className="space-y-3">
              {metricsCategories.core.map((metric) => (
                <MetricProgress
                  key={metric}
                  value={homeAverages[metric]?.toFixed(1) || 0}
                  label={getMetricLabel(metric)}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-muted-foreground">
              Real Madrid Juvenil A
            </h4>
            <div className="space-y-3">
              {metricsCategories.core.map((metric) => (
                <MetricProgress
                  key={metric}
                  value={awayAverages[metric]?.toFixed(1) || 0}
                  label={getMetricLabel(metric)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchAnalysisStep;
