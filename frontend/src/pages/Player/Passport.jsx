import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";

import IdentityCard from "@/components/passport/IdentityCard";
import PerformanceMetrics from "@/components/passport/PerformanceMetrics";
import ReportsSection from "@/components/passport/ReportsSection";
import MediaGallery from "@/components/passport/MediaGallery";
import FilterSidebar from "@/components/passport/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Eye, X, Share2 } from "lucide-react";

const mockPassportData = {
  player: {
    player_id: "770e8400-e29b-41d4-a716-446655440002",
    tier: "pro",
    passport_status: "verified",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2025-11-24T15:30:00Z",
  },

  identity: {
    first_name: "Alex",
    last_name: "Thompson",
    dob: "2005-08-15",
    nationality: "English",
    height_cm: 178,
    weight_kg: 72,
    preferred_foot: "right",
    positions: ["CM", "CAM", "CDM"],
    headshot_url:
      "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/avatars3402718.jpg-1762354884724-aim9o7oqqgb",
    guardian_name: "Sarah Thompson",
    guardian_email: "sarah.thompson@email.com",
    guardian_phone: "+44 7911 123456",
  },

  passport: {
    passport_id: "880e8400-e29b-41d4-a716-446655440000",
    current_club: "London FC Academy",
    season: "2025-26",
    squad_level: "U18",
    shirt_number: "8",
    notes: "Team captain, excellent leadership qualities",
  },

  verifications: [
    {
      verification_id: "990e8400-e29b-41d4-a716-446655440001",
      document_type: "passport",
      status: "approved",
      verification_badge: "identity_verified",
      created_at: "2024-01-20T00:00:00Z",
    },
    {
      verification_id: "990e8400-e29b-41d4-a716-446655440002",
      document_type: "club_letter",
      status: "approved",
      verification_badge: "club_verified",
      created_at: "2024-01-22T00:00:00Z",
    },
  ],

  metrics: [
    {
      metric_id: "aa0e8400-e29b-41d4-a716-446655440001",
      match_id: "880e8400-e29b-41d4-a716-446655440003",
      date: "2025-11-23",
      competition: "Premier League Academy",
      minutes: 90,
      gr4de_score: 87.5,
      benchmarks: {
        percentile_rank: 94,
        position: "central_midfielder",
        age_group: "u18",
        level: "academy",
      },
      gps_summary: {
        distance_m: 11240,
        hsr_m: 940,
        sprints: 15,
        top_speed_ms: 8.1,
      },
      event_summary: {
        passes_completed: 62,
        passes_attempted: 71,
        shots: 2,
        tackles: 5,
      },
      source: "stepout",
    },
    {
      metric_id: "aa0e8400-e29b-41d4-a716-446655440002",
      match_id: "880e8400-e29b-41d4-a716-446655440004",
      date: "2025-11-16",
      competition: "Youth Cup",
      minutes: 85,
      gr4de_score: 82.3,
      benchmarks: {
        percentile_rank: 88,
        position: "central_midfielder",
        age_group: "u18",
        level: "academy",
      },
      gps_summary: {
        distance_m: 10850,
        hsr_m: 820,
        sprints: 12,
        top_speed_ms: 7.9,
      },
      event_summary: {
        passes_completed: 58,
        passes_attempted: 65,
        shots: 1,
        tackles: 7,
      },
      source: "catapult",
    },
  ],

  tempo_data: [
    {
      tempo_id: "bb0e8400-e29b-41d4-a716-446655440001",
      match_id: "880e8400-e29b-41d4-a716-446655440003",
      date: "2025-11-23",
      tempo_index: 82.0,
      consistency: 88.5,
      avg_action_tempo: 18.5,
      peak_tempo_periods: [
        { start_minute: 12, end_minute: 18, tempo_index: 92 },
        { start_minute: 68, end_minute: 75, tempo_index: 88 },
      ],
    },
  ],

  reports: [
    {
      report_id: "cc0e8400-e29b-41d4-a716-446655440001",
      report_type: "match",
      period_start: "2025-11-23",
      period_end: "2025-11-23",
      pdf_url: "/api/reports/match-2025-11-23.pdf",
      created_at: "2025-11-24T10:00:00Z",
    },
    {
      report_id: "cc0e8400-e29b-41d4-a716-446655440002",
      report_type: "weekly",
      period_start: "2025-11-16",
      period_end: "2025-11-22",
      pdf_url: "/api/reports/weekly-2025-11-22.pdf",
      created_at: "2025-11-22T09:00:00Z",
    },
  ],

  media: [
    {
      media_id: "dd0e8400-e29b-41d4-a716-446655440001",
      media_type: "video",
      title: "Match Highlights vs Manchester United",
      description: "Best moments from the academy match",
      url: "https://www.youtube.com/watch?v=OIAwlZSJQ-o",
      created_at: "2025-11-24T14:00:00Z",
    },
    {
      media_id: "dd0e8400-e29b-41d4-a716-446655440002",
      media_type: "image",
      title: "Training Session",
      description: "Technical drills and exercises",
      url: "https://media.gettyimages.com/id/2247567358/ja/%E3%82%B9%E3%83%88%E3%83%83%E3%82%AF%E3%83%95%E3%82%A9%E3%83%88/riyadh-saudi-arabia-cristiano-ronaldo-of-team-al-nassr-fc-scores-their-fourth-goal-during.jpg?s=612x612&w=0&k=20&c=_WEU4D-4NUmVkZtnQ5Fji_-YFq7Is-QTiBT9n16lEWo=",
      created_at: "2025-11-20T11:00:00Z",
    },
    {
      media_id: "dd0e8400-e29b-41d4-a716-446655440003",
      media_type: "image",
      title: "Match Highlights vs Manchester United",
      description: "Best moments from the academy match",
      url: "https://media.gettyimages.com/id/2241061135/ja/%E3%82%B9%E3%83%88%E3%83%83%E3%82%AF%E3%83%95%E3%82%A9%E3%83%88/lisbon-portugal-cristiano-ronaldo-of-portugal-applauds-the-fans-after-the-draw-in-the-fifa.jpg?s=2048x2048&w=gi&k=20&c=7aJNCRhSaAHOcqFIxuleHUhOMhDGHb0nPafZRMBW_lU=",
      created_at: "2025-11-24T14:00:00Z",
    },
    {
      media_id: "dd0e8400-e29b-41d4-a716-446655440004",
      media_type: "image",
      title: "Training Session",
      description: "Technical drills and exercises",
      url: "https://media.gettyimages.com/id/2178130283/ja/%E3%82%B9%E3%83%88%E3%83%83%E3%82%AF%E3%83%95%E3%82%A9%E3%83%88/warsaw-poland-cristiano-ronaldo-reacts-after-scoring-his-team-second-goal-during-the-uefa.jpg?s=612x612&w=0&k=20&c=Wn4PBNwp0YKVqPdnHnDbP56RK8yodjHmcfBdKBzSTO8=",
      created_at: "2025-11-20T11:00:00Z",
    },
  ],
};

export const seasons = [
  { value: "2025-26", label: "2025-26" },
  { value: "2024-25", label: "2024-25" },
  { value: "2023-24", label: "2023-24" },
];

export const dateRanges = [
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "last-90-days", label: "Last 90 Days" },
  { value: "season", label: "Current Season" },
  { value: "custom", label: "Custom Range" },
];

const Passport = () => {
  const { user } = useUserStore();
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("2025-26");
  const [selectedDateRange, setSelectedDateRange] = useState("season");
  const [shareLink, setShareLink] = useState(null);

  useEffect(() => {
    loadPassportData();
  }, []);

  const loadPassportData = async () => {
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        setPassportData(mockPassportData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to load passport data:", error);
      setLoading(false);
    }
  };

  const createShareLink = async () => {
    // Simulate share link creation
    setShareLink({
      share_token: "share_123456789",
      share_url: `${window.location.origin}/public/passport/share_123456789`,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  const revokeShareLink = async () => {
    setShareLink(null);
  };

  const handleResetFilters = () => {
    setSelectedSeason("2025-26");
    setSelectedDateRange("season");
  };

  const filteredMetrics = React.useMemo(() => {
    if (!passportData?.metrics) return [];

    return passportData.metrics.filter((metric) => {
      // Simple filter logic - in real app, this would be more sophisticated
      const metricDate = new Date(metric.date);
      const now = new Date();

      switch (selectedDateRange) {
        case "last-7-days":
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
          return metricDate >= sevenDaysAgo;
        case "last-30-days":
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          return metricDate >= thirtyDaysAgo;
        case "last-90-days":
          const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
          return metricDate >= ninetyDaysAgo;
        default:
          return true;
      }
    });
  }, [passportData?.metrics, selectedDateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-placeholder">Loading passport data...</span>
      </div>
    );
  }

  if (!passportData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Passport Not Found
        </h2>
        <p className="text-placeholder">
          Unable to load passport data. Please try again later.
        </p>
      </div>
    );
  }

  const {
    player,
    identity,
    passport,
    verifications,
    metrics,
    tempo_data,
    reports,
    media,
  } = passportData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Player Passport
          </h1>
          <p className="text-(--muted-text) text-lg mt-2 font-['Orbitron']">
            Your comprehensive football profile and performance analytics
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Content - 3/4 width */}
        <div className="lg:col-span-3 space-y-6">
          {/* Identity Information */}
          <IdentityCard
            identity={identity}
            passport={passport}
            verifications={verifications}
            player={player}
          />

          {/* Performance Metrics */}
          <PerformanceMetrics
            metrics={filteredMetrics}
            tempoData={tempo_data}
            tier={player?.tier}
          />

          {/* Reports Section */}
          <ReportsSection reports={reports} />

          {/* Media Gallery */}
          <MediaGallery media={media} />
        </div>

        {/* Sidebar - 1/4 width */}
        <div className="lg:col-span-1">
          <FilterSidebar
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
            onResetFilters={handleResetFilters}
            metrics={filteredMetrics}
          />

          {/* Share Profile Section */}
          <div className="bg-(--surface-1) border border-(--surface-2) hover:border-primary/30 transition-all duration-300 rounded-xl p-6 mt-5">
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center">
                <Share2 className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Share Your Passport
                </h3>
                <p className="text-placeholder max-w-md mx-auto">
                  Create a public link to share your profile with coaches and
                  clubs
                </p>
              </div>

              {/* Share Link Display */}
              {shareLink && (
                <div className="space-y-3">
                  <div className="  border border-(--surface-2) rounded-lg p-4">
                    <p className="text-xs text-placeholder mb-2 font-medium">
                      Expires:{" "}
                      {new Date(shareLink.expires_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-placeholder"></p>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={shareLink.share_url}
                        readOnly
                        className="bg-[#343434] border-(--surface-2) text-white text-sm font-mono flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(shareLink.share_url)
                        }
                        className="bg-(--surface-3) border-(--surface-2) text-white hover:bg-[#505050] shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                {shareLink ? (
                  <>
                    <Button
                      onClick={() => window.open(shareLink.share_url, "_blank")}
                      className="bg-linear-to-r from-primary to-secondary text-[#0F0F0E] hover:from-secondary hover:to-primary font-semibold flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Public Profile
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={revokeShareLink}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Revoke Link
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      createShareLink();
                    }}
                    className="bg-linear-to-r from-primary to-secondary text-(--ink) hover:from-secondary hover:to-primary font-semibold w-full max-w-xs mx-auto"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Create Share Link
                  </Button>
                )}
              </div>

              {/* Additional Info */}
              <div className="text-center pt-4 border-t border-(--surface-2)">
                <p className="text-xs text-placeholder">
                  Share links are valid for 7 days and can be revoked at any
                  time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passport;
