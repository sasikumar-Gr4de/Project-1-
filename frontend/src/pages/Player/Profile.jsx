// Profile.jsx - Fixed with consistent input and select box sizes
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
  User as UserIcon,
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

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-[#B0AFAF] font-['Orbitron'] text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case TIER_PLANS.ELITE:
        return "bg-linear-to-r` from-[#FFD700] to-[#FFA500] text-purple";
      case TIER_PLANS.PRO:
        return "bg-linear-to-r` from-primary to-[#94D44A] text-blue";
      case TIER_PLANS.BASIC:
        return "bg-linear-to-r` from-[#60A5FA] to-[#3B82F6] text-green";
      default:
        return "bg-[#343434] text-white";
    }
  };

  // Custom styles for consistent input and select sizing
  const inputStyles =
    "h-14 text-base bg-[#1A1A1A] border-2 border-[#343434] text-white placeholder:text-[#B0AFAF] rounded-xl focus:border-primary focus:ring-2 focus:ring-[#C1FF72]/20 transition-all duration-300  w-full";

  const selectTriggerStyles =
    "h-14 text-base bg-[#1A1A1A] border-2 border-[#343434] text-white rounded-xl focus:border-primary focus:ring-2 focus:ring-[#C1FF72]/20 transition-all duration-300  w-full [&>span]:flex [&>span]:items-center [&>span]:h-full";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Player Profile
          </h1>
          <p className="text-[#B0AFAF] text-lg mt-2 font-['Orbitron']">
            Manage your personal information and performance preferences
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300 "
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-[#262626] border-[#343434] text-white hover:bg-[#343434] hover:border-primary font-semibold rounded-xl px-6 py-3 h-12 transition-all duration-300 "
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300  disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Avatar & Account Info */}
        <div className="space-y-8">
          {/* Avatar Upload Card */}
          <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white  flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-primary" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <AvatarUpload
                  onUpload={handleAvatarUpdate}
                  disabled={!isEditing}
                  existingUrl={user.avatar_url}
                  folder="avatars"
                  size="xl"
                />
                {!isEditing && (
                  <p className="text-sm text-[#B0AFAF] text-center ">
                    Click edit to change your profile picture
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white  flex items-center">
                <Crown className="w-5 h-5 mr-2 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Tier */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#B0AFAF] ">
                    Subscription Plan
                  </span>
                  <Badge
                    className={`${getTierBadgeColor(
                      user.tier_plan
                    )} font-semibold  px-3 py-1`}
                  >
                    {user.tier_plan?.toUpperCase() || "BASIC"}
                  </Badge>
                </div>
                {user.tier_plan !== TIER_PLANS.ELITE && (
                  <Button
                    variant="outline"
                    className="w-full bg-[#343434] border-[#343434] text-primary hover:bg-primary hover:text-[#0F0F0E] font-semibold rounded-xl transition-all duration-300 "
                    asChild
                  >
                    <a href="/subscription">Upgrade Plan</a>
                  </Button>
                )}
              </div>

              {/* Member Since */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#B0AFAF]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium ">Member Since</span>
                </div>
                <p className="text-white font-semibold ">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "--"}
                </p>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#B0AFAF]">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium ">Account Role</span>
                </div>
                <p className="text-white font-semibold  capitalize">
                  {user.role || "Player"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Details & Performance */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Card */}
          <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white  flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-[#B0AFAF] ">
                {isEditing
                  ? "Update your personal details and playing profile"
                  : "Your basic information and football profile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Player Name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white ">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B0AFAF] z-10" />
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
                    <div className="flex items-center space-x-3 p-4 bg-[#1A1A1A] border-2 border-[#343434] rounded-xl h-14">
                      <User className="h-5 w-5 text-primary" />
                      <span className="text-white font-semibold ">
                        {user.player_name || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white ">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B0AFAF] z-10" />
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
                    <div className="flex items-center space-x-3 p-4 bg-[#1A1A1A] border-2 border-[#343434] rounded-xl h-14">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <span className="text-white font-semibold  block">
                          {user.date_of_birth
                            ? new Date(user.date_of_birth).toLocaleDateString()
                            : "Not set"}
                        </span>
                        {user.date_of_birth && (
                          <span className="text-[#B0AFAF] text-sm ">
                            {calculateAge(user.date_of_birth)} years old
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white ">
                    Position
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B0AFAF] z-10" />
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
                        <SelectContent className="bg-[#262626] border-2 border-[#343434] text-white  shadow-xl">
                          {FOOTBALL_POSITIONS.map((position) => (
                            <SelectItem
                              key={position}
                              value={position}
                              className="focus:bg-[#343434] focus:text-primary py-3 text-base"
                            >
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-[#1A1A1A] border-2 border-[#343434] rounded-xl h-14">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="text-white font-semibold ">
                        {user.position || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white ">
                    Country
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B0AFAF] z-10" />
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
                        <SelectContent className="bg-[#262626] border-2 border-[#343434] text-white  shadow-xl max-h-60">
                          {COUNTRIES.map((country) => (
                            <SelectItem
                              key={country}
                              value={country}
                              className="focus:bg-[#343434] focus:text-primary py-3 text-base"
                            >
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-[#1A1A1A] border-2 border-[#343434] rounded-xl h-14">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-white font-semibold ">
                        {user.country || "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Academy */}
                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-medium text-white ">
                    Academy/Club
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B0AFAF] z-10" />
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
                        <SelectContent className="bg-[#262626] border-2 border-[#343434] text-white  shadow-xl max-h-60">
                          {ACADEMIES.map((academy) => (
                            <SelectItem
                              key={academy}
                              value={academy}
                              className="focus:bg-[#343434] focus:text-primary py-3 text-base"
                            >
                              {academy}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-[#1A1A1A] border-2 border-[#343434] rounded-xl h-14">
                      <Building className="h-5 w-5 text-primary" />
                      <span className="text-white font-semibold ">
                        {user.academy || "Not set"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview Card */}
          <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-white  flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Performance Overview
              </CardTitle>
              <CardDescription className="text-[#B0AFAF] ">
                Your assessment history and performance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Total Reports */}
                <div className="text-center p-6 border-2 border-[#343434] rounded-2xl bg-linear-to-br from-[#1A1A1A] to-[#262626] hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-linear-to-br from-[#60A5FA] to-[#3B82F6] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white  group-hover:text-[#60A5FA] transition-colors">
                    {performanceStats.totalReports}
                  </div>
                  <div className="text-sm text-[#B0AFAF]  mt-2">
                    Total Reports
                  </div>
                </div>

                {/* Average Score */}
                <div className="text-center p-6 border-2 border-[#343434] rounded-2xl bg-linear-to-br from-[#1A1A1A] to-[#262626] hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-linear-to-br from-primary to-[#94D44A] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-[#0F0F0E]" />
                  </div>
                  <div className="text-3xl font-bold text-white  group-hover:text-primary transition-colors">
                    {performanceStats.averageScore || "--"}
                  </div>
                  <div className="text-sm text-[#B0AFAF]  mt-2">
                    Average Score
                  </div>
                </div>

                {/* Progress */}
                <div className="text-center p-6 border-2 border-[#343434] rounded-2xl bg-linear-to-br from-[#1A1A1A] to-[#262626] hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`text-3xl font-bold  ${
                      performanceStats.progress > 0
                        ? "text-primary group-hover:text-primary"
                        : performanceStats.progress < 0
                        ? "text-[#FF6B6B] group-hover:text-[#FF6B6B]"
                        : "text-white group-hover:text-[#F59E0B]"
                    } transition-colors`}
                  >
                    {performanceStats.progress > 0 ? "+" : ""}
                    {performanceStats.progress || 0}%
                  </div>
                  <div className="text-sm text-[#B0AFAF]  mt-2">
                    Overall Progress
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white ">Performance Trend</span>
                  <span
                    className={`font-bold  ${
                      performanceStats.progress > 0
                        ? "text-primary"
                        : "text-[#FF6B6B]"
                    }`}
                  >
                    {performanceStats.progress > 0 ? "+" : ""}
                    {performanceStats.progress || 0}%
                  </span>
                </div>
                <Progress
                  value={Math.max(
                    0,
                    Math.min(100, 50 + performanceStats.progress)
                  )}
                  className="h-3 bg-[#343434] rounded-full"
                />
                <div className="flex justify-between text-xs text-[#B0AFAF] ">
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
