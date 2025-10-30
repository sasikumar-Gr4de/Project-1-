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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import {
  FOOTBALL_POSITIONS,
  COUNTRIES,
  ACADEMIES,
  TIER_PLANS,
} from "@/utils/constants";
import { calculateAge } from "@/utils/helper.utils";

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

  useEffect(() => {
    if (user) {
      setFormData({
        player_name: user.player_name || "",
        date_of_birth: user.date_of_birth || "",
        position: user.position || "",
        academy: user.academy || "",
        country: user.country || "",
      });
    }
  }, [user]);

  useEffect(() => {
    // Fetch dashboard data to get performance stats
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
      setIsEditing(false);
      // Refresh dashboard data to reflect profile changes
      fetchDashboard();
    } catch (error) {
      console.error("Failed to update profile:", error);
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
    });
    setIsEditing(false);
  };

  const handleAvatarUpdate = (result) => {
    if (result.success) {
      // Avatar updated successfully - refresh user data
      console.log("Avatar updated:", result.url);
      // You might want to refresh the user data here
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Avatar & Basic Info */}
        <div className="space-y-6">
          {/* Avatar Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                onUpload={handleAvatarUpdate}
                existingUrl={user.avatar_url}
                folder="avatars"
                size="xl"
              />
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Plan
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant={
                      user.tier_plan === TIER_PLANS.ELITE
                        ? "default"
                        : user.tier_plan === TIER_PLANS.PRO
                        ? "secondary"
                        : user.tier_plan === TIER_PLANS.BASIC
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {user.tier_plan?.toUpperCase()}
                  </Badge>
                  {user.tier_plan !== TIER_PLANS.ELITE && (
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <a href="/subscription">Upgrade</a>
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Member Since
                </span>
                <p className="text-sm mt-1">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "--"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Role
                </span>
                <p className="text-sm mt-1 capitalize">{user.role}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your personal details"
                  : "Your basic information and playing profile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Player Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.player_name}
                        onChange={(e) =>
                          handleInputChange("player_name", e.target.value)
                        }
                        className="pl-10 h-11"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.player_name || "Not set"}</span>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  {isEditing ? (
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) =>
                          handleInputChange("date_of_birth", e.target.value)
                        }
                        className="pl-10 h-11"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {user.date_of_birth
                          ? `${new Date(
                              user.date_of_birth
                            ).toLocaleDateString()} (${calculateAge(
                              user.date_of_birth
                            )} years)`
                          : "Not set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  {isEditing ? (
                    <Select
                      value={formData.position}
                      onValueChange={(value) =>
                        handleInputChange("position", value)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your position" />
                      </SelectTrigger>
                      <SelectContent>
                        {FOOTBALL_POSITIONS.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{user.position || "Not set"}</span>
                    </div>
                  )}
                </div>

                {/* Academy */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Academy/Club</label>
                  {isEditing ? (
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={formData.academy}
                        onValueChange={(value) =>
                          handleInputChange("academy", value)
                        }
                      >
                        <SelectTrigger className="h-11 pl-10">
                          <SelectValue placeholder="Select your academy" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACADEMIES.map((academy) => (
                            <SelectItem key={academy} value={academy}>
                              {academy}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{user.academy || "Not set"}</span>
                    </div>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Country</label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleInputChange("country", value)
                        }
                      >
                        <SelectTrigger className="h-11 pl-10">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{user.country || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>
                Your recent performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 text-center">
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {performanceStats.totalReports}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Reports
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {performanceStats.averageScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Score
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <div
                    className={`text-2xl font-bold ${
                      performanceStats.progress >= 0
                        ? "text-blue-500"
                        : "text-orange-500"
                    }`}
                  >
                    {performanceStats.progress >= 0 ? "+" : ""}
                    {performanceStats.progress}%
                  </div>
                  <div className="text-sm text-muted-foreground">Progress</div>
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
