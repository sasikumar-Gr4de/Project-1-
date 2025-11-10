import { supabase } from "../config/supabase.config.js";
import { RESPONSES } from "../utils/messages.js";
import { QUEUE_STATUS } from "../utils/constants.js";
import { callModelServer } from "../services/modelService.js";

/**
 * Handle video + data upload and queue processing
 */
export const createUpload = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const {
      video_url,
      gps_url,
      event_json,
      match_date,
      upload_source = "web",
      metadata = {},
    } = req.body;

    // Insert player_data record directly using userId as player_id
    const { data: playerData, error: dataError } = await supabase
      .from("player_data")
      .insert({
        player_id: userId,
        video_url,
        gps_url,
        file_type: video_url ? "video" : gps_url ? "gps" : "csv",
        status: "uploaded",
        metadata,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dataError) throw dataError;

    // Insert processing_queue record
    const { data: queueItem, error: queueError } = await supabase
      .from("processing_queue")
      .insert({
        player_data_id: playerData.id,
        status: QUEUE_STATUS.PENDING,
        idempotency_key: `upload_${playerData.id}_${Date.now()}`,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (queueError) throw queueError;

    // Call model server asynchronously (don't wait for response)
    callModelServer({
      job_id: queueItem.id,
      player_data_id: playerData.id,
      player_id: userId,
      video_url,
      gps_url,
      event_json_url: null, // For now, event_json is stored directly
      match_metadata: metadata,
    }).catch((error) => {
      console.error("Model server call failed:", error);
      // Update queue status to failed
      supabase
        .from("processing_queue")
        .update({
          status: QUEUE_STATUS.FAILED,
          logs: `Model server error: ${error.message}`,
        })
        .eq("id", queueItem.id);
    });

    res.json(
      RESPONSES.SUCCESS("Upload queued successfully", {
        queue_id: queueItem.id,
        player_data_id: playerData.id,
        status: QUEUE_STATUS.PENDING,
      })
    );
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to process upload"));
  }
};
