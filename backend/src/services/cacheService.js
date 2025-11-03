import { supabase } from "../config/supabase.config.js";

export const updatePassportSummaryCache = async (playerId) => {
  try {
    // Get latest passport data
    const { data: metrics } = await supabase
      .from("player_metrics")
      .select("gr4de_score, date")
      .eq("player_id", playerId)
      .order("date", { ascending: false })
      .limit(20);

    const { data: reports } = await supabase
      .from("player_reports")
      .select("report_type, period_end, pdf_url")
      .eq("player_id", playerId)
      .order("period_end", { ascending: false })
      .limit(5);

    const { data: verifications } = await supabase
      .from("player_verifications")
      .select("status")
      .eq("player_id", playerId);

    // Calculate summary
    const summary = {
      lastUpdated: new Date().toISOString(),
      totalMatches: metrics?.length || 0,
      recentScores:
        metrics?.slice(0, 5).map((m) => ({
          date: m.date,
          score: m.gr4de_score,
        })) || [],
      reportCount: reports?.length || 0,
      verificationStatus: calculateVerificationStatus(verifications),
      metricsTrend: calculateTrend(metrics),
    };

    // Store in cache table (you might want to create a dedicated cache table)
    // For now, we'll just return the summary
    return summary;
  } catch (error) {
    console.error("Update passport summary cache error:", error);
    throw new Error("Failed to update passport cache");
  }
};

export const getCachedPassportSummary = async (playerId) => {
  try {
    // In a real implementation, this would fetch from a cache table
    // For now, we'll always generate fresh data
    return await updatePassportSummaryCache(playerId);
  } catch (error) {
    console.error("Get cached passport summary error:", error);
    throw new Error("Failed to fetch cached passport summary");
  }
};

// Helper functions
const calculateVerificationStatus = (verifications) => {
  if (!verifications || verifications.length === 0) {
    return "unverified";
  }

  const approved = verifications.filter((v) => v.status === "approved").length;
  const pending = verifications.filter((v) => v.status === "pending").length;

  if (approved >= 2) return "verified";
  if (pending > 0) return "pending";
  return "rejected";
};

const calculateTrend = (metrics) => {
  if (!metrics || metrics.length < 2) {
    return "stable";
  }

  const recentScores = metrics.slice(0, 5).map((m) => m.gr4de_score);
  const avgRecent =
    recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const avgPrevious =
    metrics.length >= 10
      ? metrics.slice(5, 10).reduce((a, b) => a + b.gr4de_score, 0) / 5
      : avgRecent;

  if (avgRecent > avgPrevious + 5) return "improving";
  if (avgRecent < avgPrevious - 5) return "declining";
  return "stable";
};
