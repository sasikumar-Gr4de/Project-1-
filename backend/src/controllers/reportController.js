import { RESPONSES, REPORT_MESSAGES } from "../utils/messages.js";
import { generatePresignedDownloadUrl } from "../config/aws.config.js";
import { supabase } from "../config/supabase.config.js";

/**
 * Generate report (placeholder - integrate with your scoring engine)
 */
export const generateReport = async (req, res) => {
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

    // TODO: Integrate with your scoring engine
    // This is where you'd process the data and generate scores
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
      .from("reports")
      .insert({
        player_id: playerData.user_id,
        player_data_id: player_data_id,
        score_json: scores,
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
};

/**
 * Get report PDF URL
 */
export const getReportPdf = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Get report
    const { data: report, error } = await supabase
      .from("reports")
      .select("pdf_url, player_id")
      .eq("id", reportId)
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
};
