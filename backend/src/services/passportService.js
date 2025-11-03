import { supabase } from "../config/supabase.config.js";

export const getPlayerPassport = async (playerId) => {
  try {
    // Get player identity
    const { data: identity, error: identityError } = await supabase
      .from("player_identity")
      .select("*")
      .eq("player_id", playerId)
      .single();

    if (identityError && identityError.code !== "PGRST116") {
      throw identityError;
    }

    // Get passport data
    const { data: passport, error: passportError } = await supabase
      .from("player_passport")
      .select("*")
      .eq("player_id", playerId)
      .single();

    if (passportError && passportError.code !== "PGRST116") {
      throw passportError;
    }

    // Get recent metrics (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const { data: metrics, error: metricsError } = await supabase
      .from("player_metrics")
      .select("*")
      .eq("player_id", playerId)
      .gte("date", twelveMonthsAgo.toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (metricsError) throw metricsError;

    // Get reports
    const { data: reports, error: reportsError } = await supabase
      .from("player_reports")
      .select("*")
      .eq("player_id", playerId)
      .order("period_start", { ascending: false });

    if (reportsError) throw reportsError;

    // Get media
    const { data: media, error: mediaError } = await supabase
      .from("player_media")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });

    if (mediaError) throw mediaError;

    // Get verification status
    const { data: verifications, error: verificationsError } = await supabase
      .from("player_verifications")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });

    if (verificationsError) throw verificationsError;

    // Calculate verification badge
    const verificationBadge = calculateVerificationBadge(verifications);

    return {
      identity: identity || {},
      passport: passport || {},
      metrics: metrics || [],
      reports: reports || [],
      media: media || [],
      verifications: verifications || [],
      verificationBadge,
      timeline: buildTimeline(metrics, reports),
    };
  } catch (error) {
    console.error("Get player passport error:", error);
    throw new Error("Failed to fetch player passport");
  }
};

export const createPlayerIdentity = async (playerId, identityData) => {
  try {
    const { data, error } = await supabase
      .from("player_identity")
      .upsert({
        player_id: playerId,
        ...identityData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await createAuditLog(
      playerId,
      "player_identity",
      data.player_id,
      "create",
      {
        identity_created: true,
      }
    );

    return data;
  } catch (error) {
    console.error("Create player identity error:", error);
    throw new Error("Failed to create player identity");
  }
};

export const updatePlayerIdentity = async (playerId, updates) => {
  try {
    const { data, error } = await supabase
      .from("player_identity")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("player_id", playerId)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await createAuditLog(
      playerId,
      "player_identity",
      data.player_id,
      "update",
      updates
    );

    return data;
  } catch (error) {
    console.error("Update player identity error:", error);
    throw new Error("Failed to update player identity");
  }
};

export const ingestPlayerMetrics = async (playerId, metricsData) => {
  try {
    const { data, error } = await supabase
      .from("player_metrics")
      .insert([
        {
          player_id: playerId,
          ...metricsData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await createAuditLog(playerId, "player_metrics", data.metric_id, "create", {
      match_id: metricsData.match_id,
      date: metricsData.date,
    });

    return data;
  } catch (error) {
    console.error("Ingest player metrics error:", error);
    throw new Error("Failed to ingest player metrics");
  }
};

export const getPlayerMetrics = async (playerId, { from, to }) => {
  try {
    let query = supabase
      .from("player_metrics")
      .select("*")
      .eq("player_id", playerId)
      .order("date", { ascending: false });

    if (from) {
      query = query.gte("date", from);
    }

    if (to) {
      query = query.lte("date", to);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Get player metrics error:", error);
    throw new Error("Failed to fetch player metrics");
  }
};

export const uploadVerificationDocument = async (playerId, documentData) => {
  try {
    const { data, error } = await supabase
      .from("player_verifications")
      .insert([
        {
          player_id: playerId,
          ...documentData,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await createAuditLog(
      playerId,
      "player_verifications",
      data.verification_id,
      "create",
      {
        document_type: documentData.document_type,
      }
    );

    return data;
  } catch (error) {
    console.error("Upload verification document error:", error);
    throw new Error("Failed to upload verification document");
  }
};

export const reviewVerification = async (
  verificationId,
  adminId,
  action,
  note = ""
) => {
  try {
    const { data, error } = await supabase
      .from("player_verifications")
      .update({
        status: action,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("verification_id", verificationId)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await createAuditLog(
      adminId,
      "player_verifications",
      verificationId,
      "verify",
      {
        action,
        note,
      }
    );

    return data;
  } catch (error) {
    console.error("Review verification error:", error);
    throw new Error("Failed to review verification");
  }
};

// Helper functions
const calculateVerificationBadge = (verifications) => {
  if (!verifications || verifications.length === 0) {
    return { status: "unverified", label: "Unverified", color: "gray" };
  }

  const approvedDocs = verifications.filter((v) => v.status === "approved");
  const pendingDocs = verifications.filter((v) => v.status === "pending");
  const rejectedDocs = verifications.filter((v) => v.status === "rejected");

  if (approvedDocs.length >= 2) {
    // At least 2 key documents approved
    return { status: "verified", label: "Verified", color: "green" };
  } else if (rejectedDocs.length > 0) {
    return { status: "rejected", label: "Documents Rejected", color: "red" };
  } else if (pendingDocs.length > 0) {
    return { status: "pending", label: "Under Review", color: "yellow" };
  }

  return { status: "unverified", label: "Unverified", color: "gray" };
};

const buildTimeline = (metrics, reports) => {
  const timeline = [];

  // Add metrics to timeline
  metrics?.forEach((metric) => {
    timeline.push({
      type: "metric",
      date: metric.date,
      title: "Match Performance",
      description: `GR4DE Score: ${metric.gr4de_score}`,
      data: metric,
    });
  });

  // Add reports to timeline
  reports?.forEach((report) => {
    timeline.push({
      type: "report",
      date: report.period_end,
      title: `${report.report_type} Report`,
      description: `Period: ${report.period_start} to ${report.period_end}`,
      data: report,
    });
  });

  // Sort by date (newest first)
  return timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const createAuditLog = async (actorId, entity, entityId, action, diff) => {
  try {
    await supabase.from("audit_logs").insert([
      {
        actor_id: actorId,
        entity,
        entity_id: entityId,
        action,
        diff_json: diff,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error("Create audit log error:", error);
  }
};
