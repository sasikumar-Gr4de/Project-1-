// src/pages/Matches/MatchOverviewStep.jsx
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Clock,
  BarChart3,
  Target,
  Zap,
  Shield,
  Crosshair,
} from "lucide-react";
import {
  mockMatchData,
  mockClubsData,
  mockPlayersData,
  mockMatchMetrics,
  mockMatchEvents,
} from "@/mock/matchData";

const MatchOverviewStep = ({ matchId, currentStep }) => {
  const match = mockMatchData;
  const homeClub = mockClubsData[match.home_club_id];
  const awayClub = mockClubsData[match.away_club_id];
  const homePlayers = mockPlayersData[match.home_club_id] || [];
  const awayPlayers = mockPlayersData[match.away_club_id] || [];

  if (currentStep !== 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Step Not Available
        </h3>
        <p className="text-muted-foreground">
          Please complete the preparation steps to access match overview.
        </p>
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subValue,
    color = "primary",
  }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`h-5 w-5 text-${color}`} />
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground">{subValue}</div>
      )}
    </div>
  );

  const PlayerCard = ({ player, isHome }) => (
    <div
      className={`p-4 border rounded-lg transition-all hover:shadow-md ${
        isHome ? "border-primary/20 bg-primary/5" : "border-muted bg-card"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-bold text-foreground">
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
            {player.metrics.talent_index_score}
          </div>
          <div className="text-xs text-muted-foreground">GR4DE</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-semibold">
            {player.metrics.goals || 0}
          </div>
          <div className="text-xs text-muted-foreground">Goals</div>
        </div>
        <div>
          <div className="text-sm font-semibold">
            {player.metrics.assists || 0}
          </div>
          <div className="text-xs text-muted-foreground">Assists</div>
        </div>
        <div>
          <div className="text-sm font-semibold">
            {player.metrics.pass_accuracy}%
          </div>
          <div className="text-xs text-muted-foreground">Pass %</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-3">
      {/* Section 1: Overall Match Metrics */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Match Overview & Statistics
        </h2>

        {/* Score Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-muted/30 rounded-xl">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold">{homeClub.name}</div>
            <div className="text-sm text-muted-foreground">
              Home • {homeClub.formation}
            </div>
          </div>

          <div className="text-center mx-4">
            <div className="text-5xl font-bold text-primary mb-2">
              {match.score_home} - {match.score_away}
            </div>
            <div className="text-sm text-muted-foreground">Full Time</div>
          </div>

          <div className="text-center flex-1">
            <div className="text-2xl font-bold">{awayClub.name}</div>
            <div className="text-sm text-muted-foreground">
              Away • {awayClub.formation}
            </div>
          </div>
        </div>

        {/* Match Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">
                {new Date(match.match_date).toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground">Date</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">{match.venue}</div>
              <div className="text-xs text-muted-foreground">Venue</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
            <Trophy className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">{match.competition}</div>
              <div className="text-xs text-muted-foreground">Competition</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">
                {match.duration_minutes}'
              </div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
        </div>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            icon={BarChart3}
            label="Possession"
            value={`${mockMatchMetrics.possession.home}%`}
            subValue={`${mockMatchMetrics.possession.away}%`}
          />
          <StatCard
            icon={Target}
            label="Shots"
            value={mockMatchMetrics.shots.home}
            subValue={mockMatchMetrics.shots.away}
          />
          <StatCard
            icon={Crosshair}
            label="Shots on Target"
            value={mockMatchMetrics.shots_on_target.home}
            subValue={mockMatchMetrics.shots_on_target.away}
          />
          <StatCard
            icon={Zap}
            label="Pass Accuracy"
            value={`${mockMatchMetrics.pass_accuracy.home}%`}
            subValue={`${mockMatchMetrics.pass_accuracy.away}%`}
          />
          <StatCard
            icon={Shield}
            label="Tackles Won"
            value={mockMatchMetrics.tackles.home}
            subValue={mockMatchMetrics.tackles.away}
          />
        </div>
      </div>

      {/* Section 2: Home Club Players */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {homeClub.name} - Key Performers
          <span className="text-sm font-normal text-muted-foreground ml-2">
            Formation: {homeClub.formation} • Style: {homeClub.style}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {homePlayers.map((player) => (
            <PlayerCard key={player.player_id} player={player} isHome={true} />
          ))}
        </div>

        {/* Team Performance Summary */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-primary mb-2">
            Team Performance Summary
          </h4>
          <div className="text-sm text-muted-foreground">
            Dominant possession-based performance with excellent ball
            circulation. High pressing effectiveness led to multiple scoring
            opportunities.
          </div>
        </div>
      </div>

      {/* Section 3: Away Club Players */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {awayClub.name} - Key Performers
          <span className="text-sm font-normal text-muted-foreground ml-2">
            Formation: {awayClub.formation} • Style: {awayClub.style}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {awayPlayers.map((player) => (
            <PlayerCard key={player.player_id} player={player} isHome={false} />
          ))}
        </div>

        {/* Team Performance Summary */}
        <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg">
          <h4 className="font-semibold mb-2">Team Performance Summary</h4>
          <div className="text-sm text-muted-foreground">
            Resilient defensive performance with effective counter-attacking.
            Struggled to maintain possession but created dangerous opportunities
            on transitions.
          </div>
        </div>
      </div>

      {/* Match Events Timeline */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Match Timeline</h2>
        <div className="space-y-3">
          {mockMatchEvents.map((event, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                event.team === "home"
                  ? "border-primary/20 bg-primary/5"
                  : event.team === "away"
                  ? "border-muted bg-muted/10"
                  : "border-border bg-card"
              }`}
            >
              <span className="font-mono text-sm bg-muted px-3 py-1 rounded min-w-16 text-center">
                {event.time}
              </span>
              <span className="flex-1">{event.event}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  event.type === "goal"
                    ? "bg-green-500/20 text-green-500"
                    : event.type === "card"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : event.type === "substitution"
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {event.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchOverviewStep;
