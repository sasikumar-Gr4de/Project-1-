import express from "express";
import {
  createData,
  changeDataStatus,
  getDataByPlayerId,
  getAnalysisCallback,
} from "../controllers/dataController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  createDataSchema,
  changeDataStatusSchema,
} from "../middleware/validation.js";
import { handleModelCallback } from "../services/modelService.js";
import { supabase } from "../config/supabase.config.js";
import { QUEUE_STATUS } from "../utils/constants.js";

const router = express.Router();

// Analysis Callbacks - No authentication required for model server callbacks
router.post("/callbacks", async (req, res) => {
  try {
    const { job_id, status, ...results } = req.body;

    if (status === "completed") {
      await handleModelCallback(job_id, results);
      res.json({ success: true, message: "Results processed successfully" });
    } else {
      // Handle failed processing
      await supabase
        .from("processing_queue")
        .update({
          status: "failed",
          logs: `Model processing failed: ${results.error || "Unknown error"}`,
        })
        .eq("id", job_id);

      res.json({ success: true, message: "Failure recorded" });
    }
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Legacy callback route for backwards compatibility
router.use("/callbacks", getAnalysisCallback);

router.use(authenticateToken);

router.get("/", getDataByPlayerId);

// Protected routes
router.post("/", validate(createDataSchema), createData);
router.post("/:dataId", validate(changeDataStatusSchema), changeDataStatus);

export default router;
