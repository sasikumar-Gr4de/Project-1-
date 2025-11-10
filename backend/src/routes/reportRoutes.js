import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { generateReportSchema } from "../middleware/validation.js";
import { supabase } from "../config/supabase.config.js";
import { generatePresignedDownloadUrl } from "../config/aws.config.js";
import { RESPONSES, REPORT_MESSAGES } from "../utils/messages.js";

const router = express.Router();

// All report routes require authentication
router.use(authenticateToken);

/**
 * Get reports for a specific player
 */
router.get("/v1/reports/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { id: userId, role } = req.user;
    const { page = 1, limit = 10 } = req.query;

    // Check if user owns this player or is admin
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("user_id")
      .eq("player_id", playerId)
      .single();

    if (playerError) {
      if (playerError.code === "PGRST116") {
        return res.status(404).json(RESPONSES.NOT_FOUND("Player not found"));
      }
      throw playerError;
    }

    if (player.user_id !== userId && role !== "admin") {
      return res.status(403).json(RESPONSES.FORBIDDEN("Access denied"));
    }

    // Get reports
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const {
      data: reports,
      error: reportsError,
      count,
    } = await supabase
      .from("player_reports")
      .select(
        `
        report_id,
        report_type,
        period_start,
        period_end,
        summary_json,
        pdf_url,
        created_at
      `,
        { count: "exact" }
      )
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (reportsError) throw reportsError;

    res.json(
      RESPONSES.SUCCESS("Reports retrieved successfully", {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      })
    );
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to retrieve reports"));
  }
});

/**
 * Get single report by ID
 */
router.get("/v1/report/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const { id: userId, role } = req.user;

    // Get report with player ownership check
    const { data: report, error } = await supabase
      .from("player_reports")
      .select(
        `
        report_id,
        report_type,
        period_start,
        period_end,
        summary_json,
        pdf_url,
        created_at,
        player_id,
        players!inner(user_id)
      `
      )
      .eq("report_id", reportId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json(RESPONSES.NOT_FOUND("Report not found"));
      }
      throw error;
    }

    // Check ownership
    if (report.players.user_id !== userId && role !== "admin") {
      return res.status(403).json(RESPONSES.FORBIDDEN("Access denied"));
    }

    res.json(
      RESPONSES.SUCCESS("Report retrieved successfully", {
        report: {
          report_id: report.report_id,
          report_type: report.report_type,
          period_start: report.period_start,
          period_end: report.period_end,
          summary_json: report.summary_json,
          pdf_url: report.pdf_url,
          created_at: report.created_at,
        },
      })
    );
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to retrieve report"));
  }
});

/**
 * Generate report (admin only for now)
 */
router.post("/generate", validate(generateReportSchema), async (req, res) => {
  try {
    const { player_data_id, scoring_weights } = req.body;

    // Get player data
    const { data: playerData, error: dataError } = await supabase
      .from("player_data")
      .select(
        `
        *,
        user:user_id (*)
      `
      )
      .eq("id", player_data_id)
      .single();

    if (dataError) throw dataError;

    // TODO: Integrate with scoring engine
    const scores = {
      overall_score: 85,
      technical: 82,
      tactical: 88,
      physical: 79,
      mental: 86,
      strengths: ["Ball Control", "Positioning", "Decision Making"],
      priorities: ["Stamina", "Shooting Accuracy"],
    };

    // Generate PDF (placeholder)
    const pdfUrl = `reports/${player_data_id}/report_${Date.now()}.pdf`;

    // Create report record
    const { data: report, error: reportError } = await supabase
      .from("player_reports")
      .insert({
        player_id: playerData.user_id,
        report_type: "match_analysis",
        period_start: playerData.match_date,
        period_end: playerData.match_date,
        summary_json: scores,
        pdf_url: pdfUrl,
        overall_score: scores.overall_score,
        status: "generated",
      })
      .select()
      .single();

    if (reportError) throw reportError;

    // Update processing queue
    await supabase
      .from("processing_queue")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("player_data_id", player_data_id);

    res.json(RESPONSES.SUCCESS(REPORT_MESSAGES.REPORT_GENERATED, report));
  } catch (error) {
    console.error("Generate report error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR(REPORT_MESSAGES.REPORT_GENERATION_FAILED));
  }
});

/**
 * Get report PDF URL
 */
router.get("/:reportId/pdf", async (req, res) => {
  try {
    const { reportId } = req.params;

    // Get report
    const { data: report, error } = await supabase
      .from("player_reports")
      .select("pdf_url, player_id")
      .eq("report_id", reportId)
      .single();

    if (error) throw error;

    // Check ownership
    if (report.player_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json(RESPONSES.FORBIDDEN("Access denied"));
    }

    // Generate presigned URL for PDF
    const downloadUrl = await generatePresignedDownloadUrl(report.pdf_url);

    res.json(RESPONSES.SUCCESS("PDF URL generated", { downloadUrl }));
  } catch (error) {
    console.error("Get PDF error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to get PDF"));
  }
});

export default router;
