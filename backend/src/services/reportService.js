import { supabase } from "../config/supabase.config.js";

// Create player report service
export const createPlayerReport = async (data) => {
  const { player_id, player_data_id, job_id } = data;

  // Find player using player_id
  const player = await getUserById(player_id);
  if (!player) throw new Error("Player not found");

  // Find player data using player_data_id
  const playerData = await getPlayerDataById(player_data_id);
  if (!playerData) throw new Error("Player data not found");

  const { gr4de_score } = data.scoring_metrics;
  const { tempo_index } = data.tempo_results;
  const { match_date } = data.match_metadata;

  const { data, error } = await supabase.from("player_reports").insert([
    {
      player_id: player_id,
      player_data_id: player_data_id,
      job_id: job_id,
      match_date: match_date,
      gr4de_score: gr4de_score,
      tempo_index: tempo_index,
    },
  ]);
  if (error) throw error;
  return data;
};

// Get report by id service
export const getReportById = async (reportId) => {
  const { data, error } = await supabase
    .from("player_reports")
    .select("*")
    .eq("id", reportId)
    .single();
  if (error) throw error;
  return data;
};

// Update report service
export const updateReport = async (reportId, data) => {
  const { data, error } = await supabase
    .from("player_reports")
    .update(data)
    .eq("id", reportId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Delete report service
export const deleteReport = async (reportId) => {
  const { data, error } = await supabase
    .from("player_reports")
    .delete()
    .eq("id", reportId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Get all reports service with pagination and filters
export const getAllReports = async (page = 1, limit = 10, filters = {}) => {
  // start_date, end_date filter
  const { start_date, end_date } = filters;
  // pagination parameters
  const page = parseInt(page);
  const limit = parseInt(limit);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("player_reports")
    .select("*")
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

// Get reports by player id service with pagination and filters
export const getReportsByPlayerId = async (
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
    .from("player_reports")
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
