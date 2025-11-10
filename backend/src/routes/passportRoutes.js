import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { supabase } from "../config/supabase.config.js";
import { RESPONSES } from "../utils/messages.js";
import crypto from "crypto";

const router = express.Router();

// All passport routes require authentication
router.use(authenticateToken);

/**
 * Get player's passport data
 */
router.get("/v1/player/passport", async (req, res) => {
  try {
    const { id: userId } = req.user;

    // Get player record
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("player_id, status, passport_status")
      .eq("user_id", userId)
      .single();

    if (playerError) {
      if (playerError.code === "PGRST116") {
        return res
          .status(404)
          .json(RESPONSES.NOT_FOUND("Player profile not found"));
      }
      throw playerError;
    }

    // Get identity information
    const { data: identity, error: identityError } = await supabase
      .from("player_identity")
      .select("*")
      .eq("player_id", player.player_id)
      .single();

    if (identityError && identityError.code !== "PGRST116") {
      throw identityError;
    }

    // Get passport information
    const { data: passport, error: passportError } = await supabase
      .from("player_passport")
      .select("*")
      .eq("player_id", player.player_id)
      .single();

    if (passportError && passportError.code !== "PGRST116") {
      throw passportError;
    }

    // Get verifications
    const { data: verifications, error: verificationsError } = await supabase
      .from("player_verifications")
      .select("*")
      .eq("player_id", player.player_id)
      .order("created_at", { ascending: false });

    if (verificationsError) throw verificationsError;

    // Get recent reports
    const { data: reports, error: reportsError } = await supabase
      .from("player_reports")
      .select("report_id, report_type, summary_json, pdf_url, created_at")
      .eq("player_id", player.player_id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (reportsError) throw reportsError;

    // Get metrics summary
    const { data: metrics, error: metricsError } = await supabase
      .from("player_metrics")
      .select("gr4de_score, date, competition, benchmarks")
      .eq("player_id", player.player_id)
      .order("date", { ascending: false })
      .limit(5);

    if (metricsError) throw metricsError;

    // Get tempo data
    const { data: tempoData, error: tempoError } = await supabase
      .from("tempo_player_match")
      .select("tempo_index, avg_pass_speed, touch_time, seq_rate, created_at")
      .eq("player_id", player.player_id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (tempoError) throw tempoError;

    // Check subscription tier for feature gating
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("tier_plan")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    const tier = user.tier_plan || "free";

    res.json(
      RESPONSES.SUCCESS("Passport data retrieved", {
        player: {
          ...player,
          tier,
        },
        identity: identity || null,
        passport: passport || null,
        verifications: verifications || [],
        reports: reports || [],
        metrics: metrics || [],
        tempo_data: tempoData || [],
      })
    );
  } catch (error) {
    console.error("Get passport error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to retrieve passport data"));
  }
});

/**
 * Update passport data
 */
router.put("/v1/player/passport", async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { passport: passportData, identity: identityData } = req.body;

    // Get player record
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("player_id")
      .eq("user_id", userId)
      .single();

    if (playerError) throw playerError;

    const playerId = player.player_id;

    // Update identity if provided
    if (identityData) {
      const { data: existingIdentity } = await supabase
        .from("player_identity")
        .select("player_id")
        .eq("player_id", playerId)
        .single();

      if (existingIdentity) {
        await supabase
          .from("player_identity")
          .update({
            ...identityData,
            updated_at: new Date().toISOString(),
          })
          .eq("player_id", playerId);
      } else {
        await supabase.from("player_identity").insert({
          player_id: playerId,
          ...identityData,
        });
      }
    }

    // Update passport if provided
    if (passportData) {
      const { data: existingPassport } = await supabase
        .from("player_passport")
        .select("passport_id")
        .eq("player_id", playerId)
        .single();

      if (existingPassport) {
        await supabase
          .from("player_passport")
          .update({
            ...passportData,
            updated_at: new Date().toISOString(),
          })
          .eq("player_id", playerId);
      } else {
        await supabase.from("player_passport").insert({
          player_id: playerId,
          ...passportData,
        });
      }
    }

    // Update passport status to pending review if identity and passport are complete
    const hasIdentity =
      identityData ||
      (
        await supabase
          .from("player_identity")
          .select("first_name")
          .eq("player_id", playerId)
          .single()
      ).data;

    const hasPassport =
      passportData ||
      (
        await supabase
          .from("player_passport")
          .select("current_club")
          .eq("player_id", playerId)
          .single()
      ).data;

    if (hasIdentity && hasPassport) {
      await supabase
        .from("players")
        .update({ passport_status: "pending_review" })
        .eq("player_id", playerId);
    }

    res.json(RESPONSES.SUCCESS("Passport updated successfully"));
  } catch (error) {
    console.error("Update passport error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to update passport"));
  }
});

/**
 * Upload passport files (headshot, documents)
 */
router.post("/v1/player/passport/files", async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { file_url, file_type, document_type } = req.body;

    // Get player record
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("player_id")
      .eq("user_id", userId)
      .single();

    if (playerError) throw playerError;

    const playerId = player.player_id;

    if (file_type === "headshot") {
      // Update headshot in identity
      await supabase.from("player_identity").upsert({
        player_id: playerId,
        headshot_url: file_url,
      });
    } else if (file_type === "document") {
      // Insert verification record
      await supabase.from("player_verifications").insert({
        player_id: playerId,
        document_type,
        file_url,
        status: "pending",
      });
    }

    res.json(RESPONSES.SUCCESS("File uploaded successfully"));
  } catch (error) {
    console.error("Upload passport file error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to upload file"));
  }
});

/**
 * Get passport status and verification info
 */
router.get("/v1/player/passport/status", async (req, res) => {
  try {
    const { id: userId } = req.user;

    // Get player record
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("player_id, passport_status")
      .eq("user_id", userId)
      .single();

    if (playerError) throw playerError;

    // Get verification counts
    const { data: verifications, error: verificationsError } = await supabase
      .from("player_verifications")
      .select("status, verification_badge")
      .eq("player_id", player.player_id);

    if (verificationsError) throw verificationsError;

    const verificationStats = {
      total: verifications.length,
      pending: verifications.filter((v) => v.status === "pending").length,
      approved: verifications.filter((v) => v.status === "approved").length,
      rejected: verifications.filter((v) => v.status === "rejected").length,
      identity_verified: verifications.some(
        (v) => v.verification_badge === "identity_verified"
      ),
      club_verified: verifications.some(
        (v) => v.verification_badge === "club_verified"
      ),
    };

    res.json(
      RESPONSES.SUCCESS("Passport status retrieved", {
        passport_status: player.passport_status,
        verification_stats: verificationStats,
      })
    );
  } catch (error) {
    console.error("Get passport status error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to get passport status"));
  }
});

/**
 * Create shareable passport link
 */
router.post("/v1/player/passport/share/create", async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { expires_in_days = 30 } = req.body;

    // Get player record
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("player_id")
      .eq("user_id", userId)
      .single();

    if (playerError) throw playerError;

    // Generate secure token
    const shareToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_in_days);

    // Create share record
    const { data: share, error: shareError } = await supabase
      .from("player_passport_shares")
      .insert({
        player_id: player.player_id,
        share_token: shareToken,
        expires_at: expiresAt.toISOString(),
        created_by: userId,
      })
      .select()
      .single();

    if (shareError) throw shareError;

    res.json(
      RESPONSES.SUCCESS("Share link created", {
        share_token: shareToken,
        expires_at: expiresAt.toISOString(),
        share_url: `${process.env.CLIENT_URL}/passport/public/${shareToken}`,
      })
    );
  } catch (error) {
    console.error("Create share link error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to create share link"));
  }
});

/**
 * Revoke passport share link
 */
router.post("/v1/player/passport/share/revoke", async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { share_token } = req.body;

    // Get player record
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("player_id")
      .eq("user_id", userId)
      .single();

    if (playerError) throw playerError;

    // Revoke share
    const { data: share, error: shareError } = await supabase
      .from("player_passport_shares")
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: userId,
      })
      .eq("share_token", share_token)
      .eq("player_id", player.player_id)
      .select()
      .single();

    if (shareError) {
      if (shareError.code === "PGRST116") {
        return res
          .status(404)
          .json(RESPONSES.NOT_FOUND("Share link not found"));
      }
      throw shareError;
    }

    res.json(RESPONSES.SUCCESS("Share link revoked"));
  } catch (error) {
    console.error("Revoke share link error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to revoke share link"));
  }
});

/**
 * Get public passport view (no authentication required)
 */
router.get("/v1/player/passport/public/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Validate share token
    const { data: share, error: shareError } = await supabase
      .from("player_passport_shares")
      .select(
        `
        player_id,
        expires_at,
        is_active,
        players!inner(
          player_id,
          passport_status
        )
      `
      )
      .eq("share_token", token)
      .single();

    if (shareError) {
      if (shareError.code === "PGRST116") {
        return res
          .status(404)
          .json(RESPONSES.NOT_FOUND("Share link not found or expired"));
      }
      throw shareError;
    }

    // Check if share is active and not expired
    if (!share.is_active || new Date() > new Date(share.expires_at)) {
      return res.status(404).json(RESPONSES.NOT_FOUND("Share link expired"));
    }

    const playerId = share.player_id;

    // Get public passport data (no sensitive info)
    const { data: identity, error: identityError } = await supabase
      .from("player_identity")
      .select(
        `
        first_name,
        last_name,
        dob,
        nationality,
        height_cm,
        weight_kg,
        preferred_foot,
        positions,
        headshot_url
      `
      )
      .eq("player_id", playerId)
      .single();

    if (identityError && identityError.code !== "PGRST116") throw identityError;

    // Calculate age from DOB (not showing actual DOB)
    let age = null;
    if (identity?.dob) {
      const birthDate = new Date(identity.dob);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
    }

    const { data: passport, error: passportError } = await supabase
      .from("player_passport")
      .select("current_club, season, squad_level, shirt_number")
      .eq("player_id", playerId)
      .single();

    if (passportError && passportError.code !== "PGRST116") throw passportError;

    // Get verifications for badges
    const { data: verifications, error: verificationsError } = await supabase
      .from("player_verifications")
      .select("verification_badge")
      .eq("player_id", playerId)
      .eq("status", "approved");

    if (verificationsError) throw verificationsError;

    // Get recent metrics (limited for free tier equivalent)
    const { data: metrics, error: metricsError } = await supabase
      .from("player_metrics")
      .select("gr4de_score, date, competition, benchmarks")
      .eq("player_id", playerId)
      .order("date", { ascending: false })
      .limit(3);

    if (metricsError) throw metricsError;

    // Get tempo data
    const { data: tempoData, error: tempoError } = await supabase
      .from("tempo_player_match")
      .select("tempo_index, created_at")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (tempoError) throw tempoError;

    const publicData = {
      identity: identity
        ? {
            ...identity,
            age, // Show age instead of DOB
            dob: undefined, // Remove DOB
          }
        : null,
      passport: passport || null,
      verifications: verifications || [],
      metrics: metrics || [],
      tempo_data: tempoData || [],
      share_info: {
        expires_at: share.expires_at,
        is_active: share.is_active,
      },
    };

    res.json(RESPONSES.SUCCESS("Public passport data retrieved", publicData));
  } catch (error) {
    console.error("Get public passport error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to retrieve public passport"));
  }
});

/**
 * Admin: Review passport verification (admin only)
 */
router.post(
  "/v1/player/passport/review/:playerId",
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { playerId } = req.params;
      const { id: adminId } = req.user;
      const { action, verification_id, note } = req.body;

      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json(RESPONSES.BAD_REQUEST("Invalid action"));
      }

      const status = action === "approve" ? "approved" : "rejected";

      // Update verification
      const { data: verification, error: verificationError } = await supabase
        .from("player_verifications")
        .update({
          status,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          review_note: note,
        })
        .eq("verification_id", verification_id)
        .eq("player_id", playerId)
        .select()
        .single();

      if (verificationError) {
        if (verificationError.code === "PGRST116") {
          return res
            .status(404)
            .json(RESPONSES.NOT_FOUND("Verification not found"));
        }
        throw verificationError;
      }

      // Grant badges for approved verifications
      if (status === "approved") {
        let badgeType = null;
        if (verification.document_type === "passport") {
          badgeType = "identity_verified";
        } else if (verification.document_type === "club_letter") {
          badgeType = "club_verified";
        }

        if (badgeType) {
          await supabase
            .from("player_verifications")
            .update({
              verification_badge: badgeType,
              badge_granted_at: new Date().toISOString(),
              badge_expires_at: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000
              ).toISOString(), // 1 year
            })
            .eq("verification_id", verification_id);
        }
      }

      // Update passport status if all required verifications are approved
      const { data: allVerifications, error: allVerError } = await supabase
        .from("player_verifications")
        .select("status, document_type")
        .eq("player_id", playerId);

      if (!allVerError) {
        const hasPassport = allVerifications.some(
          (v) => v.document_type === "passport" && v.status === "approved"
        );
        const hasClubLetter = allVerifications.some(
          (v) => v.document_type === "club_letter" && v.status === "approved"
        );

        if (hasPassport && hasClubLetter) {
          await supabase
            .from("players")
            .update({ passport_status: "verified" })
            .eq("player_id", playerId);
        }
      }

      // Audit log
      await supabase.from("audit_logs").insert({
        actor_id: adminId,
        entity: "player_verifications",
        entity_id: verification_id,
        action: `verification_${action}d`,
        diff_json: {
          status,
          reviewed_by: adminId,
          review_note: note,
        },
      });

      res.json(RESPONSES.SUCCESS(`Verification ${action}d successfully`));
    } catch (error) {
      console.error("Review passport error:", error);
      res
        .status(500)
        .json(RESPONSES.SERVER_ERROR("Failed to review verification"));
    }
  }
);

export default router;
