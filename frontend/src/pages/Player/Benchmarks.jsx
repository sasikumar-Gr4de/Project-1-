// src/pages/Player/Benchmarks.jsx - Updated with reusable components
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
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";

// Import reusable components
import MetricCard from "@/components/benchmarks/MetricCard";
import ProgressBarChart from "@/components/benchmarks/ProgressBarChart";
import PillarCard from "@/components/benchmarks/PillarCard";
import StrengthOpportunityCard from "@/components/benchmarks/StrengthOpportunityCard";

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

  // Mock data matching the screenshot exactly
  const performanceData = {
    overall: {
      yourScore: 0, // As shown in screenshot
      average: 72,
      top10: 88,
      bottom10: 45,
    },
    pillars: [
      {
        name: "Technical",
        yourScore: 92, // From screenshot
        average: 75,
        top10: 90,
        color: "from-[#60A5FA] to-[#3B82F6]",
      },
      {
        name: "Tactical",
        yourScore: 18, // From screenshot
        average: 70,
        top10: 85,
        color: "from-primary to-[#94D44A]",
      },
      {
        name: "Physical",
        yourScore: 85, // From screenshot
        average: 78,
        top10: 92,
        color: "from-[#F59E0B] to-[#D97706]",
      },
      {
        name: "Mental",
        yourScore: 32, // From screenshot
        average: 72,
        top10: 87,
        color: "from-[#8B5CF6] to-[#7C3AED]",
      },
    ],
  };

  const progressChartData = [
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
  ];

  const strengths = [
    {
      title: "Physical Dominance",
      description: "Your physical scores are in the top 15% for your position",
      improvement: "+8%",
      icon: Zap,
      gradient: "from-primary to-[#94D44A]",
    },
    {
      title: "Technical Proficiency",
      description: "Strong technical foundation compared to peers",
      improvement: "+5%",
      icon: Trophy,
      gradient: "from-primary to-[#94D44A]",
    },
  ];

  const opportunities = [
    {
      title: "Tactical Awareness",
      description: "Focus on positioning and decision-making",
      improvement: "-3%",
      icon: TrendingDown,
      gradient: "from-[#60A5FA] to-[#3B82F6]",
      badgeClass: "bg-[#60A5FA] text-white",
    },
    {
      title: "Mental Resilience",
      description: "Develop composure in high-pressure situations",
      improvement: "-2%",
      icon: Users,
      gradient: "from-[#60A5FA] to-[#3B82F6]",
      badgeClass: "bg-[#60A5FA] text-white",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent animate-pulse">
              Performance Benchmarks
            </h1>
            <p className="text-placeholder text-lg mt-2 font-['Orbitron'] animate-pulse">
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Performance Benchmarks
          </h1>
          <p className="text-placeholder text-lg mt-2 font-['Orbitron']">
            Compare your performance with Winger players in your app group
          </p>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link to="/reports">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Detailed Reports
          </Link>
        </Button>
      </div>

      {/* Key Metrics - Updated to match screenshot exactly */}
      <div className="grid gap-6 lg:grid-cols-4">
        <MetricCard
          title="Your Position"
          value={user?.position || "Winger"}
          description="Compared to 0 players"
          icon={Target}
          gradient="from-[#60A5FA] to-[#3B82F6]"
          valueColor="text-white"
        />

        <MetricCard
          title="Percentile Rank"
          value="No data available"
          description="No data available"
          icon={TrendingUp}
          gradient="from-primary to-[#94D44A]"
          valueColor="text-placeholder"
        />

        <MetricCard
          title="Growth Velocity"
          value="+12%"
          description="Improvement vs last quarter"
          icon={Star}
          gradient="from-[#F59E0B] to-[#D97706]"
          valueColor="text-[#F59E0B]"
        />

        <MetricCard
          title="Consistency Score"
          value="34%"
          description="Improvement vs last quarter"
          icon={Award}
          gradient="from-[#8B5CF6] to-[#7C3AED]"
          valueColor="text-[#8B5CF6]"
        />
      </div>

      {/* Overall Performance */}
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-primary" />
            Overall Performance Comparison
          </CardTitle>
          <CardDescription className="text-placeholder text-lg">
            How you stack up against Winger players in your demographics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white">
                Overall GRADE Score
              </span>
              <div className="flex items-center space-x-3">
                <Badge className="bg-[#343434] text-white border-[#343434]">
                  Yours: {performanceData.overall.yourScore}
                </Badge>
                <Badge className="bg-[#343434] text-white border-[#343434]">
                  Average: {performanceData.overall.average}
                </Badge>
                <Badge className="bg-[#343434] text-white border-[#343434]">
                  Top 10%: {performanceData.overall.top10}
                </Badge>
              </div>
            </div>

            <ProgressBarChart data={progressChartData} barHeight="h-3" />
          </div>

          {/* Performance Pillars */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {performanceData.pillars.map((pillar, index) => (
              <PillarCard
                key={index}
                name={pillar.name}
                yourScore={pillar.yourScore}
                average={pillar.average}
                top10={pillar.top10}
                color={pillar.color}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Opportunities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <StrengthOpportunityCard
          title="Key Strengths"
          description="Areas where you can excel compared to peers"
          items={strengths}
          icon={TrendingUp}
          gradient="from-primary to-[#94D44A]"
          badgeClass="bg-primary text-[#0F0F0E]"
          type="strength"
        />

        {/* Opportunities */}
        <StrengthOpportunityCard
          title="Growth Opportunities"
          description="Areas with the highest potential for improvement"
          items={opportunities}
          icon={Target}
          gradient="from-[#60A5FA] to-[#3B82F6]"
          badgeClass="bg-[#60A5FA] text-white"
          type="opportunity"
        />
      </div>
    </div>
  );
};

export default Benchmarks;
