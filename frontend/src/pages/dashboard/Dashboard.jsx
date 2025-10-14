import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  BarChart3,
  Users,
  Target,
  Trophy,
  PlayCircle,
  Shield,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  Zap,
  Download,
  Upload,
  Settings,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Calendar,
  Activity,
  TargetIcon,
  LineChart,
  PieChart,
  Radar,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart,
  Clock,
  TrendingDown,
  Crown,
  AwardIcon,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data - replace with actual API calls
  const dashboardStats = {
    totalPlayers: 247,
    matchesProcessed: 1248,
    reportsGenerated: 543,
    accuracyRate: 98.2,
  };

  const recentPlayers = [
    {
      id: 1,
      name: "Marcus Johnson",
      age: 17,
      position: "Forward",
      team: "United Academy",
      lastMatch: "2024-01-15",
      overallScore: 87,
      trend: "up",
    },
    {
      id: 2,
      name: "Liam Chen",
      age: 16,
      position: "Midfielder",
      team: "City Youth",
      lastMatch: "2024-01-14",
      overallScore: 92,
      trend: "up",
    },
    {
      id: 3,
      name: "Sarah Williams",
      age: 18,
      position: "Defender",
      team: "Rovers FC",
      lastMatch: "2024-01-13",
      overallScore: 78,
      trend: "down",
    },
    {
      id: 4,
      name: "James Rodriguez",
      age: 17,
      position: "Goalkeeper",
      team: "Athletic Youth",
      lastMatch: "2024-01-12",
      overallScore: 85,
      trend: "up",
    },
  ];

  const performanceMetrics = [
    { name: "Passing Accuracy", value: 87, percentile: 92, trend: 2.1 },
    { name: "Defensive Actions", value: 73, percentile: 78, trend: -1.2 },
    { name: "Shot Efficiency", value: 91, percentile: 95, trend: 3.4 },
    { name: "Aerial Duels", value: 68, percentile: 65, trend: 0.8 },
    { name: "Progressive Runs", value: 82, percentile: 88, trend: 4.2 },
  ];

  const quickActions = [
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Upload Match Data",
      description: "Add new match video or event data",
      link: "/upload",
      color: "blue",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Generate Report",
      description: "Create new player performance report",
      link: "/reports/generate",
      color: "green",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Manage Players",
      description: "View and edit player profiles",
      link: "/players",
      color: "purple",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "View Analytics",
      description: "Deep dive into performance metrics",
      link: "/analytics",
      color: "yellow",
    },
  ];

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-green-400";
    if (trend < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Gr4de</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("players")}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "players"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Players
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "reports"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Reports
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "analytics"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Analytics
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players, matches..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-64"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Settings className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, Coach!
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your players today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Players
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {dashboardStats.totalPlayers}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Matches Processed
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {dashboardStats.matchesProcessed}
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <PlayCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Reports Generated
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {dashboardStats.reportsGenerated}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+15% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Accuracy Rate
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {dashboardStats.accuracyRate}%
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Target className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+2.1% improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Frequently used tasks and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors group"
                    >
                      <div
                        className={`p-2 rounded-lg bg-${action.color}-500/20 w-fit mb-3`}
                      >
                        {action.icon}
                      </div>
                      <h3 className="font-semibold text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {action.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Players */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    Recent Players
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Recently analyzed players and their performance scores
                  </CardDescription>
                </div>
                <Link to="/players">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300"
                  >
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {player.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {player.age}y • {player.position} • {player.team}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <span className="text-lg font-bold text-white">
                              {player.overallScore}
                            </span>
                            <div
                              className={getTrendColor(
                                player.trend === "up" ? 1 : -1
                              )}
                            >
                              {getTrendIcon(player.trend === "up" ? 1 : -1)}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">Overall Score</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Performance Metrics */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  Key Metrics
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Average performance across all players
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-300">
                            {metric.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {metric.percentile}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${metric.value}%` }}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={`flex items-center ml-4 ${getTrendColor(
                          metric.trend
                        )}`}
                      >
                        {getTrendIcon(metric.trend)}
                        <span className="text-xs ml-1">
                          {metric.trend > 0 ? "+" : ""}
                          {metric.trend}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                  Top Performers
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Players with highest overall scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPlayers
                    .sort((a, b) => b.overallScore - a.overallScore)
                    .slice(0, 3)
                    .map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-sm">
                              {player.name}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {player.position}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {player.overallScore}
                          </div>
                          <div className="text-xs text-gray-400">Score</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-400" />
                  System Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  All systems operational
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      service: "API Server",
                      status: "operational",
                      latency: "42ms",
                    },
                    {
                      service: "Database",
                      status: "operational",
                      latency: "18ms",
                    },
                    {
                      service: "File Processing",
                      status: "operational",
                      latency: "156ms",
                    },
                    {
                      service: "Report Generation",
                      status: "operational",
                      latency: "89ms",
                    },
                  ].map((system, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">
                          {system.service}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {system.latency}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
