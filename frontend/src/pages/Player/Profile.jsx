import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AvatarUpload from "@/components/common/AvatarUpload";
import {
  User,
  Calendar,
  MapPin,
  Building,
  Target,
  Save,
  Edit3,
  Award,
  TrendingUp,
  FileText,
  Crown,
  Clock,
  Mail,
  Shield,
} from "lucide-react";
import {
  FOOTBALL_POSITIONS,
  COUNTRIES,
  ACADEMIES,
  TIER_PLANS,
} from "@/utils/constants";
import { calculateAge } from "@/utils/helper.utils";
import { useToast } from "@/contexts/ToastContext";

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const { dashboardData, fetchDashboard } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [performanceStats, setPerformanceStats] = useState({
    totalReports: 0,
    averageScore: 0,
    progress: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        player_name: user.player_name || "",
        date_of_birth: user.date_of_birth || "",
        position: user.position || "",
        academy: user.academy || "",
        country: user.country || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      const { recentReports, progressData } = dashboardData;

      const totalReports = recentReports?.length || 0;
      const averageScore = recentReports?.length
        ? recentReports.reduce(
            (sum, report) => sum + (report.overall_score || 0),
            0
          ) / recentReports.length
        : 0;

      const progress =
        progressData?.length > 1
          ? progressData[progressData.length - 1].overall_score -
            progressData[0].overall_score
          : 0;

      setPerformanceStats({
        totalReports,
        averageScore: Math.round(averageScore),
        progress,
      });
    }
  }, [dashboardData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
      setIsEditing(false);
      fetchDashboard();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      player_name: user.player_name || "",
      date_of_birth: user.date_of_birth || "",
      position: user.position || "",
      academy: user.academy || "",
      country: user.country || "",
      avatar_url: user.avatar_url || "",
    });
    setIsEditing(false);
  };

  const handleAvatarUpdate = (result) => {
    if (result.success) {
      setFormData((prev) => ({ ...prev, avatar_url: result.url }));
    }
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case TIER_PLANS.ELITE:
        return "bg-linear-to-r from-(--color-orange-light) to-(--color-orange) text-(--ink)";
      case TIER_PLANS.PRO:
        return "bg-linear-to-r from-primary to-secondary text-(--ink)";
      case TIER_PLANS.BASIC:
        return "bg-linear-to-r from-(--color-blue-light) to-(--color-blue) text-white";
      default:
        return "bg-(--surface-2) text-white";
    }
  };

  // Custom styles for consistent input and select sizing
  const inputStyles =
    "h-14 text-base bg-(--surface-0) border-2 border-(--surface-2) text-white placeholder:text-(--muted-text) rounded-xl focus:border-primary focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300 w-full";

  const selectTriggerStyles =
    "h-14 text-base bg-(--surface-0) border-2 border-(--surface-2) text-white rounded-xl focus:border-primary focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300 w-full [&>span]:flex [&>span]:items-center [&>span]:h-full";

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-(--muted-text) font-['Orbitron'] text-lg">
            Loading profile...
          </p>
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
            Player Profile
          </h1>
          <p className="text-(--muted-text) text-lg mt-2 font-['Orbitron']">
            Manage your personal information and performance preferences
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-linear-to-r from-primary to-(--accent-2) text-(--ink) hover:from-(--accent-2) hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-(--surface-1) border-(--surface-2) text-white hover:bg-(--surface-2) hover:border-primary font-semibold rounded-xl px-6 py-3 h-12 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-linear-to-r from-primary to-(--accent-2) text-(--ink) hover:from-(--accent-2) hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Overview Card */}
          <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <AvatarUpload
                  onUpload={handleAvatarUpdate}
                  disabled={!isEditing}
                  existingUrl={user.avatar_url}
                  folder="avatars"
                  size="xl"
                />
                {!isEditing && (
                  <p className="text-sm text-(--muted-text) text-center">
                    Click edit to change your profile picture
                  </p>
                )}
              </div>

              {/* Account Information */}
              <div className="space-y-4 pt-4 border-t border-(--surface-2)">
                {/* Plan Tier */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-(--muted-text)">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Subscription Plan
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`${getTierBadgeColor(
                        user.tier_plan
                      )} font-semibold px-3 py-1`}
                    >
                      {user.tier_plan?.toUpperCase() || "BASIC"}
                    </Badge>
                    {user.tier_plan !== TIER_PLANS.ELITE && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-(--surface-2) border-(--surface-2) text-primary hover:bg-primary hover:text-(--ink) font-semibold text-xs"
                        asChild
                      >
                        <a href="/subscription">Upgrade</a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-(--muted-text)">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-white font-semibold text-sm truncate">
                    {user.email || "--"}
                  </p>
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-(--muted-text)">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Member Since</span>
                    <p className="text-white font-semibold text-sm">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )
                        : "--"}
                      &nbsp;&nbsp;
                      <Badge
                        variant="outline"
                        className="ml-2 text-green-400 border-green-400"
                      >
                        Verified
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-(--muted-text)">Reports</span>
                <span className="text-white font-bold">
                  {performanceStats.totalReports}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-(--muted-text)">Avg. Score</span>
                <span className="text-primary font-bold">
                  {performanceStats.averageScore || "--"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-(--muted-text)">Progress</span>
                <span
                  className={`font-bold ${
                    performanceStats.progress > 0
                      ? "text-primary"
                      : "text-(--color-orange-light)"
                  }`}
                >
                  {performanceStats.progress > 0 ? "+" : ""}
                  {performanceStats.progress || 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Details & Performance */}
        <div className="lg:col-span-3 space-y-8">
          {/* Personal Information Card */}
          <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-(--muted-text)">
                {isEditing
                  ? "Update your personal details and playing profile"
                  : "Your basic information and football profile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Player Name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted-text) z-10" />
                      <Input
                        value={formData.player_name || ""}
                        onChange={(e) =>
                          handleInputChange("player_name", e.target.value)
                        }
                        className={`${inputStyles} pl-12`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-(--surface-0) border-2 border-(--surface-2) rounded-xl h-14">
                      <User className="h-5 w-5 text-primary" />
                      <span className="text-white font-semibold">
                        {user.player_name || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted-text) z-10" />
                      <Input
                        type="date"
                        value={formData.date_of_birth || ""}
                        onChange={(e) =>
                          handleInputChange("date_of_birth", e.target.value)
                        }
                        className={`${inputStyles} pl-12`}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-(--surface-0) border-2 border-(--surface-2) rounded-xl h-14">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <span className="text-white font-semibold block">
                          {user.date_of_birth
                            ? new Date(user.date_of_birth).toLocaleDateString()
                            : "Not set"}
                          &nbsp;
                          {user.date_of_birth && (
                            <span className="text-(--muted-text) text-sm">
                              {calculateAge(user.date_of_birth)} years old
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">
                    Position
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted-text) z-10" />
                      <Select
                        value={formData.position || ""}
                        onValueChange={(value) =>
                          handleInputChange("position", value)
                        }
                      >
                        <SelectTrigger
                          className={`${selectTriggerStyles} pl-12`}
                        >
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent className="bg-(--surface-1) border-2 border-(--surface-2) text-white shadow-xl max-h-60">
                          {FOOTBALL_POSITIONS.map((position) => (
                            <SelectItem
                              key={position}
                              value={position}
                              className="focus:bg-(--surface-2) focus:text-primary py-3 text-base"
                            >
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-(--surface-0) border-2 border-(--surface-2) rounded-xl h-14">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="text-white font-semibold">
                        {user.position || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">
                    Country
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted-text) z-10" />
                      <Select
                        value={formData.country || ""}
                        onValueChange={(value) =>
                          handleInputChange("country", value)
                        }
                      >
                        <SelectTrigger
                          className={`${selectTriggerStyles} pl-12`}
                        >
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-(--surface-1) border-2 border-(--surface-2) text-white shadow-xl max-h-60">
                          {COUNTRIES.map((country) => (
                            <SelectItem
                              key={country}
                              value={country}
                              className="focus:bg-(--surface-2) focus:text-primary py-3 text-base"
                            >
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-(--surface-0) border-2 border-(--surface-2) rounded-xl h-14">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-white font-semibold">
                        {user.country || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Academy */}
                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-medium text-white">
                    Academy/Club
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted-text) z-10" />
                      <Select
                        value={formData.academy || ""}
                        onValueChange={(value) =>
                          handleInputChange("academy", value)
                        }
                      >
                        <SelectTrigger
                          className={`${selectTriggerStyles} pl-12`}
                        >
                          <SelectValue placeholder="Select academy/club" />
                        </SelectTrigger>
                        <SelectContent className="bg-(--surface-1) border-2 border-(--surface-2) text-white shadow-xl max-h-60">
                          {ACADEMIES.map((academy) => (
                            <SelectItem
                              key={academy}
                              value={academy}
                              className="focus:bg-(--surface-2) focus:text-primary py-3 text-base"
                            >
                              {academy}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-(--surface-0) border-2 border-(--surface-2) rounded-xl h-14">
                      <Building className="h-5 w-5 text-primary" />
                      <span className="text-white font-semibold">
                        {user.academy || "Not set"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview Card */}
          <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Performance Overview
              </CardTitle>
              <CardDescription className="text-(--muted-text)">
                Your assessment history and performance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Total Reports */}
                <div className="text-center p-6 border-2 border-(--surface-2) rounded-2xl bg-linear-to-br from-(--surface-0) to-(--surface-1) hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-linear-to-br from-(--color-blue-light) to-(--color-blue) rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white group-hover:text-(--color-blue-light) transition-colors">
                    {performanceStats.totalReports}
                  </div>
                  <div className="text-sm text-(--muted-text) mt-2">
                    Total Reports
                  </div>
                </div>

                {/* Average Score */}
                <div className="text-center p-6 border-2 border-(--surface-2) rounded-2xl bg-linear-to-br from-(--surface-0) to-(--surface-1) hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-linear-to-br from-primary to-(--accent-2) rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-(--ink)" />
                  </div>
                  <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors">
                    {performanceStats.averageScore || "--"}
                  </div>
                  <div className="text-sm text-(--muted-text) mt-2">
                    Average Score
                  </div>
                </div>

                {/* Progress */}
                <div className="text-center p-6 border-2 border-(--surface-2) rounded-2xl bg-linear-to-br from-(--surface-0) to-(--surface-1) hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-linear-to-br from-(--color-orange-light) to-(--color-orange) rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      performanceStats.progress > 0
                        ? "text-primary group-hover:text-primary"
                        : performanceStats.progress < 0
                        ? "text-(--color-orange-light) group-hover:text-(--color-orange-light)"
                        : "text-white group-hover:text-(--color-orange-light)"
                    } transition-colors`}
                  >
                    {performanceStats.progress > 0 ? "+" : ""}
                    {performanceStats.progress || 0}%
                  </div>
                  <div className="text-sm text-(--muted-text) mt-2">
                    Overall Progress
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Performance Trend</span>
                  <span
                    className={`font-bold ${
                      performanceStats.progress > 0
                        ? "text-primary"
                        : "text-(--color-orange-light)"
                    }`}
                  >
                    {performanceStats.progress > 0 ? "+" : ""}
                    {performanceStats.progress || 0}%
                  </span>
                </div>
                <Progress
                  value={Math.max(0, Math.min(100, performanceStats.progress))}
                  className="h-3 bg-(--surface-2) rounded-full"
                />
                <div className="flex justify-between text-xs text-(--muted-text)">
                  <span>Start</span>
                  <span>Current</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
