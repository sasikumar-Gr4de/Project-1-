import { supabase } from "../config/supabase.config.js";

export const getUserDashboard = async (userId) => {
  // Get user profile
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

  // Get last 3 reports
  const { data: recentReports, error: reportsError } = await supabase
    .from("reports")
    .select("*")
    .eq("player_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (reportsError) throw reportsError;

  // Get progress data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: progressData, error: progressError } = await supabase
    .from("player_data")
    .select("*")
    .eq("player_id", userId)
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  if (progressError) throw progressError;

  // Get benchmark data
  const { data: benchmarkData, error: benchmarkError } = await supabase
    .from("benchmarks")
    .select("*")
    .eq("position", user.position)
    .eq("is_active", true)
    .maybeSingle();

  if (benchmarkError) throw benchmarkError;

  return {
    user,
    recentReports: recentReports || [],
    progressData: progressData || [],
    benchmarkData: benchmarkData || null,
  };
};

export const getUserReports = async (userId, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  const {
    data: reports,
    count,
    error,
  } = await supabase
    .from("reports")
    .select("*", { count: "exact" })
    .eq("player_id", userId)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) throw error;

  return {
    reports: reports || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
};

export const getReportDetails = async (reportId) => {
  const { data, error } = await supabase
    .from("reports")
    .select(
      `*, player_data: player_data_id(match_date, notes, video_file, gps_file)`
    )
    .eq("id", reportId)
    .eq("player_id", userId)
    .single();

  if (error) throw error;

  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};
