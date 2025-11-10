import { supabase } from "../config/supabase.config.js";

export const getUserDashboard = async (userId) => {
  try {
    // Get user profile directly from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // Get player identity for additional profile data
    const { data: playerIdentity, error: identityError } = await supabase
      .from("player_identity")
      .select("*")
      .eq("player_id", userId)
      .maybeSingle();

    if (identityError && identityError.code !== "PGRST116") throw identityError;

    // Get last 3 reports for the player
    const { data: recentReports, error: reportsError } = await supabase
      .from("player_reports")
      .select("*")
      .eq("player_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (reportsError) throw reportsError;

    // Get progress data from player_metrics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: progressData, error: progressError } = await supabase
      .from("player_metrics")
      .select("date, gr4de_score")
      .eq("player_id", userId)
      .gte("date", sixMonthsAgo.toISOString())
      .order("date", { ascending: true });

    if (progressError) throw progressError;

    let benchmarkData = null;

    // Get benchmark data if player has positions
    if (playerIdentity?.positions && playerIdentity.positions.length > 0) {
      const primaryPosition = playerIdentity.positions[0];
      const { data: benchmarks, error: benchmarkError } = await supabase
        .from("tempo_benchmarks")
        .select("*")
        .eq("position", primaryPosition)
        .maybeSingle();

      if (!benchmarkError) {
        benchmarkData = benchmarks;
      }
    }

    return {
      user: {
        ...user,
        player_id: userId, // player_id is now the user id
        position: playerIdentity?.positions?.[0] || null,
        date_of_birth: playerIdentity?.dob || null,
        identity: playerIdentity,
      },
      recentReports: recentReports || [],
      progressData: progressData || [],
      benchmarkData,
    };
  } catch (error) {
    console.error("Get dashboard error:", error);
    throw error;
  }
};

export const getUserReports = async (userId, page = 1, limit = 10) => {
  try {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const {
      data: reports,
      count,
      error,
    } = await supabase
      .from("player_reports")
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
  } catch (error) {
    console.error("Get user reports error:", error);
    throw error;
  }
};

export const getReportDetails = async (reportId, userId) => {
  try {
    const { data, error } = await supabase
      .from("player_reports")
      .select(
        `
        *,
        player_metrics!inner(
          date,
          competition,
          minutes,
          gps_summary,
          event_summary,
          source
        )
      `
      )
      .eq("report_id", reportId)
      .eq("player_id", userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Get report details error:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    // Update basic user info
    const allowedUserFields = ["player_name", "avatar_url", "tier_plan"];
    const userUpdates = {};

    Object.keys(updates).forEach((key) => {
      if (allowedUserFields.includes(key)) {
        userUpdates[key] = updates[key];
      }
    });

    if (Object.keys(userUpdates).length > 0) {
      const { data, error } = await supabase
        .from("users")
        .update(userUpdates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
    }

    // Update player identity if provided
    const allowedIdentityFields = [
      "first_name",
      "last_name",
      "dob",
      "nationality",
      "height_cm",
      "weight_kg",
      "preferred_foot",
      "positions",
      "headshot_url",
      "guardian_name",
      "guardian_email",
      "guardian_phone",
    ];

    const identityUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedIdentityFields.includes(key)) {
        identityUpdates[key] = updates[key];
      }
    });

    if (Object.keys(identityUpdates).length > 0) {
      // Update player identity directly using userId as player_id
      const { data: identityData, error: identityError } = await supabase
        .from("player_identity")
        .upsert({
          player_id: userId,
          ...identityUpdates,
        })
        .select()
        .single();

      if (identityError) throw identityError;
    }

    // Return updated combined data
    const { data: updatedUser } = await supabase
      .from("users")
      .select(
        `
        *,
        player_identity(*)
      `
      )
      .eq("id", userId)
      .single();

    return updatedUser;
  } catch (error) {
    console.error("Update user profile error:", error);
    throw error;
  }
};
