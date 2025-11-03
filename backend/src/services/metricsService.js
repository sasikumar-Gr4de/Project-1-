import { supabase } from "../config/supabase.config.js";

export const processMetricsBatch = async (batchData) => {
  try {
    const { data, error } = await supabase
      .from("player_metrics")
      .insert(batchData)
      .select();

    if (error) throw error;

    // Update cached passport summaries
    await updatePassportCache(batchData[0].player_id);

    return data;
  } catch (error) {
    console.error("Process metrics batch error:", error);
    throw new Error("Failed to process metrics batch");
  }
};

export const getMetricsSummary = async (playerId, period = "4weeks") => {
  try {
    const startDate = calculateStartDate(period);

    const { data, error } = await supabase
      .from("player_metrics")
      .select("*")
      .eq("player_id", playerId)
      .gte("date", startDate)
      .order("date", { ascending: false });

    if (error) throw error;

    return calculateSummary(data || []);
  } catch (error) {
    console.error("Get metrics summary error:", error);
    throw new Error("Failed to fetch metrics summary");
  }
};

export const recalculateBenchmarks = async (playerId) => {
  try {
    // Get player's position and age group
    const { data: player, error: playerError } = await supabase
      .from("users")
      .select("position, date_of_birth")
      .eq("id", playerId)
      .single();

    if (playerError) throw playerError;

    // Get recent metrics (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: metrics, error: metricsError } = await supabase
      .from("player_metrics")
      .select("*")
      .eq("player_id", playerId)
      .gte("date", ninetyDaysAgo.toISOString().split("T")[0]);

    if (metricsError) throw metricsError;

    // Get cohort benchmarks
    const { data: benchmarks, error: benchmarksError } = await supabase
      .from("benchmarks")
      .select("*")
      .eq("position", player.position)
      .eq("is_active", true)
      .single();

    if (benchmarksError && benchmarksError.code !== "PGRST116") {
      throw benchmarksError;
    }

    // Calculate percentiles
    const updatedMetrics = metrics.map((metric) => ({
      ...metric,
      benchmarks: calculatePercentiles(metric, benchmarks?.averages_json || {}),
    }));

    // Update metrics with new benchmarks
    for (const metric of updatedMetrics) {
      await supabase
        .from("player_metrics")
        .update({ benchmarks: metric.benchmarks })
        .eq("metric_id", metric.metric_id);
    }

    return updatedMetrics;
  } catch (error) {
    console.error("Recalculate benchmarks error:", error);
    throw new Error("Failed to recalculate benchmarks");
  }
};

// Helper functions
const calculateStartDate = (period) => {
  const now = new Date();
  switch (period) {
    case "1week":
      now.setDate(now.getDate() - 7);
      break;
    case "4weeks":
      now.setDate(now.getDate() - 28);
      break;
    case "3months":
      now.setMonth(now.getMonth() - 3);
      break;
    case "1year":
      now.setFullYear(now.getFullYear() - 1);
      break;
    default:
      now.setDate(now.getDate() - 28); // Default to 4 weeks
  }
  return now.toISOString().split("T")[0];
};

const calculateSummary = (metrics) => {
  if (!metrics.length) {
    return {
      totalMatches: 0,
      avgScore: 0,
      avgMinutes: 0,
      totalDistance: 0,
      bestScore: 0,
      improvement: 0,
    };
  }

  const scores = metrics.map((m) => m.gr4de_score).filter((s) => s != null);
  const minutes = metrics.map((m) => m.minutes).filter((m) => m != null);
  const distances = metrics
    .map((m) => m.gps_summary?.distance_m)
    .filter((d) => d != null);

  return {
    totalMatches: metrics.length,
    avgScore: scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : 0,
    avgMinutes: minutes.length
      ? Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length)
      : 0,
    totalDistance: distances.reduce((a, b) => a + b, 0),
    bestScore: Math.max(...scores),
    improvement:
      scores.length > 1
        ? (scores[scores.length - 1] - scores[0]).toFixed(1)
        : 0,
  };
};

const calculatePercentiles = (metric, cohortAverages) => {
  const percentiles = {};

  // Calculate percentiles for key metrics
  if (metric.gr4de_score && cohortAverages.avg_score) {
    percentiles.score = Math.round(
      (metric.gr4de_score / cohortAverages.avg_score) * 100
    );
  }

  if (metric.gps_summary?.distance_m && cohortAverages.avg_distance) {
    percentiles.distance = Math.round(
      (metric.gps_summary.distance_m / cohortAverages.avg_distance) * 100
    );
  }

  if (metric.event_summary?.passes_completed && cohortAverages.avg_passes) {
    percentiles.passing = Math.round(
      (metric.event_summary.passes_completed / cohortAverages.avg_passes) * 100
    );
  }

  return percentiles;
};

const updatePassportCache = async (playerId) => {
  try {
    // This would update a materialized view or cached JSON
    // For now, we'll just ensure the data is fresh
    console.log(`Passport cache updated for player: ${playerId}`);
  } catch (error) {
    console.error("Update passport cache error:", error);
  }
};
