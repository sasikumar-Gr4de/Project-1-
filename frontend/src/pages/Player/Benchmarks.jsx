// Benchmarks.jsx - Updated with clear, beautiful design
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
  Zap,
  Trophy,
  TrendingDown,
  Circle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";

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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold  font-['Inter_Tight'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent animate-pulse">
              Performance Benchmarks
            </h1>
            <p className="text-[#B0AFAF] text-lg mt-2 font-['Inter_Tight'] animate-pulse">
              Loading benchmark data...
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-[#262626] border-[#343434]"
            >
              <CardContent className="p-6">
                <div className="h-6 bg-[#343434] rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-[#343434] rounded w-full"></div>
                  <div className="h-4 bg-[#343434] rounded w-3/4"></div>
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

  // Mock data for demonstration
  const performanceData = {
    overall: {
      yourScore: latestScore || 0,
      average: 72,
      top10: 88,
      bottom10: 45,
    },
    pillars: [
      {
        name: "Technical",
        yourScore: 82,
        average: 75,
        top10: 90,
        color: "from-[#60A5FA] to-[#3B82F6]",
      },
      {
        name: "Tactical",
        yourScore: 78,
        average: 70,
        top10: 85,
        color: "from-primary to-[#94D44A]",
      },
      {
        name: "Physical",
        yourScore: 85,
        average: 78,
        top10: 92,
        color: "from-[#F59E0B] to-[#D97706]",
      },
      {
        name: "Mental",
        yourScore: 80,
        average: 72,
        top10: 87,
        color: "from-[#8B5CF6] to-[#7C3AED]",
      },
    ],
  };

  const strengths = [
    {
      title: "Physical Dominance",
      description: "Your physical scores are in the top 15% for your position",
      improvement: "+8%",
      icon: Zap,
    },
    {
      title: "Technical Proficiency",
      description: "Strong technical foundation compared to peers",
      improvement: "+5%",
      icon: Trophy,
    },
  ];

  const opportunities = [
    {
      title: "Tactical Awareness",
      description: "Focus on positioning and decision-making",
      improvement: "-3%",
      icon: TrendingDown,
    },
    {
      title: "Mental Resilience",
      description: "Develop composure in high-pressure situations",
      improvement: "-2%",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold  font-['Inter_Tight'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Performance Benchmarks
          </h1>
          <p className="text-[#B0AFAF] text-lg mt-2 font-['Inter_Tight']">
            Compare your performance with {user?.position || "similar"} players
            in your age group
          </p>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300 font-['Inter_Tight']"
        >
          <Link to="/reports">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Detailed Reports
          </Link>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter_Tight']">
              Your Position
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-['Inter_Tight']">
              {user?.position || "--"}
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter_Tight']">
              Compared to {benchmarks ? "1,000+" : "0"} players
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter_Tight']">
              Percentile Rank
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-primary to-[#94D44A] rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-[#0F0F0E]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-['Inter_Tight']">
              {latestScore ? "Top 25%" : "--"}
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter_Tight']">
              {latestScore ? "Better than 75% of peers" : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter_Tight']">
              Growth Velocity
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center shadow-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F59E0B] font-['Inter_Tight']">
              +12%
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter_Tight']">
              Improvement vs last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-white font-['Inter_Tight']">
              Consistency Score
            </CardTitle>
            <div className="w-10 h-10 bg-linear-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5CF6] font-['Inter_Tight']">
              84%
            </div>
            <p className="text-xs text-[#B0AFAF] mt-2 font-['Inter_Tight']">
              Performance stability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Performance */}
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white font-['Inter_Tight'] flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-primary" />
            Overall Performance Comparison
          </CardTitle>
          <CardDescription className="text-[#B0AFAF] text-lg font-['Inter_Tight']">
            How you stack up against {user?.position} players in your
            demographic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white font-['Inter_Tight']">
                Overall GR4DE Score
              </span>
              <div className="flex items-center space-x-3">
                <Badge className="bg-[#343434] text-white border-[#343434] font-['Inter_Tight']">
                  You: {performanceData.overall.yourScore || 0}
                </Badge>
                <Badge className="bg-[#343434] text-white border-[#343434] font-['Inter_Tight']">
                  Average: {performanceData.overall.average}
                </Badge>
                <Badge className="bg-[#343434] text-white border-[#343434] font-['Inter_Tight']">
                  Top 10%: {performanceData.overall.top10}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Your Score",
                  value: performanceData.overall.yourScore,
                  color: "bg-linear-to-r from-primary to-[#94D44A]",
                },
                {
                  label: "Average",
                  value: performanceData.overall.average,
                  color: "bg-[#60A5FA]",
                },
                {
                  label: "Top 10%",
                  value: performanceData.overall.top10,
                  color: "bg-linear-to-r from-[#8B5CF6] to-[#7C3AED]",
                },
                {
                  label: "Bottom 10%",
                  value: performanceData.overall.bottom10,
                  color: "bg-[#F59E0B]",
                },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-medium font-['Inter_Tight']">
                      {item.label}
                    </span>
                    <span className="text-[#B0AFAF] font-['Inter_Tight']">
                      {item.value}
                    </span>
                  </div>
                  <Progress
                    value={item.value}
                    className={`h-3 ${item.color} rounded-full`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Performance Pillars */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {performanceData.pillars.map((pillar, index) => (
              <Card key={index} className="bg-[#1A1A1A] border-[#343434]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-white font-['Inter_Tight']">
                    {pillar.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold bg-linear-to-r ${pillar.color} bg-clip-text text-transparent font-['Inter_Tight']`}
                    >
                      {pillar.yourScore}
                    </div>
                    <div className="text-sm text-[#B0AFAF] mt-1 font-['Inter_Tight']">
                      Your Score
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#B0AFAF] font-['Inter_Tight']">
                        Avg: {pillar.average}
                      </span>
                      <span className="text-[#B0AFAF] font-['Inter_Tight']">
                        Top: {pillar.top10}
                      </span>
                    </div>
                    <Progress
                      value={pillar.yourScore}
                      className={`h-2 bg-linear-to-r ${pillar.color} rounded-full`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Opportunities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white font-['Inter_Tight'] flex items-center">
              <div className="w-8 h-8 bg-linear-to-br from-primary to-[#94D44A] rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-[#0F0F0E]" />
              </div>
              Key Strengths
            </CardTitle>
            <CardDescription className="text-[#B0AFAF] font-['Inter_Tight']">
              Areas where you excel compared to peers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-[#1A1A1A] rounded-xl border border-[#343434]"
              >
                <div className="w-12 h-12 bg-linear-to-br from-primary to-[#94D44A] rounded-xl flex items-center justify-center shrink-0">
                  <strength.icon className="w-6 h-6 text-[#0F0F0E]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white font-['Inter_Tight']">
                      {strength.title}
                    </h4>
                    <Badge className="bg-primary text-[#0F0F0E] font-medium font-['Inter_Tight']">
                      {strength.improvement}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#B0AFAF] mt-1 font-['Inter_Tight']">
                    {strength.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card className="bg-[#262626] border-[#343434]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white font-['Inter_Tight'] flex items-center">
              <div className="w-8 h-8 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-lg flex items-center justify-center mr-3">
                <Target className="w-4 h-4 text-white" />
              </div>
              Growth Opportunities
            </CardTitle>
            <CardDescription className="text-[#B0AFAF] font-['Inter_Tight']">
              Areas with the highest potential for improvement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-[#1A1A1A] rounded-xl border border-[#343434]"
              >
                <div className="w-12 h-12 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-xl flex items-center justify-center shrink-0">
                  <opportunity.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white font-['Inter_Tight']">
                      {opportunity.title}
                    </h4>
                    <Badge className="bg-[#60A5FA] text-white font-medium font-['Inter_Tight']">
                      {opportunity.improvement}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#B0AFAF] mt-1 font-['Inter_Tight']">
                    {opportunity.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Benchmarks;
