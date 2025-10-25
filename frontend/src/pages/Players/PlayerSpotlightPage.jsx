// src/components/players/PlayerSpotlight.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Trophy, MapPin, Star } from "lucide-react";

const PlayerSpotlight = ({ player }) => {
  if (!player) return null;

  const matches = [
    {
      id: 1,
      date: "2024-03-15",
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      competition: "Premier League",
      venue: "Old Trafford",
      score: "2-1",
      performance: 8.5,
      videoUrl: "#",
      highlights: ["Goal (25')", "Assist (68')", "Man of the Match"],
    },
    {
      id: 2,
      date: "2024-03-08",
      homeTeam: "Manchester City",
      awayTeam: "Manchester United",
      competition: "Premier League",
      venue: "Etihad Stadium",
      score: "1-1",
      performance: 7.8,
      videoUrl: "#",
      highlights: ["Assist (52')", "4 Key Passes", "89% Pass Accuracy"],
    },
    {
      id: 3,
      date: "2024-03-01",
      homeTeam: "Manchester United",
      awayTeam: "Chelsea",
      competition: "FA Cup",
      venue: "Old Trafford",
      score: "3-0",
      performance: 9.2,
      videoUrl: "#",
      highlights: ["2 Goals", "Man of the Match", "94% Pass Accuracy"],
    },
    {
      id: 4,
      date: "2024-02-24",
      homeTeam: "Arsenal",
      awayTeam: "Manchester United",
      competition: "Premier League",
      venue: "Emirates Stadium",
      score: "2-2",
      performance: 8.1,
      videoUrl: "#",
      highlights: ["Goal (75')", "6 Successful Dribbles"],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Recent Performance Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Recent Performance Spotlight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">
                Matches Analyzed
              </div>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg">
              <div className="text-2xl font-bold text-green-500">8.4</div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">3</div>
              <div className="text-sm text-muted-foreground">
                Man of the Match
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match List */}
      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Match Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {match.score}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Final Score
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {match.homeTeam} vs {match.awayTeam}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {match.competition}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {match.venue}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {match.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div
                      className={`text-lg font-bold ${
                        match.performance >= 9
                          ? "text-green-500"
                          : match.performance >= 8
                          ? "text-blue-500"
                          : "text-orange-500"
                      }`}
                    >
                      {match.performance}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Play className="h-4 w-4" />
                    Watch Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Video Analysis Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-primary mx-auto mb-2" />
                    <div className="text-sm font-semibold">
                      {match.homeTeam} vs {match.awayTeam}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {match.date}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Performance Review
                    </span>
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerSpotlight;
