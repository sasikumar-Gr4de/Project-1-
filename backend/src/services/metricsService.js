import { supabase } from "../config/supabase.config.js";
import { getUserById } from "../services/userService.js";
import { getPlayerDataById } from "../services/dataService.js";
import { getQueueById } from "../services/queueService.js";

// Create player metrics service
export const createPlayerMetrics = async (data) => {
  const { player_id, player_data_id, job_id } = data;

  // Find player using player_id
  const player = await getUserById(player_id);
  if (!player) throw new Error("Player not found");

  // Find player data using player_data_id
  const playerData = await getPlayerDataById(player_data_id);
  if (!playerData) throw new Error("Player data not found");

  // Find queue using job_id
  const queue = await getQueueById(job_id);
  if (!queue) throw new Error("Queue not found");

  const { match_date } = data.match_metadata;
  const { overall_score, gr4de_score } = data.scoring_metrics; // required
  const {
    match_metadata,
    scoring_metrics,
    technical_metrics,
    tactical_metrics,
    physical_metrics,
    mental_metrics,
  } = data; // required
  const { tempo_results, position_specific_metrics } = data; // optional
  const { benchmark_comparison, insights } = data; // optional

  const { raw_file_urls } = data;
  const { metadata } = data; // importend from parent

  const { data, error } = await supabase.from("player_metrics").insert([
    {
      player_id: player_id,
      player_data_id: player_data_id,
      job_id: job_id,
      match_date: match_date,
      metric_type: "overall",
      metric_name: "gr4de-score",
      overall_score: overall_score,
      gr4de_score: gr4de_score,
      match_metadata: match_metadata,
      scoring_metrics: scoring_metrics,
      technical_metrics: technical_metrics,
      tactical_metrics: tactical_metrics,
      physical_metrics: physical_metrics,
      mental_metrics: mental_metrics,
      tempo_results: tempo_results,
      position_specific_metrics: position_specific_metrics,
      benchmark_comparison: benchmark_comparison,
      insights: insights,

      // uploaded files
      raw_file_urls: raw_file_urls,
      metadata: metadata,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) throw error;
  return data;
};

// Get metrics by id service
export const getMetricsById = async (metricsId) => {
  const { data, error } = await supabase
    .from("player_metrics")
    .select("*")
    .eq("id", metricsId)
    .single();
  if (error) throw error;
  return data;
};

// Delete metrics by id service
export const deleteMetricsById = async (metricsId) => {
  const { data, error } = await supabase
    .from("player_metrics")
    .delete()
    .eq("id", metricsId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Get metrics by player id with pagiantion and filters
export const getMetricsByPlayerId = async (
  playerId,
  page = 1,
  limit = 10,
  filters = {}
) => {
  // start_date, end_date filter
  const { start_date, end_date } = filters;

  // pagination parameters
  const page = parseInt(page);
  const limit = parseInt(limit);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("player_metrics")
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (start_date) {
    query = query.gte("match_date", start_date);
  }
  if (end_date) {
    query = query.lte("match_date", end_date);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
};
