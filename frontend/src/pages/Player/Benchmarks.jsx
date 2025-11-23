import { useState, useEffect } from "react";
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

import StatsCard from "@/components/common/StatsCard";
import PillarCard from "@/components/benchmarks/PillarCard";
import StrengthOpportunityCard from "@/components/benchmarks/StrengthOpportunityCard";
import HorizontalChart from "@/components/benchmarks/HorizontalChart";

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

  const performanceData = {
    overall: {
      yourScore: 32,
      average: 72,
      top10: 88,
      bottom10: 45,
    },
    pillars: [
      {
        name: "Technical",
        yourScore: 92,
        average: 75,
        top10: 90,
        color: "from-[var(--color-blue-light)] to-[var(--color-blue)]",
      },
      {
        name: "Tactical",
        yourScore: 18,
        average: 70,
        top10: 85,
        color: "from-primary to-[var(--color-primary-500)]",
      },
      {
        name: "Physical",
        yourScore: 85,
        average: 78,
        top10: 92,
        color: "from-[var(--color-orange-light)] to-[var(--color-orange)]",
      },
      {
        name: "Mental",
        yourScore: 32,
        average: 72,
        top10: 87,
        color: "from-[var(--color-purple-light)] to-[var(--color-purple)]",
      },
    ],
  };

  const progressChartData = [
    {
      label: "Your Score",
      value: performanceData.overall.yourScore,
      color:
        "bg-gradient-to-t from-[var(--color-surface-4)] from-[var(--color-surface-3)]",
      textColor: "text-primary",
    },
    {
      label: "Average",
      value: performanceData.overall.average,
      color:
        "bg-gradient-to-t from-[var(--color-blue-light)] to-[var(--color-blue)]",
      textColor: "text-[var(--color-blue-light)]",
    },
    {
      label: "Top 10%",
      value: performanceData.overall.top10,
      color:
        "bg-gradient-to-t from-[var(--color-purple-light)] to-[var(--color-purple)]",
      textColor: "text-[var(--color-purple-light)]",
    },
    {
      label: "Bottom 10%",
      value: performanceData.overall.bottom10,
      color:
        "bg-gradient-to-t from-[var(--color-orange-light)] to-[var(--color-orange)]",
      textColor: "text-[var(--color-orange-light)]",
    },
  ];

  const strengths = [
    {
      title: "Physical Dominance",
      description: "Your physical scores are in the top 15% for your position",
      improvement: "+8%",
      icon: Zap,
      gradient: "from-primary to-secondary",
    },
    {
      title: "Technical Proficiency",
      description: "Strong technical foundation compared to peers",
      improvement: "+5%",
      icon: Trophy,
      gradient: "from-primary to-secondary",
    },
  ];

  const opportunities = [
    {
      title: "Tactical Awareness",
      description: "Focus on positioning and decision-making",
      improvement: "-3%",
      icon: TrendingDown,
      gradient: "from-[var(--color-blue-light)] to-[var(--color-blue)]",
    },
    {
      title: "Mental Resilience",
      description: "Develop composure in high-pressure situations",
      improvement: "-2%",
      icon: Users,
      gradient: "from-[var(--color-blue-light)] to-[var(--color-blue)]",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent animate-pulse">
              Performance Benchmarks
            </h1>
            <p className="text-placeholder text-base mt-1 font-['Orbitron'] animate-pulse">
              Loading benchmark data...
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-(--surface-2) border(--surface-1)"
            >
              <CardContent className="p-4">
                <div className="h-5 bg-(--surface-1) rounded w-1/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-(--surface-1) rounded w-full"></div>
                  <div className="h-3 bg-(--surface-1) rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Performance Benchmarks
          </h1>
          <p className="text-placeholder text-base mt-1 font-['Orbitron']">
            Compare your performance with Winger players in your app group
          </p>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-primary to-secondary text-[#0F0F0E] hover:from-primary-300 hover:to-primary font-semibold rounded-lg px-4 py-2 h-10 text-sm shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
        >
          <Link to="/reports">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Detailed Reports
          </Link>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Your Position"
          value={user?.position || "Winger"}
          description="Compared to 0 players"
          icon={Target}
          gradient="from-[var(--color-blue-light)] to-[var(--color-blue)]"
          valueColor="text-white"
          className="text-sm"
        />

        <StatsCard
          title="Percentile Rank"
          value={null}
          description={null}
          icon={TrendingUp}
          gradient="from-primary to-secondary"
          valueColor="text-primary"
          className="text-sm"
        />

        <StatsCard
          title="Growth Velocity"
          value="+12%"
          description="Improvement vs last quarter"
          icon={Star}
          gradient="from-[var(--color-orange-light)] to-[var(--color-orange)]"
          valueColor="text-[var(--color-orange-light)]"
          className="text-sm"
        />

        <StatsCard
          title="Consistency Score"
          value="34%"
          description="Improvement vs last quarter"
          icon={Award}
          gradient="from-[var(--color-purple-light)] to-[var(--color-purple)]"
          valueColor="text-[var(--color-blue-light)]"
          className="text-sm"
        />
      </div>

      {/* Overall Performance - Matched Heights */}
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-white flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Overall Performance Comparison
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <Badge className="bg-(--surface-1) text-white border(--surface-1) text-xs">
                Yours: {performanceData.overall.yourScore}
              </Badge>
              <Badge className="bg-(--surface-1) text-white border(--surface-1) text-xs">
                Average: {performanceData.overall.average}
              </Badge>
              <Badge className="bg-(--surface-1) text-white border(--surface-1) text-xs">
                Top 10%: {performanceData.overall.top10}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription className="text-placeholder text-base">
            How you stack up against Winger players in your demographics
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
            {/* Left Column - Vertical Progress Chart */}
            <div className="space-y-4">
              <div className="space-y-4">
                <span className="text-base font-semibold text-white mb-4">
                  Overall GR4DE Score
                </span>
                <div className="flex flex-col space-y-4 p-8 rounded-lg">
                  {progressChartData.map((item, index) => (
                    <HorizontalChart item={item} key={index} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Performance Pillars */}
            <div className="grid grid-cols-2 gap-3">
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
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Strengths */}
        <StrengthOpportunityCard
          title="Key Strengths"
          description="Areas where you can excel compared to peers"
          items={strengths}
          icon={TrendingUp}
          badgeClass="text-primary"
          type="strength"
        />

        {/* Opportunities */}
        <StrengthOpportunityCard
          title="Growth Opportunities"
          description="Areas with the highest potential for improvement"
          items={opportunities}
          icon={Target}
          badgeClass="text-[var(--color-blue-light)]"
          type="opportunity"
        />
      </div>
    </div>
  );
};

export default Benchmarks;
