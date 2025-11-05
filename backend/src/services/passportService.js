import { supabase } from "../config/supabase.config.js";

export const getPlayerPassport = async (playerId) => {
  try {
    const [identity, passport, metrics, reports, media, verifications] =
      await Promise.all([
        // Get player identity
        supabase
          .from("player_identities")
          .select("*")
          .eq("player_id", playerId)
          .single(),
        // Get passport data
        supabase
          .from("player_passports")
          .select("*")
          .eq("player_id", playerId)
          .single(),
        // Get recent metrics (last 12 months)
        supabase
          .from("player_metrics")
          .select("*")
          .eq("player_id", playerId)
          .gte(
            "date",
            new Date(new Date().setMonth(new Date().getMonth() - 12))
              .toISOString()
              .split("T")[0]
          )
          .order("date", { ascending: true }),
        // Get reports
        supabase
          .from("player_reports")
          .select("*")
          .eq("player_id", playerId)
          .order("period_start", { ascending: false }),
        // Get media
        supabase
          .from("player_media")
          .select("*")
          .eq("player_id", playerId)
          .order("created_at", { ascending: false }),
        // Get verifications
        supabase
          .from("player_verifications")
          .select("*")
          .eq("player_id", playerId)
          .order("created_at", { ascending: false }),
      ]);

    // Handle errors
    const errors = [
      identity.error,
      passport.error,
      metrics.error,
      reports.error,
      media.error,
      verifications.error,
    ].filter((error) => error && error.code !== "PGRST116");

    if (errors.length > 0) throw errors[0];

    const verificationBadge = calculateVerificationBadge(verifications.data);
    const timeline = buildTimeline(metrics.data, reports.data);

    return {
      identity: identity.data || {},
      passport: passport.data || {},
      metrics: metrics.data || [],
      reports: reports.data || [],
      media: media.data || [],
      verifications: verifications.data || [],
      verificationBadge,
      timeline,
    };
  } catch (error) {
    console.error("Get player passport error:", error);
    throw new Error("Failed to fetch player passport");
  }
};

export const createPlayerIdentity = async (playerId, identityData) => {
  try {
    const { data, error } = await supabase
      .from("player_identities")
      .upsert({
        player_id: playerId,
        ...identityData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Start verification process
    await startVerificationProcess(playerId);

    await createAuditLog(
      playerId,
      "player_identities",
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

export const getVerificationStatus = async (playerId) => {
  try {
    const [identity, verifications] = await Promise.all([
      supabase
        .from("player_identities")
        .select("*")
        .eq("player_id", playerId)
        .single(),
      supabase
        .from("player_verifications")
        .select("*")
        .eq("player_id", playerId)
        .order("created_at", { ascending: false }),
    ]);

    const errors = [identity.error, verifications.error].filter(
      (error) => error && error.code !== "PGRST116"
    );
    if (errors.length > 0) throw errors[0];

    const verificationBadge = calculateVerificationBadge(verifications.data);

    const verificationProgress = calculateVerificationProgress(
      identity.data,
      verifications.data
    );

    return {
      identity: identity.data || {},
      verifications: verifications.data || [],
      verificationBadge,
      verificationProgress,
      currentStep: getCurrentVerificationStep(
        identity.data,
        verifications.data,
        verificationBadge
      ),
    };
  } catch (error) {
    console.error("Get verification status error:", error);
    throw new Error("Failed to fetch verification status");
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

export const updateHeadshot = async (playerId, headshotUrl) => {
  try {
    const { data, error } = await supabase
      .from("player_identities")
      .upsert({
        player_id: playerId,
        headshot_url: headshotUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("player_id", playerId)
      .select()
      .single();

    if (error) throw error;

    await createAuditLog(playerId, "player_identities", playerId, "update", {
      headshot_updated: true,
    });

    return data;
  } catch (error) {
    console.error("Update headshot error:", error);
    throw new Error("Failed to update headshot");
  }
};

// Helper functions
const startVerificationProcess = async (playerId) => {
  try {
    // Create initial verification record or update status
    await supabase.from("verification_process").upsert({
      player_id: playerId,
      current_step: "identity",
      status: "in_progress",
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Start verification process error:", error);
  }
};

const calculateVerificationProgress = (identity, verifications) => {
  const progress = {
    identity: identity ? 100 : 0,
    headshot: identity?.headshot_url ? 100 : 0,
    documents: 0,
    approval: 0,
  };

  // Calculate documents progress
  const requiredDocs = ["passport", "club_letter"];
  const uploadedDocs =
    verifications?.filter((v) => requiredDocs.includes(v.document_type)) || [];
  progress.documents = Math.round(
    (uploadedDocs.length / requiredDocs.length) * 100
  );

  // Calculate approval progress
  const approvedDocs =
    verifications?.filter((v) => v.status === "approved") || [];
  if (approvedDocs.length >= 2) {
    progress.approval = 100;
  } else if (verifications?.some((v) => v.status === "rejected")) {
    progress.approval = 0;
  } else if (verifications?.length > 0) {
    progress.approval = 50; // Under review
  }

  return progress;
};

const getCurrentVerificationStep = (
  identity,
  verifications,
  verificationBadge
) => {
  if (!identity) return 1;
  if (!identity.headshot_url) return 1;

  // Check document types and also url is not empty
  const requiredDocs = ["passport", "club_letter"];
  const uploadedDocs =
    verifications?.filter(
      (v) => requiredDocs.includes(v.document_type) && v.file_url
    ) || [];
  const hasRequiredDocs = uploadedDocs.length;

  if (!hasRequiredDocs) return 2;
  if (verificationBadge.status === "pending") return 3;
  if (verificationBadge.status === "verified") return 4;
  if (verificationBadge.status === "rejected") return 5;

  return 2;
};

const calculateVerificationBadge = (verifications) => {
  if (!verifications || verifications.length === 0) {
    return { status: "unverified", label: "Unverified", color: "gray" };
  }

  const approvedDocs = verifications.filter((v) => v.status === "approved");
  const pendingDocs = verifications.filter((v) => v.status === "pending");
  const rejectedDocs = verifications.filter((v) => v.status === "rejected");

  if (approvedDocs.length >= 1) {
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

  metrics?.forEach((metric) => {
    timeline.push({
      type: "metric",
      date: metric.date,
      title: "Match Performance",
      description: `GR4DE Score: ${metric.gr4de_score}`,
      data: metric,
    });
  });

  reports?.forEach((report) => {
    timeline.push({
      type: "report",
      date: report.period_end,
      title: `${report.report_type} Report`,
      description: `Period: ${report.period_start} to ${report.period_end}`,
      data: report,
    });
  });

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
