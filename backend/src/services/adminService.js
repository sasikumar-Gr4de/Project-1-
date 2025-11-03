// backend/src/services/adminService.js
import { supabase } from "../config/supabase.config.js";

// System Metrics
export const getSystemMetrics = async () => {
  try {
    // Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (usersError) throw usersError;

    // Get total reports
    const { count: totalReports, error: reportsError } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    if (reportsError) throw reportsError;

    // Get total player data entries
    const { count: totalDataEntries, error: dataError } = await supabase
      .from("player_data")
      .select("*", { count: "exact", head: true });

    if (dataError) throw dataError;

    // Get active users this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count: activeUsers, error: activeError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());

    if (activeError) throw activeError;

    // Get reports this week
    const { count: reportsThisWeek, error: reportsWeekError } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());

    if (reportsWeekError) throw reportsWeekError;

    // Get queue stats from player_data
    const { data: queueData, error: queueError } = await supabase
      .from("player_data")
      .select("status");

    if (queueError) throw queueError;

    const queueStats = {
      uploaded: queueData.filter((item) => item.status === "uploaded").length,
      pending: queueData.filter((item) => item.status === "pending").length,
      processing: queueData.filter((item) => item.status === "processing")
        .length,
      completed: queueData.filter((item) => item.status === "completed").length,
      failed: queueData.filter((item) => item.status === "failed").length,
    };

    // Calculate success rate
    const totalProcessed = queueStats.completed + queueStats.failed;
    const successRate =
      totalProcessed > 0
        ? ((queueStats.completed / totalProcessed) * 100).toFixed(1)
        : 100;

    return {
      totalUsers,
      totalReports,
      totalDataEntries,
      activeUsers,
      reportsThisWeek,
      queue: queueStats,
      uptime: 99.9,
      avgProcessingTime: 15,
      successRate: parseFloat(successRate),
      storageUsed: 2.1,
      storageTotal: 10,
    };
  } catch (error) {
    console.error("Get system metrics error:", error);
    throw new Error("Failed to fetch system metrics");
  }
};

// Queue Management (using player_data table)
export const getProcessingQueue = async ({ status, page = 1, limit = 50 }) => {
  try {
    let query = supabase
      .from("player_data")
      .select(
        `
          *,
          users:player_id (
            player_name,
            email,
            position,
            avatar_url
          )
        `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Get counts by status for categories
    const { data: allData, error: allError } = await supabase
      .from("player_data")
      .select("status");

    console.log("All Data for Categories:", allData);
    if (allError) throw allError;

    const categories = {
      all: allData.length,
      uploaded: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    allData.forEach((item) => {
      if (categories[item.status] !== undefined) {
        categories[item.status] += 1;
      }
    });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      items: data || [],
      categories,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error("Get processing queue error:", error);
    throw new Error("Failed to fetch processing queue");
  }
};

export const retryJob = async (jobId) => {
  try {
    const { data, error } = await supabase
      .from("player_data")
      .update({
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Retry job error:", error);
    throw new Error("Failed to retry job");
  }
};

export const deleteJob = async (jobId) => {
  try {
    const { error } = await supabase
      .from("player_data")
      .delete()
      .eq("id", jobId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Delete job error:", error);
    throw new Error("Failed to delete job");
  }
};

// User Management
export const getUsers = async ({
  page = 1,
  limit = 20,
  search,
  status,
  role,
  sortBy = "created_at",
  sortOrder = "desc",
}) => {
  try {
    let query = supabase.from("users").select("*", { count: "exact" });

    // Apply filters
    if (search) {
      query = query.or(`player_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      items: data || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error("Get users error:", error);
    throw new Error("Failed to fetch users");
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Update user status error:", error);
    throw new Error("Failed to update user status");
  }
};

// Report Management
export const getReports = async ({
  page = 1,
  limit = 20,
  search,
  status,
  userId,
  dateFrom,
  dateTo,
  sortBy = "created_at",
  sortOrder = "desc",
}) => {
  try {
    let query = supabase.from("reports").select(
      `
          *,
          users:player_id (
            player_name,
            email,
            position,
            avatar_url
          ),
          player_data:player_data_id (
            match_date,
            video_file,
            jersey_number,
            position
          )
        `,
      { count: "exact" }
    );

    // Apply filters
    if (search) {
      query = query.or(`users.player_name.ilike.%${search}%`);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (userId) {
      query = query.eq("player_id", userId);
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      items: data || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error("Get reports error:", error);
    throw new Error("Failed to fetch reports");
  }
};

export const deleteReport = async (reportId) => {
  try {
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", reportId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Delete report error:", error);
    throw new Error("Failed to delete report");
  }
};

export const regenerateReport = async (reportId) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .update({
        status: "generating",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Regenerate report error:", error);
    throw new Error("Failed to regenerate report");
  }
};

// System Analytics
export const getSystemAnalytics = async (dateRange = "7d") => {
  try {
    const endDate = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case "24h":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get user registrations over time
    const { data: userRegistrations, error: usersError } = await supabase
      .from("users")
      .select("created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (usersError) throw usersError;

    // Get report generations over time
    const { data: reportGenerations, error: reportsError } = await supabase
      .from("reports")
      .select("created_at, status")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (reportsError) throw reportsError;

    // Get data uploads over time
    const { data: dataUploads, error: dataError } = await supabase
      .from("player_data")
      .select("created_at, status")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (dataError) throw dataError;

    return {
      userRegistrations: userRegistrations || [],
      reportGenerations: reportGenerations || [],
      dataUploads: dataUploads || [],
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    };
  } catch (error) {
    console.error("Get system analytics error:", error);
    throw new Error("Failed to fetch system analytics");
  }
};
