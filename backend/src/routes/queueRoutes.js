import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { supabase } from "../config/supabase.config.js";
import { QUEUE_STATUS, USER_ROLES } from "../utils/constants.js";
import { RESPONSES } from "../utils/messages.js";

const router = express.Router();

// All queue routes require authentication
router.use(authenticateToken);

/**
 * Get queue status by ID
 */
router.get("/queue/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    // Get queue item with player data
    const { data: queueItem, error } = await supabase
      .from("processing_queue")
      .select(
        `
        id,
        status,
        logs,
        started_at,
        completed_at,
        created_at,
        player_data_id,
        player_data!inner(
          id,
          player_id
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res
          .status(404)
          .json(RESPONSES.NOT_FOUND("Queue item not found"));
      }
      throw error;
    }

    // Check ownership (users can only see their own queue items, admins can see all)
    if (
      role !== USER_ROLES.ADMIN &&
      queueItem.player_data.player_id !== userId
    ) {
      return res.status(403).json(RESPONSES.FORBIDDEN("Access denied"));
    }

    res.json(
      RESPONSES.SUCCESS("Queue status retrieved", {
        queue_id: queueItem.id,
        status: queueItem.status,
        logs: queueItem.logs,
        started_at: queueItem.started_at,
        completed_at: queueItem.completed_at,
        created_at: queueItem.created_at,
      })
    );
  } catch (error) {
    console.error("Get queue status error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to get queue status"));
  }
});

/**
 * Retry failed queue item (admin only)
 */
router.post(
  "/queue/:id/retry",
  requireRole([USER_ROLES.ADMIN]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get current queue item
      const { data: queueItem, error: fetchError } = await supabase
        .from("processing_queue")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          return res
            .status(404)
            .json(RESPONSES.NOT_FOUND("Queue item not found"));
        }
        throw fetchError;
      }

      if (queueItem.status !== QUEUE_STATUS.FAILED) {
        return res
          .status(400)
          .json(
            RESPONSES.BAD_REQUEST("Only failed queue items can be retried")
          );
      }

      if ((queueItem.last_retry_at || 0) >= (queueItem.max_retries || 3)) {
        return res
          .status(400)
          .json(RESPONSES.BAD_REQUEST("Maximum retry attempts exceeded"));
      }

      // Reset queue item for retry with exponential backoff
      const retryCount = (queueItem.last_retry_at || 0) + 1;
      const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 300000); // Max 5 minutes

      const { data: updatedItem, error: updateError } = await supabase
        .from("processing_queue")
        .update({
          status: QUEUE_STATUS.PENDING,
          logs: `Retry ${retryCount} scheduled at ${new Date(
            Date.now() + backoffDelay
          ).toISOString()}`,
          started_at: null,
          completed_at: null,
          last_retry_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Schedule retry with backoff delay
      setTimeout(async () => {
        try {
          // Re-trigger model server call
          const { data: playerData } = await supabase
            .from("player_data")
            .select("*")
            .eq("id", queueItem.player_data_id)
            .single();

          const { callModelServer } = await import(
            "../services/modelService.js"
          );
          await callModelServer({
            job_id: id,
            player_data_id: playerData.id,
            player_id: playerData.player_id,
            video_url: playerData.file_url, // Updated field name
            gps_url: playerData.file_url, // Updated field name
            event_json_url: null,
            match_metadata: {},
          });
        } catch (error) {
          console.error("Retry failed:", error);
          // Update status to failed again
          await supabase
            .from("processing_queue")
            .update({
              status: QUEUE_STATUS.FAILED,
              logs: `Retry ${retryCount} failed: ${error.message}`,
            })
            .eq("id", id);
        }
      }, backoffDelay);

      res.json(
        RESPONSES.SUCCESS("Queue item queued for retry", {
          queue_id: updatedItem.id,
          status: updatedItem.status,
          next_retry_at: new Date(Date.now() + backoffDelay).toISOString(),
        })
      );
    } catch (error) {
      console.error("Retry queue error:", error);
      res
        .status(500)
        .json(RESPONSES.SERVER_ERROR("Failed to retry queue item"));
    }
  }
);

export default router;
