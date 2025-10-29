import { RESPONSES } from "../utils/messages.js";
import { supabase } from "../config/supabase.config.js";

/**
 * Get processing queue
 */
export const getQueue = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("processing_queue")
      .select(
        `
        *,
        player_data:player_data_id (
          user_id,
          match_date,
          notes,
          user:user_id (
            player_name,
            position,
            academy
          )
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(start, end);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    res.json(
      RESPONSES.SUCCESS("Queue fetched", {
        queue: data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      })
    );
  } catch (error) {
    console.error("Get queue error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch queue"));
  }
};

/**
 * Get system metrics
 */
export const getSystemMetrics = async (req, res) => {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Get total reports
    const { count: totalReports } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    // Get queue stats
    const { data: queueStats } = await supabase
      .from("processing_queue")
      .select("status")
      .in("status", ["pending", "processing", "completed", "failed"]);

    const metrics = {
      totalUsers: totalUsers || 0,
      totalReports: totalReports || 0,
      queue: {
        pending: queueStats?.filter((q) => q.status === "pending").length || 0,
        processing:
          queueStats?.filter((q) => q.status === "processing").length || 0,
        completed:
          queueStats?.filter((q) => q.status === "completed").length || 0,
        failed: queueStats?.filter((q) => q.status === "failed").length || 0,
      },
      storage: {
        // TODO: Add S3 storage metrics
        used: "0 GB",
        available: "0 GB",
      },
    };

    res.json(RESPONSES.SUCCESS("Metrics fetched", metrics));
  } catch (error) {
    console.error("Get metrics error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch metrics"));
  }
};

/**
 * Update scoring weights
 */
export const updateScoringWeights = async (req, res) => {
  try {
    const { weights } = req.body;

    // TODO: Store scoring weights in database or config
    // This would update your scoring engine configuration

    res.json(RESPONSES.SUCCESS("Scoring weights updated", { weights }));
  } catch (error) {
    console.error("Update scoring weights error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to update scoring weights"));
  }
};
