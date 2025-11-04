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
import Tabs from "@/components/common/Tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, BarChart3, Image, User } from "lucide-react";

const Passport = () => {
  const { playerId } = useParams();
  const { user } = useAuthStore();
  const { passport, fetchPlayerPassport, isLoading, error } =
    usePassportStore();
  const { toast } = useToast();

  // Use provided playerId or current user's ID
  const targetPlayerId = playerId || user?.id;

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

  // Define tabs for the custom Tabs component
  const passportTabs = [
    {
      id: "timeline",
      label: "Timeline",
      icon: TrendingUp,
      content: (
        <PerformanceTimeline
          timeline={passport?.timeline}
          metrics={passport?.metrics}
        />
      ),
    },
    {
      id: "metrics",
      label: "Metrics",
      icon: BarChart3,
      content: <MetricsSummary playerId={targetPlayerId} />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      content: <ReportLibrary reports={passport?.reports} />,
    },
    {
      id: "media",
      label: "Media",
      icon: Image,
      content: <MediaGallery media={passport?.media} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-['Orbitron'] animate-pulse bg-[var(--surface-1)] rounded-lg w-64 h-10"></h1>
            <p className="text-[var(--muted-text)] mt-2 font-['Orbitron'] animate-pulse bg-[var(--surface-1)] rounded w-48 h-4"></p>
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-[var(--surface-1)] border-[var(--surface-2)]"
            >
              <CardContent className="p-6">
                <div className="h-4 bg-[var(--surface-2)] rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-[var(--surface-2)] rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
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
          <p className="text-[var(--muted-text)] mb-6">{error}</p>
          <button
            onClick={loadPassport}
            className="bg-linear-to-r from-primary to-[var(--accent-2)] text-[var(--ink)] hover:from-[var(--accent-2)] hover:to-primary font-semibold rounded-xl px-6 py-3 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[var(--muted-text)]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            No Passport Data
          </h2>
          <p className="text-[var(--muted-text)]">
            {targetPlayerId === user?.id
              ? "Complete your player profile to get started with your digital passport."
              : "This player doesn't have a passport yet."}
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
            Digital Player Passport
          </h1>
          <p className="text-[var(--muted-text)] text-lg mt-2 font-['Orbitron']">
            Comprehensive player profile and performance history
          </p>
        </div>
      </div>

      {/* Passport Header */}
      <PassportHeader passport={passport} player={user} />

      {/* Main Content Tabs */}
      <Tabs
        tabs={passportTabs}
        defaultTab={0}
        variant="pills"
        size="md"
        fullWidth={false}
        responsive={true}
        className="space-y-6"
      />
    </div>
  );
};

export default Passport;
