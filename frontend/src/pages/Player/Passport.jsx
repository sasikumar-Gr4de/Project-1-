// Passport.jsx - Updated with Upwork-style layout
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePassportStore } from "@/store/passportStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/contexts/ToastContext";
import PassportHeader from "@/components/passport/PassportHeader";
import PerformanceTimeline from "@/components/passport/PerformanceTimeline";
import ReportLibrary from "@/components/passport/ReportLibrary";
import MetricsSummary from "@/components/passport/MetricsSummary";
import MediaGallery from "@/components/passport/MediaGallery";
import VerificationStatus from "@/components/passport/VerificationStatus";
import IdentitySection from "@/components/passport/IdentitySection";
import PassportHistory from "@/components/passport/PassportHistory";
import SkillsBadges from "@/components/passport/SkillsBadges";
import AchievementWall from "@/components/passport/AchievementWall";
import Tabs from "@/components/common/Tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  TrendingUp,
  BarChart3,
  Image,
  User,
  Shield,
  IdCard,
  History,
  Award,
  Star,
  Download,
  Edit,
  Plus,
} from "lucide-react";

const Passport = () => {
  const { playerId } = useParams();
  const { user } = useAuthStore();
  const { passport, fetchPlayerPassport, isLoading, error } =
    usePassportStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Use provided playerId or current user's ID
  const targetPlayerId = playerId || user?.id;
  const isOwnProfile = targetPlayerId === user?.id;

  useEffect(() => {
    if (targetPlayerId) {
      loadPassport();
    }
  }, [targetPlayerId]);

  const loadPassport = async () => {
    try {
      await fetchPlayerPassport(targetPlayerId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load player passport",
        variant: "destructive",
      });
    }
  };

  // Enhanced tabs with Upwork-style sections
  const passportTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: User,
      content: (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Summary */}
            <MetricsSummary
              playerId={targetPlayerId}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
            />

            {/* Skills & Badges */}
            <SkillsBadges
              skills={passport?.skills}
              badges={passport?.badges}
              isEditing={isEditing}
            />

            {/* Performance Timeline */}
            <PerformanceTimeline
              timeline={passport?.timeline}
              metrics={passport?.metrics}
            />

            {/* Media Portfolio */}
            <MediaGallery
              media={passport?.media}
              isEditing={isEditing}
              isOwnProfile={isOwnProfile}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Identity Card */}
            <IdentitySection
              identity={passport?.identity}
              isEditing={isEditing}
              isOwnProfile={isOwnProfile}
            />

            {/* Verification Status */}
            <VerificationStatus
              verificationStatus={passport?.verificationBadge}
              verifications={passport?.verifications}
            />

            {/* Achievement Wall */}
            <AchievementWall
              achievements={passport?.achievements}
              stats={passport?.stats}
            />

            {/* Quick Actions */}
            {isOwnProfile && (
              <Card className="bg-[#262626] border-[#343434]">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#343434]"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#343434]"
                      asChild
                    >
                      <a href={`/player/${targetPlayerId}/reports`}>
                        <FileText className="w-4 h-4 mr-2" />
                        View Reports
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#343434]"
                      asChild
                    >
                      <a href={`/player/${targetPlayerId}/upload`}>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Media
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: Image,
      content: (
        <MediaGallery
          media={passport?.media}
          isEditing={isEditing}
          isOwnProfile={isOwnProfile}
          fullView={true}
        />
      ),
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      content: <ReportLibrary reports={passport?.reports} />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <PerformanceTimeline
            timeline={passport?.timeline}
            metrics={passport?.metrics}
            detailed={true}
          />
          <MetricsSummary playerId={targetPlayerId} detailed={true} />
        </div>
      ),
    },
    {
      id: "history",
      label: "Passport History",
      icon: History,
      content: <PassportHistory history={passport?.history} />,
    },
  ];

  // Enhanced loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-10 bg-[#343434] rounded-lg animate-pulse w-64"></div>
            <div className="h-6 bg-[#343434] rounded-lg animate-pulse w-80"></div>
          </div>
          <div className="h-8 bg-[#343434] rounded-full animate-pulse w-32"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="bg-[#262626] border-[#343434] animate-pulse"
              >
                <CardContent className="p-6">
                  <div className="h-6 bg-[#343434] rounded-lg w-48 mb-4"></div>
                  <div className="h-32 bg-[#343434] rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="bg-[#262626] border-[#343434] animate-pulse"
              >
                <CardContent className="p-6">
                  <div className="h-6 bg-[#343434] rounded-lg w-32 mb-4"></div>
                  <div className="h-20 bg-[#343434] rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Failed to Load Passport
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button
            onClick={loadPassport}
            className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#343434] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            No Passport Data
          </h2>
          <p className="text-gray-400 mb-6">
            {isOwnProfile
              ? "Complete your player profile to get started with your digital passport."
              : "This player doesn't have a passport yet."}
          </p>
          {isOwnProfile && (
            <Button
              asChild
              className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
            >
              <a href="/verification">Start Verification</a>
            </Button>
          )}
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
            Digital Player Passport
          </h1>
          <p className="text-gray-400 text-lg mt-2 font-['Orbitron']">
            Comprehensive player profile and performance history
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {isOwnProfile && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#262626] border-[#343434] text-white hover:bg-[#343434]"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          )}
          <Button className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Passport Header */}
      <PassportHeader
        passport={passport}
        player={user}
        targetPlayerId={targetPlayerId}
        isEditing={isEditing}
      />

      {/* Main Content Tabs */}
      <Tabs
        tabs={passportTabs}
        defaultTab={0}
        variant="pills"
        size="md"
        fullWidth={true}
        responsive={true}
        className="space-y-6"
      />
    </div>
  );
};

export default Passport;
