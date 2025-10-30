import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Award,
  Star,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Benchmarks = () => {
  const { user } = useAuthStore();
  const { dashboardData, fetchDashboard, isLoading } = useUserStore();
  const [benchmarkData, setBenchmarkData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await fetchDashboard();
    } catch (error) {
      console.error("Failed to fetch benchmark data:", error);
    }
  };

  useEffect(() => {
    if (dashboardData) {
      setBenchmarkData(dashboardData);
    }
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Performance Benchmarks
          </h1>
          <p className="text-[#B0AFAF]">Loading benchmark data...</p>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-[#262626] border-[#404040]"
            >
              <CardContent className="p-6">
                <div className="h-6 bg-[#404040] rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-[#404040] rounded w-full"></div>
                  <div className="h-4 bg-[#404040] rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { benchmarks, recentReports } = benchmarkData || {};
  const latestScore = recentReports?.[0]?.overall_score;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Performance Benchmarks
          </h1>
          <p className="text-[#B0AFAF]">
            Compare your performance with {user?.position} players in your age
            group
          </p>
        </div>
        <Button
          variant="outline"
          asChild
          className="bg-[#262626] border-[#404040] text-white hover:bg-[#333333]"
        >
          <a href="/reports">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Detailed Reports
          </a>
        </Button>
      </div>

      {/* Overall Comparison */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Your Position
            </CardTitle>
            <Target className="h-4 w-4 text-[#B0AFAF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {user?.position || "--"}
            </div>
            <p className="text-xs text-[#B0AFAF]">
              Compared to {benchmarks ? "1,000+" : "0"} players
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Percentile Rank
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#B0AFAF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {latestScore ? "Top 25%" : "--"}
            </div>
            <p className="text-xs text-[#B0AFAF]">
              {latestScore ? "Better than 75% of peers" : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Growth Velocity
            </CardTitle>
            <Star className="h-4 w-4 text-[#B0AFAF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#A8E55C]">+12%</div>
            <p className="text-xs text-[#B0AFAF]">
              Improvement vs last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark Comparison */}
      <Card className="bg-[#262626] border-[#404040]">
        <CardHeader>
          <CardTitle className="text-white">Performance Comparison</CardTitle>
          <CardDescription className="text-[#B0AFAF]">
            How you stack up against {user?.position} players in your
            demographic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Score Comparison */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  Overall GR4DE Score
                </span>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="bg-[#333333] text-white border-[#404040]"
                  >
                    You: {latestScore || "--"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-[#404040] text-[#B0AFAF]"
                  >
                    Avg: 72
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-[#404040] text-[#B0AFAF]"
                  >
                    Top 10%: 88
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#B0AFAF]">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
                <Progress
                  value={latestScore || 0}
                  className="h-3 bg-[#404040]"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-[#B0AFAF]">Bottom 10% (45)</span>
                  <span className="text-[#B0AFAF]">Top 10% (88)</span>
                </div>
              </div>
            </div>

            {/* Pillar Comparisons */}
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Technical", yourScore: 82, average: 75, top10: 90 },
                { name: "Tactical", yourScore: 78, average: 70, top10: 85 },
                { name: "Physical", yourScore: 85, average: 78, top10: 92 },
                { name: "Mental", yourScore: 80, average: 72, top10: 87 },
              ].map((pillar) => (
                <div
                  key={pillar.name}
                  className="space-y-3 p-4 border rounded-lg bg-[#1A1A1A] border-[#404040]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">
                      {pillar.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-[#333333] text-white border-[#404040]"
                      >
                        You: {pillar.yourScore}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white">You</span>
                      <span className="text-white">{pillar.yourScore}</span>
                    </div>
                    <Progress
                      value={pillar.yourScore}
                      className="h-2 bg-[#404040]"
                    />

                    <div className="flex justify-between text-xs text-[#B0AFAF]">
                      <span>Average</span>
                      <span>{pillar.average}</span>
                    </div>
                    <Progress
                      value={pillar.average}
                      className="h-2 bg-[#333333]"
                    />

                    <div className="flex justify-between text-xs text-[#A8E55C]">
                      <span>Top 10%</span>
                      <span>{pillar.top10}</span>
                    </div>
                    <Progress
                      value={pillar.top10}
                      className="h-2 bg-[#A8E55C]/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Award className="w-5 h-5 text-[#A8E55C]" />
              <span>Your Advantages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 p-3 bg-[#A8E55C]/10 rounded-lg border border-[#A8E55C]/20">
                <div className="w-2 h-2 bg-[#A8E55C] rounded-full"></div>
                <div>
                  <span className="font-medium text-white">
                    Physical Dominance
                  </span>
                  <p className="text-sm text-[#B0AFAF]">
                    Your physical scores are in the top 15% for your position
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-3 p-3 bg-[#A8E55C]/10 rounded-lg border border-[#A8E55C]/20">
                <div className="w-2 h-2 bg-[#A8E55C] rounded-full"></div>
                <div>
                  <span className="font-medium text-white">
                    Technical Proficiency
                  </span>
                  <p className="text-sm text-[#B0AFAF]">
                    Strong technical foundation compared to peers
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#404040]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Users className="w-5 h-5 text-[#60A5FA]" />
              <span>Development Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 p-3 bg-[#60A5FA]/10 rounded-lg border border-[#60A5FA]/20">
                <div className="w-2 h-2 bg-[#60A5FA] rounded-full"></div>
                <div>
                  <span className="font-medium text-white">
                    Tactical Awareness
                  </span>
                  <p className="text-sm text-[#B0AFAF]">
                    Focus on positioning and decision-making
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-3 p-3 bg-[#60A5FA]/10 rounded-lg border border-[#60A5FA]/20">
                <div className="w-2 h-2 bg-[#60A5FA] rounded-full"></div>
                <div>
                  <span className="font-medium text-white">
                    Mental Resilience
                  </span>
                  <p className="text-sm text-[#B0AFAF]">
                    Develop composure in high-pressure situations
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade CTA */}
      <Card className="bg-linear-to-r from-primary/10 to-primary/5 border-primary/20 bg-[#262626] ">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Unlock Advanced Analytics
              </h3>
              <p className="text-[#B0AFAF]">
                Upgrade to PRO for detailed peer comparisons, trend analysis,
                and personalized insights
              </p>
            </div>
            <Button
              asChild
              className="bg-[#A8E55C] text-black hover:bg-[#94D44A]"
            >
              <a href="/subscription">Upgrade Plan</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Benchmarks;
