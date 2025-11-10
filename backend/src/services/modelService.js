import crypto from "crypto";
import { supabase } from "../config/supabase.config.js";
import { QUEUE_STATUS } from "../utils/constants.js";
import pdfService from "./pdfService.js";

/**
 * Generate HMAC signature for model server request
 */
function generateSignature(payload, timestamp, secret) {
  const message = JSON.stringify(payload) + timestamp;
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

/**
 * Call model server to process video/data
 */
export const callModelServer = async (data) => {
  const modelServerUrl = process.env.MODEL_SERVER_URL;
  const modelServerSecret = process.env.MODEL_SERVER_SECRET;

  if (!modelServerUrl || !modelServerSecret) {
    throw new Error("Model server configuration missing");
  }

  const timestamp = Date.now().toString();
  const payload = {
    job_id: data.job_id,
    player_data_id: data.player_data_id,
    player_id: data.player_id,
    video_url: data.video_url,
    gps_url: data.gps_url,
    event_json_url: data.event_json_url,
    match_metadata: data.match_metadata || {},
    source: "gr4de-backend",
  };

  const signature = generateSignature(payload, timestamp, modelServerSecret);

  const response = await fetch(`${modelServerUrl}/api/v1/model/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-GR4DE-Signature": signature,
      "X-GR4DE-Timestamp": timestamp,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Model server error: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  // Update queue status to processing
  await supabase
    .from("processing_queue")
    .update({
      status: QUEUE_STATUS.PROCESSING,
      started_at: new Date().toISOString(),
    })
    .eq("id", data.job_id);

  return result;
};

/**
 * Handle model server callback with results
 */
export const handleModelCallback = async (jobId, results) => {
  try {
    // Get queue item
    const { data: queueItem, error: queueError } = await supabase
      .from("processing_queue")
      .select("player_data_id")
      .eq("id", jobId)
      .single();

    if (queueError) throw queueError;

    // Store results in various tables
    await storeAnalysisResults(queueItem.player_data_id, results);

    // Update queue status to completed
    await supabase
      .from("processing_queue")
      .update({
        status: QUEUE_STATUS.COMPLETED,
        completed_at: new Date().toISOString(),
        logs: `Processing completed successfully at ${new Date().toISOString()}`,
      })
      .eq("id", jobId);

    // Write audit log
    await supabase.from("audit_logs").insert({
      actor_id: playerData.player_id,
      entity: "processing_queue",
      entity_id: jobId,
      action: "completed",
      diff_json: {
        status: "completed",
        completed_at: new Date().toISOString(),
        report_id: report.report_id,
      },
      created_at: new Date().toISOString(),
    });

    // Create alerts for notifications
    await createNotificationAlerts(queueItem.player_data_id, results);

    return { success: true };
  } catch (error) {
    console.error("Model callback error:", error);

    // Update queue status to failed
    await supabase
      .from("processing_queue")
      .update({
        status: QUEUE_STATUS.FAILED,
        logs: `Callback processing error: ${error.message}`,
      })
      .eq("id", jobId);

    throw error;
  }
};

/**
 * Store analysis results in database
 */
async function storeAnalysisResults(playerDataId, results) {
  const {
    tempo_results,
    scoring_metrics,
    technical_metrics,
    tactical_metrics,
    physical_metrics,
    mental_metrics,
    benchmark_comparison,
    event_array,
    insights,
  } = results;

  // Get player data for context
  const { data: playerData, error: dataError } = await supabase
    .from("player_data")
    .select("player_id, match_date")
    .eq("id", playerDataId)
    .single();

  if (dataError) throw dataError;

  // Insert player_metrics
  await supabase.from("player_metrics").insert({
    player_id: playerData.player_id,
    match_id: playerDataId, // Using player_data_id as match_id for now
    date: playerData.match_date || new Date().toISOString().split("T")[0],
    competition: results.match_metadata?.competition || "Unknown",
    minutes: results.match_metadata?.minutes || 90,
    gps_summary: results.gps_summary || {},
    event_summary: results.event_summary || {},
    gr4de_score: scoring_metrics?.overall_score || 0,
    benchmarks: benchmark_comparison || {},
    source: "model_server",
    raw_file_url: results.raw_file_url || null,
    created_at: new Date().toISOString(),
  });

  // Insert tempo_player_match
  if (tempo_results) {
    await supabase.from("tempo_player_match").insert({
      player_id: playerData.player_id,
      match_id: playerDataId,
      tempo_index: tempo_results.tempo_index || 0,
      avg_pass_speed: tempo_results.avg_pass_speed || 0,
      touch_to_pass: tempo_results.touch_to_pass || 0,
      sequences_per_min: tempo_results.sequences_per_min || 0,
      execution_accuracy: tempo_results.execution_accuracy || 0,
      created_at: new Date().toISOString(),
    });
  }

  // Insert tempo_events
  if (event_array && Array.isArray(event_array)) {
    const tempoEvents = event_array.map((event) => ({
      player_id: playerData.player_id,
      match_id: playerDataId,
      event: event,
      created_at: new Date().toISOString(),
    }));

    if (tempoEvents.length > 0) {
      await supabase.from("tempo_events").insert(tempoEvents);
    }
  }

  // Generate PDF report
  let pdfUrl = null;
  try {
    const pdfData = {
      gr4de_score: scoring_metrics?.overall_score || 0,
      tempo_index: tempo_results?.tempo_index || 0,
      technical_score: technical_metrics?.score || 0,
      tactical_score: tactical_metrics?.score || 0,
      physical_score: physical_metrics?.score || 0,
      mental_score: mental_metrics?.score || 0,
      insights: insights || [],
      benchmarks: benchmark_comparison || {},
      player_name: "Player", // TODO: Get from player profile
      match_date: playerData.match_date,
      competition: results.match_metadata?.competition || "Unknown",
    };

    pdfUrl = await pdfService.generateReportPDF(pdfData, jobId);
  } catch (pdfError) {
    console.error("PDF generation error:", pdfError);
    // Continue without PDF - don't fail the whole process
  }

  // Create player_reports
  const reportData = {
    player_id: playerData.player_id,
    report_type: "match_analysis",
    period_start:
      playerData.match_date || new Date().toISOString().split("T")[0],
    period_end: playerData.match_date || new Date().toISOString().split("T")[0],
    summary_json: {
      gr4de_score: scoring_metrics?.overall_score || 0,
      tempo_index: tempo_results?.tempo_index || 0,
      technical_score: technical_metrics?.score || 0,
      tactical_score: tactical_metrics?.score || 0,
      physical_score: physical_metrics?.score || 0,
      mental_score: mental_metrics?.score || 0,
      insights: insights || [],
      benchmarks: benchmark_comparison || {},
    },
    pdf_url: pdfUrl,
    created_at: new Date().toISOString(),
  };

  const { data: report, error: reportError } = await supabase
    .from("player_reports")
    .insert(reportData)
    .select()
    .single();

  if (reportError) throw reportError;
}

/**
 * Create notification alerts
 */
async function createNotificationAlerts(playerDataId, results) {
  // Get user info directly from users table
  const { data: playerData, error: dataError } = await supabase
    .from("player_data")
    .select("player_id")
    .eq("id", playerDataId)
    .single();

  if (dataError) throw dataError;

  const userId = playerData.player_id;

  // Get user email
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("email, phone")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

  // Create email alert
  await supabase.from("alerts").insert({
    user_id: userId,
    type: "email",
    status: "pending",
    subject: "Your GR4DE Report is Ready!",
    message: `Your performance analysis report is now available. GR4DE Score: ${
      results.scoring_metrics?.overall_score || "N/A"
    }`,
    metadata: {
      report_type: "match_analysis",
      gr4de_score: results.scoring_metrics?.overall_score || 0,
      report_id: report?.report_id,
      pdf_url: pdfUrl,
    },
    created_at: new Date().toISOString(),
  });

  // Create WhatsApp alert if phone exists
  if (user.phone) {
    await supabase.from("alerts").insert({
      user_id: userId,
      type: "whatsapp",
      status: "pending",
      subject: "Report Ready",
      message: `Your GR4DE report is ready! Score: ${
        results.scoring_metrics?.overall_score || "N/A"
      }`,
      metadata: {
        report_type: "match_analysis",
        gr4de_score: results.scoring_metrics?.overall_score || 0,
        report_id: report?.report_id,
        pdf_url: pdfUrl,
      },
      created_at: new Date().toISOString(),
    });
  }
}
