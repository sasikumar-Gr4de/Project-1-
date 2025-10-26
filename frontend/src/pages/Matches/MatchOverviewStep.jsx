import React from "react";
import {
  Calendar,
  MapPin,
  Trophy,
  Clock,
  BarChart3,
  Users,
} from "lucide-react";
import { mockMatchMetrics } from "@/mock/matchData";

const MatchOverviewStep = ({
  matchData,
  homeClub,
  awayClub,
  homePlayers,
  awayPlayers,
  currentStep,
}) => {
  // Guard render until required data exists
  if (!matchData || !homeClub || !awayClub) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground">Loading match overview...</div>
      </div>
    );
  }

  // Comparison Stats Data
  const comparisonStats = [
    {
      label: "Possession %",
      home: mockMatchMetrics.possession.home,
      away: mockMatchMetrics.possession.away,
    },
    {
      label: "Sense Impact Score",
      home: 86,
      away: 82,
    },
    {
      label: "Total Shots",
      home: mockMatchMetrics.shots.home,
      away: mockMatchMetrics.shots.away,
    },
    // ... other stats
  ];

  const ComparisonStat = ({ stat }) => {
    const isHomeBetter = stat.home > stat.away;
    const total = stat.home + stat.away;
    const homePercentage = total > 0 ? (stat.home / total) * 100 : 50;
    const awayPercentage = total > 0 ? (stat.away / total) * 100 : 50;

    return (
      <div className="bg-card p-3 rounded-lg">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div
              className={`text-lg font-bold text-center w-16 ${
                isHomeBetter ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {stat.home}
            </div>
            <span className="text-sm font-medium text-center text-foreground">
              {stat.label}
            </span>
            <div
              className={`text-lg font-bold text-center w-16 ${
                !isHomeBetter ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {stat.away}
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="flex h-2">
              <div
                className="bg-primary h-2 transition-all duration-500"
                style={{ width: `${homePercentage}%` }}
              />
              <div
                className="bg-muted-foreground/30 h-2 transition-all duration-500"
                style={{ width: `${awayPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Home</span>
            <span>Away</span>
          </div>
        </div>
      </div>
    );
  };

  const PlayerCard = ({ player, isHome }) => (
    <div
      className={`p-3 border rounded-lg transition-all hover:shadow-md ${
        isHome ? "border-primary/20 bg-primary/5" : "border-muted bg-card"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-bold text-foreground">
              {player.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">
              {player.full_name}
            </div>
            <div className="text-xs text-muted-foreground">
              {player.position} • #{player.jersey_number}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-bold ${
              isHome ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {player.metrics?.talent_index_score || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground">GR4DE</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-center text-xs">
        <div>
          <div className="font-semibold">{player.metrics?.goals || 0}</div>
          <div className="text-muted-foreground">Goals</div>
        </div>
        <div>
          <div className="font-semibold">{player.metrics?.assists || 0}</div>
          <div className="text-muted-foreground">Assists</div>
        </div>
        <div>
          <div className="font-semibold">
            {player.metrics?.pass_accuracy || 0}%
          </div>
          <div className="text-muted-foreground">Pass %</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-3">
      {/* Match Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <div className="text-xl font-bold">{homeClub.club_name}</div>
          </div>

          <div className="text-center mx-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {matchData.score_home} - {matchData.score_away}
            </div>
            <div className="text-sm text-muted-foreground">Full Time</div>
          </div>

          <div className="text-center flex-1">
            <div className="text-xl font-bold">{awayClub.club_name}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">
                {new Date(matchData.match_date).toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground">Date</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">{matchData.venue}</div>
              <div className="text-xs text-muted-foreground">Venue</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
            <Trophy className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">{matchData.competition}</div>
              <div className="text-xs text-muted-foreground">Competition</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">
                {matchData.duration_minutes}'
              </div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Players Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Statistics */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Match Statistics
            </h2>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {comparisonStats.map((stat, index) => (
              <ComparisonStat key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* Home Team Players */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {homeClub.short_name} Players
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {homePlayers.map((player) => (
              <PlayerCard
                key={player.player_id}
                player={player}
                isHome={true}
              />
            ))}
          </div>
        </div>

        {/* Away Team Players */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {awayClub.short_name} Players
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {awayPlayers.map((player) => (
              <PlayerCard
                key={player.player_id}
                player={player}
                isHome={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchOverviewStep;
